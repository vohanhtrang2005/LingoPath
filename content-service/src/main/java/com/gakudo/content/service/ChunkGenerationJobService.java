package com.gakudo.content.service;

import com.gakudo.content.dto.ai.AiChunkBatchRequest;
import com.gakudo.content.dto.response.ChunkGenerationJobResponse;
import com.gakudo.content.model.BookDocument;
import com.gakudo.content.model.ChunkGenerationBatch;
import com.gakudo.content.model.ChunkGenerationBatchStatus;
import com.gakudo.content.model.ChunkGenerationJob;
import com.gakudo.content.model.ChunkGenerationJobStatus;
import com.gakudo.content.repository.BookDocumentRepository;
import com.gakudo.content.repository.ChunkGenerationBatchRepository;
import com.gakudo.content.repository.ChunkGenerationJobRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ChunkGenerationJobService {
    private final BookDocumentRepository documentRepository;
    private final ChunkGenerationBatchRepository batchRepository;
    private final ChunkGenerationJobRepository jobRepository;
    private final SourceChunkService sourceChunkService;

    public ChunkGenerationJobService(
            BookDocumentRepository documentRepository,
            ChunkGenerationBatchRepository batchRepository,
            ChunkGenerationJobRepository jobRepository,
            SourceChunkService sourceChunkService) {
        this.documentRepository = documentRepository;
        this.batchRepository = batchRepository;
        this.jobRepository = jobRepository;
        this.sourceChunkService = sourceChunkService;
    }

    @Transactional
    public ChunkGenerationJobResponse createJob(UUID documentId, String feedback) {
        BookDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));

        String normalizedFeedback = feedback == null ? null : feedback.trim();
        List<AiChunkBatchRequest> batches = sourceChunkService.buildAiChunkBatchRequests(
                documentId,
                normalizedFeedback);

        ChunkGenerationJob job = new ChunkGenerationJob();
        job.setDocument(document);
        job.setStatus(ChunkGenerationJobStatus.PENDING);
        job.setTotalBatches(batches.size());
        job.setCompletedBatches(0);
        job.setReviewFeedback(normalizedFeedback);

        ChunkGenerationJob savedJob = jobRepository.save(job);

        List<ChunkGenerationBatch> batchEntities = batches.stream()
                .map(batchRequest -> {
                    ChunkGenerationBatch batch = new ChunkGenerationBatch();
                    batch.setJob(savedJob);
                    batch.setBatchIndex(batchRequest.getBatchIndex());
                    batch.setPageFrom(batchRequest.getPageFrom());
                    batch.setPageTo(batchRequest.getPageTo());
                    batch.setStatus(ChunkGenerationBatchStatus.PENDING);
                    batch.setAttempts(0);
                    return batch;
                })
                .toList();

        batchRepository.saveAll(batchEntities);

        return toResponse(savedJob);
    }

    public ChunkGenerationJobResponse getJob(UUID jobId) {
        ChunkGenerationJob job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chunk generation job not found"));
        return toResponse(job);
    }

    @Transactional
    public ChunkGenerationJobResponse retryJob(UUID jobId) {
        ChunkGenerationJob job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Chunk generation job not found"));

        if (job.getStatus() != ChunkGenerationJobStatus.FAILED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only a failed chunk generation job can be retried");
        }

        if (batchRepository.findByJobIdOrderByBatchIndexAsc(jobId).isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This job has no persisted batches; start a new generation job");
        }

        job.setStatus(ChunkGenerationJobStatus.PENDING);
        job.setErrorMessage(null);
        job.setCompletedAt(null);
        return toResponse(jobRepository.save(job));
    }

    private ChunkGenerationJobResponse toResponse(ChunkGenerationJob job) {
        ChunkGenerationJobResponse response = new ChunkGenerationJobResponse();
        response.setJobId(job.getId());
        response.setDocumentId(job.getDocument().getId());
        response.setStatus(job.getStatus());
        response.setTotalBatches(job.getTotalBatches());
        response.setCompletedBatches(job.getCompletedBatches());
        response.setErrorMessage(job.getErrorMessage());
        response.setCreatedAt(job.getCreatedAt());
        response.setStartedAt(job.getStartedAt());
        response.setCompletedAt(job.getCompletedAt());
        response.setUpdatedAt(job.getUpdatedAt());
        return response;
    }
}
