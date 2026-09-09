package com.gakudo.content.service;

import com.gakudo.content.dto.ai.AiChunkBatchResponse;
import com.gakudo.content.dto.ai.AiChunkPlanItem;
import com.gakudo.content.model.ChunkGenerationBatch;
import com.gakudo.content.model.ChunkGenerationBatchStatus;
import com.gakudo.content.repository.ChunkGenerationBatchRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ChunkGenerationBatchService {
    private final ChunkGenerationBatchRepository batchRepository;
    private final ObjectMapper objectMapper;

    public ChunkGenerationBatchService(
            ChunkGenerationBatchRepository batchRepository,
            ObjectMapper objectMapper) {
        this.batchRepository = batchRepository;
        this.objectMapper = objectMapper;
    }

    public List<ChunkGenerationBatch> findByJobId(UUID jobId) {
        return batchRepository.findByJobIdOrderByBatchIndexAsc(jobId);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markRunning(UUID batchId) {
        ChunkGenerationBatch batch = getBatch(batchId);
        int attempts = batch.getAttempts() == null ? 0 : batch.getAttempts();
        batch.setAttempts(attempts + 1);
        batch.setStatus(ChunkGenerationBatchStatus.RUNNING);
        batch.setStartedAt(LocalDateTime.now());
        batch.setCompletedAt(null);
        batch.setErrorMessage(null);
        batchRepository.save(batch);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markSucceeded(UUID batchId, AiChunkBatchResponse response) {
        ChunkGenerationBatch batch = getBatch(batchId);
        batch.setResponseJson(writeJson(response));
        batch.setStatus(ChunkGenerationBatchStatus.SUCCEEDED);
        batch.setCompletedAt(LocalDateTime.now());
        batch.setErrorMessage(null);
        batchRepository.save(batch);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markFailed(UUID batchId, Exception exception) {
        ChunkGenerationBatch batch = getBatch(batchId);
        batch.setStatus(ChunkGenerationBatchStatus.FAILED);
        batch.setCompletedAt(LocalDateTime.now());
        batch.setErrorMessage(errorMessage(exception));
        batchRepository.save(batch);
    }

    public List<AiChunkPlanItem> readPlans(ChunkGenerationBatch batch) {
        if (batch.getResponseJson() == null || batch.getResponseJson().isBlank()) {
            return List.of();
        }

        try {
            AiChunkBatchResponse response = objectMapper.readValue(
                    batch.getResponseJson(),
                    AiChunkBatchResponse.class);
            return response == null || response.getChunks() == null
                    ? List.of()
                    : new ArrayList<>(response.getChunks());
        } catch (JacksonException exception) {
            throw new IllegalStateException(
                    "Stored AI response is invalid for batch " + batch.getBatchIndex(),
                    exception);
        }
    }

    private ChunkGenerationBatch getBatch(UUID batchId) {
        return batchRepository.findById(batchId)
                .orElseThrow(() -> new IllegalStateException(
                        "Chunk generation batch not found: " + batchId));
    }

    private String writeJson(AiChunkBatchResponse response) {
        try {
            return objectMapper.writeValueAsString(response);
        } catch (JacksonException exception) {
            throw new IllegalStateException("Could not store AI batch response", exception);
        }
    }

    private String errorMessage(Exception exception) {
        if (exception.getMessage() != null && !exception.getMessage().isBlank()) {
            return exception.getMessage();
        }
        return exception.getClass().getSimpleName();
    }
}
