package com.example.it.school.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String gradeName;
    private String email;
    private String role;
    private Long gradeId;
    private String gradeDisplayName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
