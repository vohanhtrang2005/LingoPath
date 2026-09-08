package com.gakudo.content.repository;

import com.gakudo.content.model.PracticeItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PracticeItemRepository extends JpaRepository<PracticeItem, UUID> {
    List<PracticeItem> findByLanguageAndLevelSystemAndLevelCodeAndStatusOrderByOrderIndexAsc(
            String language,
            String levelSystem,
            String levelCode,
            String status);

    List<PracticeItem> findByLanguageAndLevelSystemAndLevelCodeAndSkillAndStatusOrderByOrderIndexAsc(
            String language,
            String levelSystem,
            String levelCode,
            String skill,
            String status);

    List<PracticeItem> findBySourceExerciseIdOrderByOrderIndexAsc(UUID sourceExerciseId);
}
