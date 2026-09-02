package com.gakudo.content.repository;

import com.gakudo.content.model.SourceReference;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SourceReferenceRepository extends JpaRepository<SourceReference, UUID> {
    List<SourceReference> findByKnowledgeItemId(UUID knowledgeItemId);
}
