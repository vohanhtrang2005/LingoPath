package com.gakudo.content.service;

import com.gakudo.content.dto.ai.AiChunkPlanItem;
import com.gakudo.content.model.BookDocument;
import com.gakudo.content.model.ExtractedPageText;
import com.gakudo.content.model.SourceChunk;
import com.gakudo.content.repository.BookDocumentRepository;
import com.gakudo.content.repository.ExtractedPageTextRepository;
import com.gakudo.content.repository.SourceChunkRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SourceChunkPersistenceService {
    private final BookDocumentRepository documentRepository;
    private final ExtractedPageTextRepository pageTextRepository;
    private final SourceChunkRepository sourceChunkRepository;

    public SourceChunkPersistenceService(
            BookDocumentRepository documentRepository,
            ExtractedPageTextRepository pageTextRepository,
            SourceChunkRepository sourceChunkRepository) {
        this.documentRepository = documentRepository;
        this.pageTextRepository = pageTextRepository;
        this.sourceChunkRepository = sourceChunkRepository;
    }

    @Transactional
    public List<SourceChunk> persistChunks(
            UUID documentId,
            List<AiChunkPlanItem> plans) {
        BookDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));

        List<ExtractedPageText> extractedPages = pageTextRepository
                .findByDocumentIdOrderByPageNumberAsc(documentId);
        List<SourceChunk> chunks = new ArrayList<>();
        Set<String> seenPlans = new HashSet<>();

        for (AiChunkPlanItem plan : plans) {
            if (plan == null || !seenPlans.add(planKey(plan))) {
                continue;
            }

            chunks.add(toSourceChunk(document, plan, chunks.size() + 1, extractedPages));
        }

        sourceChunkRepository.deleteByDocumentId(documentId);
        return sourceChunkRepository.saveAll(chunks);
    }

    public List<SourceChunk> populateMissingChunkText(List<SourceChunk> chunks) {
        if (chunks.isEmpty()) {
            return chunks;
        }

        UUID documentId = chunks.get(0).getDocument().getId();
        List<ExtractedPageText> extractedPages = pageTextRepository
                .findByDocumentIdOrderByPageNumberAsc(documentId);
        boolean changed = false;

        for (SourceChunk chunk : chunks) {
            if (chunk.getChunkText() == null || chunk.getChunkText().isBlank()) {
                chunk.setChunkText(extractChunkText(
                        chunk.getPageFrom(),
                        chunk.getPageTo(),
                        chunk.getStartMarker(),
                        chunk.getEndMarker(),
                        extractedPages));
                changed = true;
            }
        }

        return changed ? sourceChunkRepository.saveAll(chunks) : chunks;
    }

    private SourceChunk toSourceChunk(
            BookDocument document,
            AiChunkPlanItem plan,
            int chunkIndex,
            List<ExtractedPageText> extractedPages) {
        SourceChunk chunk = new SourceChunk();
        chunk.setDocument(document);
        chunk.setChunkIndex(chunkIndex);
        chunk.setSectionTitle(plan.getSectionTitle());
        chunk.setSectionType(plan.getSectionType());
        chunk.setPageFrom(plan.getPageFrom());
        chunk.setPageTo(plan.getPageTo());
        chunk.setStartMarker(plan.getStartMarker());
        chunk.setEndMarker(plan.getEndMarker());
        chunk.setChunkText(extractChunkText(
                plan.getPageFrom(),
                plan.getPageTo(),
                plan.getStartMarker(),
                plan.getEndMarker(),
                extractedPages));
        chunk.setStatus("AI_SUGGESTED");
        return chunk;
    }

    private String extractChunkText(
            int pageFrom,
            int pageTo,
            String startMarker,
            String endMarker,
            List<ExtractedPageText> extractedPages) {
        String sourceText = extractedPages.stream()
                .filter(page -> page.getPageNumber() >= pageFrom
                        && page.getPageNumber() <= pageTo)
                .map(ExtractedPageText::getText)
                .filter(Objects::nonNull)
                .collect(Collectors.joining("\n\n"));

        if (sourceText.isBlank()) {
            return "";
        }

        int contentStart = markerIndex(sourceText, startMarker, 0);
        if (contentStart < 0) {
            contentStart = 0;
        }

        int contentEnd = sourceText.length();
        if (endMarker != null && !endMarker.isBlank()) {
            int endMarkerStart = markerIndex(sourceText, endMarker, contentStart);
            if (endMarkerStart >= contentStart) {
                contentEnd = endMarkerStart + endMarker.length();
            }
        }

        return sourceText.substring(contentStart, contentEnd).trim();
    }

    private int markerIndex(String sourceText, String marker, int fromIndex) {
        if (marker == null || marker.isBlank()) {
            return -1;
        }
        return sourceText.indexOf(marker, fromIndex);
    }

    private String planKey(AiChunkPlanItem plan) {
        return String.join("|",
                Objects.toString(plan.getSectionTitle(), ""),
                Objects.toString(plan.getSectionType(), ""),
                String.valueOf(plan.getPageFrom()),
                String.valueOf(plan.getPageTo()),
                Objects.toString(plan.getStartMarker(), ""),
                Objects.toString(plan.getEndMarker(), ""));
    }
}
