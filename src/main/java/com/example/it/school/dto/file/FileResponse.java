package com.example.it.school.dto.file;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileResponse {
    private Long id;
    private String name;
    private String originalName;
    private String type;
    private String mimeType;
    private Long size;
    private String extension;
    private String downloadUrl;
    private LocalDateTime createdAt;
}
