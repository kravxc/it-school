package com.example.it.school.dto.topic;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopicResponse {
    private Long id;
    private String title;
    private String description;
    private Long gradeId;
    private String gradeName;
    private String gradeDisplayName;
    private Integer lessonsCount;
    private LocalDateTime createdAt;
}
