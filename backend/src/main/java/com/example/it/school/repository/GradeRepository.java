package com.example.it.school.repository;

import com.example.it.school.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    Optional<Grade> findByName(String name);
    Optional<Grade> findByDisplayName(String displayName);

    boolean existsByName(String name);
    boolean existsByDisplayName(String displayName);
}
