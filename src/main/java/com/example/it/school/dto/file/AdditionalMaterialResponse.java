package com.example.it.school.dto.file;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdditionalMaterialResponse {
    private Long id;
    private String title;
    private String description;
    private String link;
    private String type;
    private Long lessonId;
    private Long fileId;
    private String fileName;
    private LocalDateTime createdAt;
}
