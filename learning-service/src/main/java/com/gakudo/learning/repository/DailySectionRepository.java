package com.gakudo.learning.repository;

import com.gakudo.learning.model.DailySection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DailySectionRepository extends JpaRepository<DailySection, UUID> {
}
