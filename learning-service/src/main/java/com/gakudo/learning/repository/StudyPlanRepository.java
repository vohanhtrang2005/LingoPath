package com.gakudo.learning.repository;

import com.gakudo.learning.model.StudyPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StudyPlanRepository extends JpaRepository<StudyPlan, UUID> {
    Optional<StudyPlan> findFirstByUserIdAndStatusOrderByCreatedAtDesc(UUID userId, String status);
}
