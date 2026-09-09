package com.gakudo.content.service;

import com.gakudo.content.dto.ai.AiChunkBatchRequest;
import com.gakudo.content.dto.ai.AiChunkBatchResponse;
import com.gakudo.content.dto.ai.AiChunkPlanItem;
import com.gakudo.content.model.ChunkGenerationBatch;
import com.gakudo.content.model.ChunkGenerationBatchStatus;
import com.gakudo.content.model.ChunkGenerationJob;
import com.gakudo.content.model.ChunkGenerationJobStatus;
import com.gakudo.content.repository.ChunkGenerationJobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ChunkGenerationWorker {
    private static final Logger log = LoggerFactory.getLogger(ChunkGenerationWorker.class);

    private final ChunkGenerationJobRepository jobRepository;
    private final SourceChunkService sourceChunkService;
    private final ChunkGenerationBatchService batchService;
    private final ChunkGenerationFinalizationService finalizationService;

    public ChunkGenerationWorker(
            ChunkGenerationJobRepository jobRepository,
            SourceChunkService sourceChunkService,
            ChunkGenerationBatchService batchService,
            ChunkGenerationFinalizationService finalizationService) {
        this.jobRepository = jobRepository;
        this.sourceChunkService = sourceChunkService;
        this.batchService = batchService;
        this.finalizationService = finalizationService;
    }

    @Async
    public void processJobAsync(UUID jobId) {
        processJob(jobId);
    }

    public void processJob(UUID jobId) {
        ChunkGenerationJob job = jobRepository.findById(jobId).orElse(null);
        if (job == null || job.getStatus() != ChunkGenerationJobStatus.PENDING) {
            return;
        }

        UUID documentId = job.getDocument().getId();
        markRunning(job);

        try {
            List<AiChunkBatchRequest> requests = sourceChunkService.buildAiChunkBatchRequests(
                    documentId,
                    job.getReviewFeedback());
            Map<Integer, AiChunkBatchRequest> requestsByIndex = indexRequests(requests);
            List<ChunkGenerationBatch> batchEntities = batchService.findByJobId(jobId);
            List<AiChunkPlanItem> plans = new ArrayList<>();

            for (ChunkGenerationBatch batch : batchEntities) {
                AiChunkBatchRequest request = requestsByIndex.get(batch.getBatchIndex());
                if (request == null) {
                    throw new IllegalStateException(
                            "No request found for batch " + batch.getBatchIndex());
                }

                if (batch.getStatus() == ChunkGenerationBatchStatus.SUCCEEDED
                        && batch.getResponseJson() != null
                        && !batch.getResponseJson().isBlank()) {
                    plans.addAll(batchService.readPlans(batch));
                    updateProgress(jobId, batch.getBatchIndex());
                    continue;
                }

                batchService.markRunning(batch.getId());

                try {
                    AiChunkBatchResponse response = sourceChunkService.generateAiChunkPlan(request);
                    if (response != null && response.getChunks() != null) {
                        plans.addAll(response.getChunks());
                    }

                    batchService.markSucceeded(batch.getId(), response);
                    updateProgress(jobId, batch.getBatchIndex());
                } catch (Exception exception) {
                    batchService.markFailed(batch.getId(), exception);
                    throw exception;
                }
            }

            finalizationService.finalizeJob(jobId, documentId, plans);
        } catch (Exception exception) {
            markFailed(jobId, exception);
            log.error("Chunk generation job failed. jobId={}, documentId={}", jobId, documentId, exception);
        }
    }

    private Map<Integer, AiChunkBatchRequest> indexRequests(List<AiChunkBatchRequest> requests) {
        Map<Integer, AiChunkBatchRequest> requestsByIndex = new HashMap<>();
        for (AiChunkBatchRequest request : requests) {
            requestsByIndex.put(request.getBatchIndex(), request);
        }
        return requestsByIndex;
    }

    private void markRunning(ChunkGenerationJob job) {
        job.setStatus(ChunkGenerationJobStatus.RUNNING);
        job.setStartedAt(LocalDateTime.now());
        jobRepository.save(job);
    }

    private void updateProgress(UUID jobId, int completedBatches) {
        jobRepository.findById(jobId).ifPresent(job -> {
            job.setCompletedBatches(completedBatches);
            jobRepository.save(job);
        });
    }

    private void markFailed(UUID jobId, Exception exception) {
        jobRepository.findById(jobId).ifPresent(job -> {
            job.setStatus(ChunkGenerationJobStatus.FAILED);
            job.setCompletedAt(LocalDateTime.now());
            job.setErrorMessage(errorMessage(exception));
            jobRepository.save(job);
        });
    }

    private String errorMessage(Exception exception) {
        if (exception.getMessage() != null && !exception.getMessage().isBlank()) {
            return exception.getMessage();
        }
        return exception.getClass().getSimpleName();
    }
}
