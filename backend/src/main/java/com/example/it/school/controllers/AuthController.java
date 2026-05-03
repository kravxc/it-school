package com.example.it.school.controllers;

import com.example.it.school.dto.auth.LoginRequest;
import com.example.it.school.dto.auth.SignupRequest;
import com.example.it.school.dto.auth.SignupResponse;
import com.example.it.school.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest request){
        log.info("POST /api/auth/signup - email: {}", request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<SignupResponse> login(@Valid @RequestBody LoginRequest request){
        log.info("POST /api/auth/login - email: {}", request.getEmail());
        return ResponseEntity.ok(authService.login(request));
    }
}
