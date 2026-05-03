package com.example.it.school.repository;

import com.example.it.school.entity.LessonFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonFileRepository extends JpaRepository<LessonFile, Long> {

    List<LessonFile> findByLessonId(Long lessonId);

    List<LessonFile> findByFileId(Long fileId);

    List<LessonFile> findByLessonIdAndFileId(Long lessonId, Long fileId);

    boolean existsByLessonIdAndFileId(Long lessonId, Long fileId);

    void deleteByLessonIdAndFileId(Long lessonId, Long fileId);

    void deleteByLessonId(Long lessonId);

    void deleteByFileId(Long fileId);
}
