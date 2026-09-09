package com.gakudo.content.service;

import com.gakudo.content.dto.ai.AiChunkBatchRequest;
import com.gakudo.content.dto.ai.AiChunkBatchResponse;
import com.gakudo.content.dto.ai.AiChunkPageRequest;
import com.gakudo.content.dto.ai.AiChunkPlanItem;
import com.gakudo.content.dto.response.SourceChunkResponse;
import com.gakudo.content.model.BookDocument;
import com.gakudo.content.model.DocumentStatus;
import com.gakudo.content.model.ExtractedPageText;
import com.gakudo.content.model.SourceChunk;
import com.gakudo.content.repository.BookDocumentRepository;
import com.gakudo.content.repository.ExtractedPageTextRepository;
import com.gakudo.content.repository.SourceChunkRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;

@Service
public class SourceChunkService {
    private static final int DEFAULT_BATCH_SIZE = 10;
    private static final int DEFAULT_OVERLAP_PAGES = 1;

    private final BookDocumentRepository documentRepository;
    private final ExtractedPageTextRepository pageTextRepository;
    private final SourceChunkRepository sourceChunkRepository;
    private final AiChunkClient aiChunkClient;
    private final SourceChunkPersistenceService sourceChunkPersistenceService;

    public SourceChunkService(
            BookDocumentRepository documentRepository,
            ExtractedPageTextRepository pageTextRepository,
            SourceChunkRepository sourceChunkRepository,
            AiChunkClient aiChunkClient,
            SourceChunkPersistenceService sourceChunkPersistenceService) {
        this.documentRepository = documentRepository;
        this.pageTextRepository = pageTextRepository;
        this.sourceChunkRepository = sourceChunkRepository;
        this.aiChunkClient = aiChunkClient;
        this.sourceChunkPersistenceService = sourceChunkPersistenceService;
    }

    public List<ExtractedPageText> loadExtractedPages(UUID documentId) {
        BookDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));

        if (document.getStatus() != DocumentStatus.EXTRACTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Document must be extracted before chunking");
        }

        List<ExtractedPageText> pages = pageTextRepository.findByDocumentIdOrderByPageNumberAsc(documentId);
        if (pages.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Document has no extracted pages");
        }

        return pages;
    }

    public List<List<ExtractedPageText>> buildPageBatches(UUID documentId) {
        List<ExtractedPageText> pages = loadExtractedPages(documentId);
        return buildPageBatches(pages, DEFAULT_BATCH_SIZE, DEFAULT_OVERLAP_PAGES);
    }

    public List<AiChunkBatchRequest> buildAiChunkBatchRequests(UUID documentId) {
        return buildAiChunkBatchRequests(documentId, null);
    }

    public List<AiChunkBatchRequest> buildAiChunkBatchRequests(UUID documentId, String reviewFeedback) {
        List<List<ExtractedPageText>> batches = buildPageBatches(documentId);
        List<AiChunkBatchRequest> requests = new ArrayList<>();

        for (int index = 0; index < batches.size(); index++) {
            List<ExtractedPageText> batch = batches.get(index);
            AiChunkBatchRequest request = new AiChunkBatchRequest();
            request.setDocumentId(documentId);
            request.setBatchIndex(index + 1);
            request.setPageFrom(batch.get(0).getPageNumber());
            request.setPageTo(batch.get(batch.size() - 1).getPageNumber());
            request.setPages(toAiChunkPageRequests(batch));
            request.setReviewFeedback(reviewFeedback);
            requests.add(request);
        }

        return requests;
    }

    public List<AiChunkPlanItem> generateAiChunkPlans(UUID documentId) {
        return generateAiChunkPlans(documentId, completedBatch -> { });
    }

    public List<AiChunkPlanItem> generateAiChunkPlans(
            UUID documentId,
            Consumer<Integer> onBatchCompleted) {
        return generateAiChunkPlans(documentId, null, onBatchCompleted);
    }

    public List<AiChunkPlanItem> generateAiChunkPlans(
            UUID documentId,
            String reviewFeedback,
            Consumer<Integer> onBatchCompleted) {
        List<AiChunkBatchRequest> requests = buildAiChunkBatchRequests(documentId, reviewFeedback);
        List<AiChunkPlanItem> plans = new ArrayList<>();

        for (AiChunkBatchRequest request : requests) {
            AiChunkBatchResponse response = aiChunkClient.generateChunkPlan(request);

            if (response != null && response.getChunks() != null) {
                plans.addAll(response.getChunks());
            }

            onBatchCompleted.accept(request.getBatchIndex());
        }

        return plans;
    }

    public AiChunkBatchResponse generateAiChunkPlan(AiChunkBatchRequest request) {
        return aiChunkClient.generateChunkPlan(request);
    }

    public List<SourceChunkResponse> generateAndSaveChunks(UUID documentId) {
        List<AiChunkPlanItem> plans = generateAiChunkPlans(documentId);
        return sourceChunkPersistenceService.persistChunks(documentId, plans).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<SourceChunkResponse> getChunks(UUID documentId) {
        documentRepository.findById(documentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));

        List<SourceChunk> chunks = sourceChunkRepository.findByDocumentIdOrderByChunkIndexAsc(documentId);
        chunks = sourceChunkPersistenceService.populateMissingChunkText(chunks);

        return chunks.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public SourceChunkResponse approveChunk(UUID documentId, UUID chunkId) {
        return updateChunkStatus(documentId, chunkId, "APPROVED", null);
    }

    @Transactional
    public SourceChunkResponse rejectChunk(UUID documentId, UUID chunkId) {
        return updateChunkStatus(documentId, chunkId, "REJECTED", null);
    }

    @Transactional
    public List<SourceChunkResponse> approvePlan(UUID documentId) {
        List<SourceChunk> chunks = loadChunksForReview(documentId);
        chunks.forEach(chunk -> {
            chunk.setStatus("APPROVED");
            chunk.setReviewReason(null);
        });
        return sourceChunkRepository.saveAll(chunks).stream().map(this::toResponse).toList();
    }

    @Transactional
    public List<SourceChunkResponse> rejectPlan(UUID documentId, String reason) {
        String normalizedReason = reason == null ? "" : reason.trim();
        if (normalizedReason.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rejection reason is required");
        }

        List<SourceChunk> chunks = loadChunksForReview(documentId);
        chunks.forEach(chunk -> {
            chunk.setStatus("REJECTED");
            chunk.setReviewReason(normalizedReason);
        });
        return sourceChunkRepository.saveAll(chunks).stream().map(this::toResponse).toList();
    }

    private SourceChunkResponse updateChunkStatus(
            UUID documentId,
            UUID chunkId,
            String status,
            String reviewReason) {
        SourceChunk chunk = sourceChunkRepository.findByIdAndDocumentId(chunkId, documentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chunk not found"));

        chunk.setStatus(status);
        chunk.setReviewReason(reviewReason);
        return toResponse(sourceChunkRepository.save(chunk));
    }

    private List<SourceChunk> loadChunksForReview(UUID documentId) {
        documentRepository.findById(documentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));

        List<SourceChunk> chunks = sourceChunkRepository.findByDocumentIdOrderByChunkIndexAsc(documentId);
        if (chunks.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Document has no generated chunks");
        }
        return chunks;
    }

    private SourceChunkResponse toResponse(SourceChunk chunk) {
        SourceChunkResponse response = new SourceChunkResponse();
        response.setId(chunk.getId());
        response.setDocumentId(chunk.getDocument().getId());
        response.setChunkIndex(chunk.getChunkIndex());
        response.setSectionTitle(chunk.getSectionTitle());
        response.setSectionType(chunk.getSectionType());
        response.setPageFrom(chunk.getPageFrom());
        response.setPageTo(chunk.getPageTo());
        response.setStartMarker(chunk.getStartMarker());
        response.setEndMarker(chunk.getEndMarker());
        response.setChunkText(chunk.getChunkText());
        response.setStatus(chunk.getStatus());
        response.setReviewReason(chunk.getReviewReason());
        response.setCreatedAt(chunk.getCreatedAt());
        response.setUpdatedAt(chunk.getUpdatedAt());
        return response;
    }

    private List<List<ExtractedPageText>> buildPageBatches(
            List<ExtractedPageText> pages,
            int batchSize,
            int overlapPages) {
        List<List<ExtractedPageText>> batches = new ArrayList<>();
        int step = batchSize - overlapPages;

        for (int start = 0; start < pages.size(); start += step) {
            int end = Math.min(start + batchSize, pages.size());
            batches.add(pages.subList(start, end));

            // The final batch may be fully covered by the previous overlapping batch.
            // Stop once the last page is already included.
            if (end == pages.size()) {
                break;
            }
        }

        return batches;
    }

    private List<AiChunkPageRequest> toAiChunkPageRequests(List<ExtractedPageText> batch) {
        List<AiChunkPageRequest> pages = new ArrayList<>();

        for (ExtractedPageText page : batch) {
            AiChunkPageRequest pageRequest = new AiChunkPageRequest();
            pageRequest.setPageNumber(page.getPageNumber());
            pageRequest.setText(page.getText());
            pages.add(pageRequest);
        }

        return pages;
    }
}
