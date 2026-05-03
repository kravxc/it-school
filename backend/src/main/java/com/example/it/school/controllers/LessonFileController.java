package com.example.it.school.controllers;

import com.example.it.school.dto.file.FileResponse;
import com.example.it.school.dto.file.LessonFileRequest;
import com.example.it.school.services.LessonFileService;
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
@RequestMapping("/api/lesson-files")
@RequiredArgsConstructor
@Slf4j
public class LessonFileController {

    private final LessonFileService lessonFileService;

    @PostMapping
    @PreAuthorize("hasAnyRole('admin')")
    public ResponseEntity<FileResponse> attachFileToLesson(@Valid @RequestBody LessonFileRequest request){
        log.info("POST /api/lesson-files - attach file {} to lesson {}", request.getFileId(), request.getLessonId());
        return ResponseEntity.status(HttpStatus.CREATED).body(lessonFileService.attachFileToLesson(request));
    }

    @GetMapping("/lesson/{lessonId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FileResponse>> getFilesByLesson(@PathVariable Long lessonId){
        log.info("GET api/lesson-files/lesson/{} -- get files by lesson id", lessonId);
        return ResponseEntity.ok(lessonFileService.getFilesByLessonId(lessonId));
    }

    @DeleteMapping("lesson/{lessonId}/file/{fileId}")
    @PreAuthorize("hasAnyRole('admin')")
    public ResponseEntity<Void> detachFileFromLesson(
            @PathVariable Long lessonId,
            @PathVariable Long fileId){
        log.info("DELETE /api/lesson-files/{}/file/{} - detach file", lessonId, fileId);
        lessonFileService.detachFileFromLesson(lessonId, fileId);
        return ResponseEntity.noContent().build();
    }

}
