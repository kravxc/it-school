package com.example.it.school.controllers;

import com.example.it.school.dto.topic.TopicRequest;
import com.example.it.school.dto.topic.TopicResponse;
import com.example.it.school.services.TopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@Slf4j
public class TopicController {

    private final TopicService topicService;

    @PostMapping
    @PreAuthorize("hasAnyRole('teacher', 'admin')")
    public ResponseEntity<TopicResponse> createTopic(@Valid @RequestBody TopicRequest request){
        log.info("POST /api/topics - create topic: {}", request.getTitle());
        TopicResponse response = topicService.createTopic(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TopicResponse>> getAllTopics(){
        log.info("GET /api/topics - get all topics");
        return ResponseEntity.ok(topicService.getAllTopics());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TopicResponse> getTopicId(@PathVariable Long id){
        log.info("GET /api/topics/{} - get topic by id", id);
        return ResponseEntity.ok(topicService.getTopicById(id));
    }

    @GetMapping("/grade/{gradeId}")
    @PreAuthorize("isAuthenticated()")
    public  ResponseEntity<List<TopicResponse>> getTopicsGradeId(@PathVariable Long gradeId){
        log.info("GET /api/topics/grade/{} - get topics by grade", gradeId);
        return ResponseEntity.ok(topicService.getTopicsByGradeId(gradeId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('teacher', 'admin')")
    public ResponseEntity<TopicResponse> updateTopic(
            @PathVariable Long id,
            @Valid @RequestBody TopicRequest request){
        log.info("PUT '/api/topics/{} - update topic", id);
        return ResponseEntity.ok(topicService.updateTopic(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin')")
    public ResponseEntity<Void> deleteTopic(@PathVariable Long id){
        log.info("DELETE /api/topics/{} - delete topic", id);
        topicService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TopicResponse>> searchTopics(@RequestParam String keyword){
        log.info("GET /api/topics/search - search topics with keyword: {}", keyword);
        return ResponseEntity.ok(topicService.searchTopics(keyword));
    }






}
