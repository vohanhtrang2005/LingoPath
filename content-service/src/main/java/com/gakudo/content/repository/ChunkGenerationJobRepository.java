package com.gakudo.content.repository;

import com.gakudo.content.model.ChunkGenerationJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChunkGenerationJobRepository extends JpaRepository<ChunkGenerationJob, UUID> {
    Optional<ChunkGenerationJob> findByIdAndDocumentId(UUID jobId, UUID documentId);

    List<ChunkGenerationJob> findByDocumentIdOrderByCreatedAtDesc(UUID documentId);
}
