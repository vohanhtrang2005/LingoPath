package com.gakudo.content.repository;

import com.gakudo.content.model.ChunkGenerationBatch;
import com.gakudo.content.model.ChunkGenerationBatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChunkGenerationBatchRepository extends JpaRepository<ChunkGenerationBatch, UUID> {
    List<ChunkGenerationBatch> findByJobIdOrderByBatchIndexAsc(UUID jobId);

    Optional<ChunkGenerationBatch> findByJobIdAndBatchIndex(UUID jobId, Integer batchIndex);

    List<ChunkGenerationBatch> findByJobIdAndStatusOrderByBatchIndexAsc(
            UUID jobId,
            ChunkGenerationBatchStatus status);

    void deleteByJobId(UUID jobId);
}
