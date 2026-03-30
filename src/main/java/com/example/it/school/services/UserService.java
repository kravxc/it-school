package com.example.it.school.services;

import com.example.it.school.dto.user.UserRequest;
import com.example.it.school.dto.user.UserResponse;
import com.example.it.school.entity.Grade;
import com.example.it.school.entity.User;
import com.example.it.school.exception.ResourceNotFoundException;
import com.example.it.school.repository.GradeRepository;
import com.example.it.school.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    private final GradeRepository gradeRepository;

    @Transactional
    public UserResponse bindUserWithGrade(UserRequest request, Long userId){
        log.info("Binding user {} to grade {}", userId, request.getGradeId());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Grade grade = gradeRepository.findById(request.getGradeId())
                .orElseThrow(() -> new ResourceNotFoundException("Grade", "id", request.getGradeId()));

        user.setGrade(grade);

        User savedUser = userRepository.save(user);
        log.info("User {} successfully bound to grade {}", user.getName(), grade.getDisplayName());

        return mapToResponse(savedUser);
    }

    @Transactional
    public UserResponse undbindUserFromGrade(Long userId){
        log.info("Unbinding user {} from grade", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setGrade(null);

        User savedUser = userRepository.save(user);
        log.info("User {} successfully unbound from grade", user.getName());

        return mapToResponse(savedUser);
    }
    private UserResponse mapToResponse(User user){

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().getName() : null)
                .gradeId(user.getGrade() != null ? user.getGrade().getId() : null)
                .gradeName(user.getGrade() != null ? user.getGrade().getName() : null)
                .gradeDisplayName(user.getGrade() != null ? user.getGrade().getDisplayName() : null)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
