package com.example.it.school.controllers;

import com.example.it.school.dto.task.TaskRequest;
import com.example.it.school.dto.task.TaskResponse;
import com.example.it.school.services.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Slf4j
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("hasAnyRole('admin')")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request){
        log.info("POST /api/tasks - create task: {}", request.getTitle());
        TaskResponse response = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id){
        log.info("GET /api/tasks/{} - get task by id", id);
        return  ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping("/lesson/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TaskResponse>> getTasksByLessonId(@PathVariable Long id){
        log.info("GET /api/tasks/lesson/{} - get tasks by lesson id", id);
        return ResponseEntity.ok(taskService.getTasksByLessonId(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin')")
    public ResponseEntity<TaskResponse> updateTask(
            @Valid @RequestBody
            TaskRequest request,
            @PathVariable Long id){
        log.info("PUT /api/tasks/{} - update task by id", id);
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin')")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id){
        log.info("DELETE /api/tasks/{} - delete topic by id", id);
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TaskResponse>> searchTasks(@RequestParam String keyword){
        log.info("GET /api/tasks/search - search tasks with keyword: {}", keyword);
        return ResponseEntity.ok(taskService.searchTasks(keyword));
    }
}
