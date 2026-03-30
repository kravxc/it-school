package com.example.it.school.dto.file;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonFileRequest {

    @NotNull(message = "Lesson ID is required")
    private Long lessonId;

    @NotNull(message = "File ID is required")
    private Long fileId;
}
