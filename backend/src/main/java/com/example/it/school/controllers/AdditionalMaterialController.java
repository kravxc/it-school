package com.example.it.school.controllers;

import com.example.it.school.dto.file.AdditionalMaterialRequest;
import com.example.it.school.dto.file.AdditionalMaterialResponse;
import com.example.it.school.services.AdditionalMaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/additional-materials")
@RequiredArgsConstructor
@Slf4j
public class AdditionalMaterialController {

    private final AdditionalMaterialService additionalMaterialService;

    @PostMapping
    @PreAuthorize("hasAnyRole('admin', 'teacher')")
    public ResponseEntity<AdditionalMaterialResponse> createMaterial(@Valid @RequestBody AdditionalMaterialRequest request){
        log.info("POST /api/additional-materials - create material: {}", request.getTitle());
        return ResponseEntity.status(HttpStatus.CREATED).body(additionalMaterialService.createdAdditionalMaterial(request));
    }

    @GetMapping("/lesson/{lessonId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AdditionalMaterialResponse>> getMaterialByLessonId(@PathVariable Long lessonId){
        log.info("GET /api/additional-materials/lesson/{} - get material by lesson",lessonId);
        return ResponseEntity.ok(additionalMaterialService.getMaterialsByLessonId(lessonId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'teacher')")
    public ResponseEntity<AdditionalMaterialResponse> getMaterialById(@PathVariable Long id){
        log.info("GET /api/additional-materials/{} - get material by id", id);
        return ResponseEntity.ok(additionalMaterialService.getMaterialById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'teacher')")
    public ResponseEntity<AdditionalMaterialResponse> updateMaterial(
            @PathVariable Long id,
            @Valid @RequestBody AdditionalMaterialRequest request){
        log.info("PUT /api/additional-materials/{} - update material", id);
        return ResponseEntity.ok(additionalMaterialService.updateMaterial(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'teacher')")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id){
        log.info("DELETE /api/additional-materials/{} - delete material", id);
        additionalMaterialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }

}
