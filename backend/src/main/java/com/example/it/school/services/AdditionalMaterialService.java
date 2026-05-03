package com.example.it.school.services;

import com.example.it.school.dto.file.AdditionalMaterialRequest;
import com.example.it.school.dto.file.AdditionalMaterialResponse;
import com.example.it.school.entity.AdditionalMaterial;
import com.example.it.school.entity.File;
import com.example.it.school.entity.Lesson;
import com.example.it.school.exception.ResourceNotFoundException;
import com.example.it.school.repository.AdditionalMaterialRepository;
import com.example.it.school.repository.FileRepository;
import com.example.it.school.repository.LessonRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdditionalMaterialService {

    private final AdditionalMaterialRepository additionalMaterialRepository;
    private final LessonRepository lessonRepository;
    private final FileRepository fileRepository;

    @Transactional
    public AdditionalMaterialResponse createdAdditionalMaterial(AdditionalMaterialRequest request) {
        log.info("Creating additional material: {}", request.getTitle());

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", request.getLessonId()));

        File file = null;
        if (request.getFileId() != null) {
            file = fileRepository.findById(request.getFileId())
                    .orElseThrow(() -> new ResourceNotFoundException("File", "id", request.getFileId()));
        }

        AdditionalMaterial material = AdditionalMaterial.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .link(request.getLink())
                .type(request.getType())
                .lesson(lesson)
                .file(file)
                .build();

        AdditionalMaterial savedAM = additionalMaterialRepository.save(material);
        log.info("Additional material created: {}", savedAM);

        return mapToResponse(savedAM);
    }

    public List<AdditionalMaterialResponse> getMaterialsByLessonId(Long lessonId){
        log.info("Fetching additional materials by lesson: {}", lessonId);

        if (!lessonRepository.existsById(lessonId)){
            throw new ResourceNotFoundException("Lesson", "id", lessonId);
        }

        return additionalMaterialRepository.findByLessonIdOrderByCreatedAtDesc(lessonId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AdditionalMaterialResponse getMaterialById(Long id){
        AdditionalMaterial material = additionalMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AdditionalMaterial", "id", id));

        return mapToResponse(material);
    }

    @Transactional
    public AdditionalMaterialResponse updateMaterial(Long id, AdditionalMaterialRequest request){
        log.info("Updating additional material: {}", id);

        AdditionalMaterial additionalMaterial = additionalMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AdditionalMaterial", "id", id));

        additionalMaterial.setTitle(request.getTitle());
        additionalMaterial.setDescription(request.getDescription());
        additionalMaterial.setLink(request.getLink());
        additionalMaterial.setType(request.getType());

        if (request.getFileId() != null){
            File file = fileRepository.findById(request.getFileId())
                    .orElseThrow(() -> new ResourceNotFoundException("File", "id", request.getFileId()));
            additionalMaterial.setFile(file);
        }else{
            additionalMaterial.setFile(null);
        }
        AdditionalMaterial updated = additionalMaterialRepository.save(additionalMaterial);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteMaterial(Long id){
        AdditionalMaterial material = additionalMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AdditionalMaterial", "id", id));
        additionalMaterialRepository.delete(material);
        log.info("Additional material deleted: {}", id);
    }

    private AdditionalMaterialResponse mapToResponse(AdditionalMaterial material) {
        return AdditionalMaterialResponse.builder()
                .id(material.getId())
                .title(material.getTitle())
                .description(material.getDescription())
                .link(material.getLink())
                .type(material.getType())
                .lessonId(material.getLesson().getId())
                .fileId(material.getFile() != null ? material.getFile().getId() : null)
                .fileName(material.getFile() != null ? material.getFile().getName() : null)
                .createdAt(material.getCreatedAt())
                .build();
    }
}
