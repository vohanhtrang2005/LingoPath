package com.gakudo.learning.repository;

import com.gakudo.learning.model.DailyLearningItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DailyLearningItemRepository extends JpaRepository<DailyLearningItem, UUID> {
}
