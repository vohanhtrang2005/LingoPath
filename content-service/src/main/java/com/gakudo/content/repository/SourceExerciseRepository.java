package com.gakudo.content.repository;

import com.gakudo.content.model.SourceExercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SourceExerciseRepository extends JpaRepository<SourceExercise, UUID> {
    List<SourceExercise> findByLanguageAndLevelSystemAndLevelCodeOrderBySectionOrderAscPageStartAsc(
            String language,
            String levelSystem,
            String levelCode);

    List<SourceExercise> findByBookIdOrderBySectionOrderAscPageStartAsc(UUID bookId);
}
