package com.gakudo.content.service;

import com.gakudo.content.dto.ai.AiChunkPlanItem;
import com.gakudo.content.model.ChunkGenerationJob;
import com.gakudo.content.model.ChunkGenerationJobStatus;
import com.gakudo.content.repository.ChunkGenerationBatchRepository;
import com.gakudo.content.repository.ChunkGenerationJobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ChunkGenerationFinalizationService {
    private final ChunkGenerationJobRepository jobRepository;
    private final ChunkGenerationBatchRepository batchRepository;
    private final SourceChunkPersistenceService sourceChunkPersistenceService;

    public ChunkGenerationFinalizationService(
            ChunkGenerationJobRepository jobRepository,
            ChunkGenerationBatchRepository batchRepository,
            SourceChunkPersistenceService sourceChunkPersistenceService) {
        this.jobRepository = jobRepository;
        this.batchRepository = batchRepository;
        this.sourceChunkPersistenceService = sourceChunkPersistenceService;
    }

    @Transactional
    public void finalizeJob(
            UUID jobId,
            UUID documentId,
            List<AiChunkPlanItem> plans) {
        sourceChunkPersistenceService.persistChunks(documentId, plans);
        batchRepository.deleteByJobId(jobId);

        ChunkGenerationJob job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalStateException(
                        "Chunk generation job not found: " + jobId));
        job.setStatus(ChunkGenerationJobStatus.SUCCEEDED);
        job.setCompletedBatches(job.getTotalBatches());
        job.setCompletedAt(LocalDateTime.now());
        job.setErrorMessage(null);
        jobRepository.save(job);
    }
}
