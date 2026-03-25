package com.example.it.school.repository;

import com.example.it.school.entity.Lesson;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByTopicId(Long topicId);

    List<Lesson> findByTopicIdOrderByCreatedAtDesc(Long id);


    List<Lesson> findAllByTitleContainingIgnoreCase(String title);
    Optional<Lesson> findById(@NonNull Long id);

    List<Lesson> findByTitleContainingIgnoreCase(String title);

    boolean existsByTitleAndTopicId(String title, Long topicId);

    List<Lesson> findAllByOrderByCreatedAtDesc();


    long countByTopicId(Long topicId);

}
