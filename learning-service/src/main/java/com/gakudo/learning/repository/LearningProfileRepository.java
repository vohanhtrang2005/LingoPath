package com.gakudo.learning.repository;

import com.gakudo.learning.model.LearningProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LearningProfileRepository extends JpaRepository<LearningProfile, UUID> {
}
