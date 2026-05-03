package com.example.it.school.dto.file;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdditionalMaterialRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String link;

    private String type;

    @NotNull(message = "Lesson ID id required")
    private Long lessonId;

    private Long fileId;



}
