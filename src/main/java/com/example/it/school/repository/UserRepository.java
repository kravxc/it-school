package com.example.it.school.repository;

import com.example.it.school.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    List<User> findByGradeId(Long id);

    Optional<User> findByIdAndGradeId(Long userId, Long gradeId);

    boolean existsByGradeId(Long gradeId);
}
