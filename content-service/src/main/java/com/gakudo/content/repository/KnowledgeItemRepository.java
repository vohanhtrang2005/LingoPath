package com.gakudo.content.repository;

import com.gakudo.content.model.KnowledgeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface KnowledgeItemRepository extends JpaRepository<KnowledgeItem, UUID> {
    List<KnowledgeItem> findByLanguageAndLevelSystemAndLevelCodeAndStatusOrderByOrderIndexAsc(
            String language,
            String levelSystem,
            String levelCode,
            String status
    );

    List<KnowledgeItem> findByLanguageAndLevelSystemAndLevelCodeAndStatusAndTypeOrderByOrderIndexAsc(
            String language,
            String levelSystem,
            String levelCode,
            String status,
            String type
    );
}
