package com.example.it.school.repository;

import com.example.it.school.entity.AdditionalMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdditionalMaterialRepository extends JpaRepository<AdditionalMaterial, Long> {

    List<AdditionalMaterial> findByLessonId(Long lessonId);

    List<AdditionalMaterial> findByLessonIdOrderByCreatedAtDesc(Long lessonId);

    List<AdditionalMaterial> findByType(String type);

    List<AdditionalMaterial> findByLessonIdAndType(Long lessonId, String type);

    boolean existsByLessonIdAndTitle(Long lessonId, String title);

}
