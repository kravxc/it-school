package com.example.it.school.repository;

import com.example.it.school.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    List<Topic> findByGradeId(Long gradeId);
    List<Topic> findByGradeIdOrderByCreatedAtDesc(Long gradeId);

    Optional<Topic>  findByTitle(String title);
    boolean existsByTitleAndGradeId(String title, Long gradeId);

    List<Topic> findTopicsByGradeIdOrderByCreatedAtDesc(Long gradeId);

    List<Topic> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String string, String description);
    List<Topic> findAllByOrderByCreatedAtDesc();
    List<Topic> findAllByOrderByTitleAsc();

}
