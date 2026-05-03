package com.example.it.school.dto.lesson;

import com.example.it.school.dto.task.TaskResponse;
import com.example.it.school.entity.Task;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonResponse {
    private Long id;
    private String title;
    private String description;
    private Long topicId;
    private String topicTitle;
    private Long gradeId;
    private String gradeName;
    private String gradeDisplayName;
    private List<TaskResponse> tasks;
    private Integer tasksCount;
    private Integer filesCount;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;
}
