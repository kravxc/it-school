package com.example.it.school.controllers;

import com.example.it.school.dto.user.UserRequest;
import com.example.it.school.dto.user.UserResponse;
import com.example.it.school.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PutMapping("/{userId}/bind-grade")
    @PreAuthorize("hasAnyRole('admin')")
    public ResponseEntity<UserResponse> bindUserWithGrade(
            @PathVariable Long userId,
            @Valid @RequestBody UserRequest request){
        log.info("PUT /api/users/{}/bind-grade - binding user to grade", userId);
        return ResponseEntity.ok(userService.bindUserWithGrade(request, userId));
    }

    @PutMapping("/{userId}/unbind-grade")
    @PreAuthorize("hasAnyRole('admin')")
    public ResponseEntity<UserResponse> unbindUserFromGrade(
            @PathVariable Long userId){
        log.info("PUT /api/users/{}/unbind-grade", userId);
        return ResponseEntity.ok(userService.undbindUserFromGrade(userId));
    }

}
