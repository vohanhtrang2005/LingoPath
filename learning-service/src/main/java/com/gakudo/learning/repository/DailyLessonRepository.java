package com.gakudo.learning.repository;

import com.gakudo.learning.model.DailyLesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DailyLessonRepository extends JpaRepository<DailyLesson, UUID> {
    List<DailyLesson> findByStudyPlanIdOrderByDayIndexAsc(UUID studyPlanId);
}
