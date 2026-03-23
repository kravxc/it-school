package com.example.it.school.services;

import com.example.it.school.dto.auth.LoginRequest;
import com.example.it.school.dto.auth.SignupRequest;
import com.example.it.school.dto.auth.SignupResponse;
import com.example.it.school.entity.Role;
import com.example.it.school.entity.User;
import com.example.it.school.exception.ResourceNotFoundException;
import com.example.it.school.repository.RoleRepository;
import com.example.it.school.repository.UserRepository;
import com.example.it.school.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    private static final Set<String> ALLOWED_ROLES = Set.of("admin", "teacher", "student");

    @Transactional
    public SignupResponse signup(SignupRequest request) {
        log.info("Register new user: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String roleName = request.getRoleName() != null ? request.getRoleName() : "student";

        if (!ALLOWED_ROLES.contains(roleName)) {
            log.warn("Invalid role: {}, defaulting to student", roleName);
            throw new RuntimeException("Invalid role: " + roleName +". Allowed roles " + ALLOWED_ROLES);
        }

        log.info("Looking for role: {}", roleName);

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName));

        log.info("Role found: {} with ID: {}", role.getName(), role.getId());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {} with role: {}", savedUser.getEmail(), role.getName());

        String token = jwtService.generateToken(savedUser);

        return SignupResponse.builder()
                .token(token)
                .type("Bearer")
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(role.getName())
                .expiresIn(86400000L)
                .build();
    }

    public SignupResponse login(LoginRequest request) {
        log.info("Login attempt: {}", request.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();
            String token = jwtService.generateToken(user);
            log.info("User logged in successfully: {} with role: {}", user.getEmail(), user.getRole().getName());

            return SignupResponse.builder()
                    .token(token)
                    .type("Bearer")
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole().getName())
                    .expiresIn(86400000L)
                    .build();

        } catch (Exception e) {
            log.error("Invalid credentials for: {}", request.getEmail());
            throw new RuntimeException("Invalid email or password");
        }
    }
}