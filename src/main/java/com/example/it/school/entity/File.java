package com.example.it.school.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "files")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String original_name;

    private String path;

    private String type;

    @Column(name = "mime_type")
    private String mimeType;

    private int size;

    private String extension;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "file")
    private List<LessonFile> lessonFiles;

    @OneToMany(mappedBy = "file")
    private List<AdditionalMaterial> additionalMaterials;


}
