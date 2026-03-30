package com.example.it.school.services;

import com.example.it.school.dto.task.TaskRequest;
import com.example.it.school.dto.task.TaskResponse;
import com.example.it.school.dto.topic.TopicResponse;
import com.example.it.school.entity.Lesson;
import com.example.it.school.entity.Task;
import com.example.it.school.exception.ResourceNotFoundException;
import com.example.it.school.repository.LessonRepository;
import com.example.it.school.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final LessonRepository lessonRepository;

    @Transactional
    public TaskResponse createTask(TaskRequest request){
        log.info("Creating task: {}", request.getTitle());

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", request.getLessonId()));

        if (taskRepository.existsByTitleAndLessonId(request.getTitle(), request.getLessonId())){
            throw new RuntimeException("Task with title '" + request.getTitle() + "'already exists it this lesson");
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .content(request.getContent())
                .difficulty(request.getDifficulty())
                .lesson(lesson)
                .build();

        Task savedTask = taskRepository.save(task);
        log.info("Task created successfully with id: {}", savedTask.getId());

        return mapToResponse(savedTask);
    }

    public TaskResponse getTaskById(Long id){
        log.info("Fetching task by id: {}", id);

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return mapToResponse(task);
    }

    public List<TaskResponse> getTasksByLessonId(Long lessonId){
        log.info("Fetching tasks by lesson id: {}", lessonId);

        if (!lessonRepository.existsById(lessonId)){
            throw new ResourceNotFoundException("Lesson", "id", lessonId);
        }

        return taskRepository.findAllByLessonIdOrderByCreatedAtDesc(lessonId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request){
        log.info("Updating task with id: {}", id);

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (!task.getLesson().getId().equals(request.getLessonId())){
            Lesson newLesson = lessonRepository.findById(request.getLessonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id));

            task.setLesson(newLesson);
        }

        if (!task.getTitle().equals(request.getTitle()) ||
            !task.getLesson().getId().equals(request.getLessonId())){
            if (taskRepository.existsByTitleAndLessonId(request.getTitle(), request.getLessonId())){
                throw new RuntimeException("Task with title '" + request.getTitle() + "' already exists in this lesson");
            }
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setContent(request.getContent());
        task.setDifficulty(request.getDifficulty());

        Task updatedTask = taskRepository.save(task);
        log.info("Task updated successfully: {}", updatedTask.getId());

        return mapToResponse(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id){
        log.info("Deleting task with id: {}", id);

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        taskRepository.delete(task);
        log.info("Task deleted successfully: {}", id);
    }

    public List<TaskResponse> searchTasks(String keyword){
        log.info("Searching tasks with keyword: {}", keyword);

        return taskRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrContentContainingIgnoreCase(keyword, keyword, keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> searchTasksInLesson(String keyword, Long lessonId){
        log.info("Searching tasks by lesson id with keyword: {}", keyword);

        if (!lessonRepository.existsById(lessonId)){
            throw new ResourceNotFoundException("Lesson", "id", lessonId);
        }

        List<Task> results = new ArrayList<>();

        results.addAll(taskRepository.findByLessonIdAndTitleContainingIgnoreCase(lessonId, keyword));
        results.addAll(taskRepository.findByLessonIdAndDescriptionContainingIgnoreCase(lessonId, keyword));
        results.addAll(taskRepository.findByLessonIdAndContentContainingIgnoreCase(lessonId, keyword));

        List<Task> uniqueResults = results.stream()
                .distinct()
                .toList();

        return uniqueResults.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TaskResponse mapToResponse(Task task){

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .content(task.getContent())
                .difficulty(task.getDifficulty())
                .lessonId(task.getLesson().getId())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
