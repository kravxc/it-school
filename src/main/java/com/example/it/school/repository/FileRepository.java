package com.example.it.school.repository;

import com.example.it.school.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {
    Optional<File> findByOriginalName(String originalName);

    List<File> findByNameContainingIgnoreCase(String name);

    List<File> findByType(String type);

    List<File> findAllByOrderByCreatedAtDesc();
}
