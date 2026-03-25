package com.example.it.school.controllers;

import com.example.it.school.dto.lesson.LessonRequest;
import com.example.it.school.dto.lesson.LessonResponse;
import com.example.it.school.repository.LessonRepository;
import com.example.it.school.services.LessonService;
import jakarta.persistence.PreRemove;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
@Slf4j
public class LessonController {
    private final LessonService lessonService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LessonResponse>> getAllLessons(){
        log.info("GET /api/lessons = get all lessons");
        return ResponseEntity.ok(lessonService.getAllLessons());

    }

    @PostMapping
    @PreAuthorize("hasAnyRole('admin')")
    public ResponseEntity<LessonResponse> createLesson(@Valid @RequestBody LessonRequest request){
        log.info("POST /api/lessons - create lesson: {}", request.getTitle());
        LessonResponse response = lessonService.createLesson(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<LessonResponse> getLessonId(@PathVariable Long id){
        log.info("GET /api/lessons/{} - get lesson by id", id);
        return ResponseEntity.ok(lessonService.getLessonById(id));
    }

    @GetMapping("topic/{topicId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LessonResponse>> getLessonByTopicId(@PathVariable Long topicId){
        log.info("GET /api/lessons/topic/{} - get lessons by topic", topicId);
        return ResponseEntity.ok(lessonService.getLessonsByTopicId(topicId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'teacher')")
    public ResponseEntity<LessonResponse> updateLesson(
            @PathVariable Long id,
            @Valid @RequestBody LessonRequest request){
        log.info("PUT /api/lessons/{} - update lesson", id);
        return ResponseEntity.ok(lessonService.updateLesson(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin')")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id){
        log.info("DELETE /api/lessons/{} - delete lesson", id);
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LessonResponse>> searchLessons(@RequestParam String keyword){
        log.info("GET api/lessons/search - search lessons with keyword: {}", keyword);
        return ResponseEntity.ok(lessonService.searchLessons(keyword));
    }
}
