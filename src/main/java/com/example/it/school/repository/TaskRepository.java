package com.example.it.school.repository;

import com.example.it.school.entity.Task;
import jakarta.validation.constraints.NotNull;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Optional<Task> findById(@NonNull Long id);

    boolean existsByTitleAndLessonId(String title, Long lessonId);

    List<Task> findAllByLessonIdOrderByCreatedAtDesc(Long lessonId);

    List<Task> findByLessonIdAndTitleContainingIgnoreCase(Long lessonId, String Title);

    List<Task> findByLessonIdAndDescriptionContainingIgnoreCase(Long lessonId, String keyword);

    List<Task> findByLessonIdAndContentContainingIgnoreCase(Long lessonId, String keyword);

    List<Task> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String description, String content);

}
