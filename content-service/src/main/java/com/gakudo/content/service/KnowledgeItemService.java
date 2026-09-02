package com.gakudo.content.service;

import com.gakudo.content.dto.request.KnowledgeItemRequest;
import com.gakudo.content.dto.request.SourceReferenceRequest;
import com.gakudo.content.dto.response.KnowledgeItemResponse;
import com.gakudo.content.dto.response.SourceReferenceResponse;
import com.gakudo.content.model.Book;
import com.gakudo.content.model.KnowledgeItem;
import com.gakudo.content.model.SourceReference;
import com.gakudo.content.repository.BookRepository;
import com.gakudo.content.repository.KnowledgeItemRepository;
import com.gakudo.content.repository.SourceReferenceRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class KnowledgeItemService {

    private final KnowledgeItemRepository knowledgeRepository;
    private final SourceReferenceRepository sourceReferenceRepository;
    private final BookRepository bookRepository;

    public KnowledgeItemService(
            KnowledgeItemRepository knowledgeRepository,
            SourceReferenceRepository sourceReferenceRepository,
            BookRepository bookRepository) {
        this.knowledgeRepository = knowledgeRepository;
        this.sourceReferenceRepository = sourceReferenceRepository;
        this.bookRepository = bookRepository;
    }

    public KnowledgeItemResponse createKnowledgeItem(KnowledgeItemRequest request) {
        KnowledgeItem item = new KnowledgeItem();
        item.setLanguage(request.getLanguage());
        item.setLevelSystem(request.getLevelSystem());
        item.setLevelCode(request.getLevelCode());
        item.setType(request.getType());
        item.setStatus(request.getStatus() == null || request.getStatus().isBlank() ? "PUBLISHED" : request.getStatus());
        item.setOrigin(request.getOrigin());
        item.setConfidence(request.getConfidence());
        item.setContentJson(request.getContentJson());
        item.setOrderIndex(request.getOrderIndex());
        item.setDifficulty(request.getDifficulty());
        if (request.getSourceReferences() != null) {
            item.setSourceReferences(buildSourceReferences(item, request.getSourceReferences()));
        }

        KnowledgeItem savedItem = knowledgeRepository.save(item);
        return mapToResponse(savedItem);
    }

    public List<KnowledgeItemResponse> getKnowledgeItems(String language, String levelSystem, String levelCode, String type) {
        List<KnowledgeItem> items;
        if (type == null || type.isBlank()) {
            items = knowledgeRepository.findByLanguageAndLevelSystemAndLevelCodeAndStatusOrderByOrderIndexAsc(
                    language,
                    levelSystem,
                    levelCode,
                    "PUBLISHED"
            );
        } else {
            items = knowledgeRepository.findByLanguageAndLevelSystemAndLevelCodeAndStatusAndTypeOrderByOrderIndexAsc(
                    language,
                    levelSystem,
                    levelCode,
                    "PUBLISHED",
                    type
            );
        }

        return items.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<SourceReferenceResponse> getSourceReferences(UUID knowledgeItemId) {
        if (!knowledgeRepository.existsById(knowledgeItemId)) {
            throw new RuntimeException("Knowledge item not found");
        }
        return sourceReferenceRepository.findByKnowledgeItemId(knowledgeItemId)
                .stream()
                .map(this::mapSourceReferenceToResponse)
                .toList();
    }

    private List<SourceReference> buildSourceReferences(KnowledgeItem item, List<SourceReferenceRequest> requests) {
        List<SourceReference> sourceReferences = new ArrayList<>();
        for (SourceReferenceRequest request : requests) {
            SourceReference sourceReference = new SourceReference();
            sourceReference.setKnowledgeItem(item);
            sourceReference.setBook(resolveBook(request));
            sourceReference.setSectionTitle(request.getSectionTitle());
            sourceReference.setSectionOrder(request.getSectionOrder());
            sourceReference.setPageStart(request.getPageStart());
            sourceReference.setPageEnd(request.getPageEnd());
            sourceReference.setLocationText(request.getLocationText());
            sourceReference.setChunkId(request.getChunkId());
            sourceReference.setEvidenceText(request.getEvidenceText());
            sourceReferences.add(sourceReference);
        }
        return sourceReferences;
    }

    private Book resolveBook(SourceReferenceRequest request) {
        if (request.getBookId() != null) {
            return bookRepository.findById(request.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));
        }
        throw new RuntimeException("Source reference requires bookId");
    }

    private KnowledgeItemResponse mapToResponse(KnowledgeItem item) {
        KnowledgeItemResponse response = new KnowledgeItemResponse();
        response.setId(item.getId());
        response.setLanguage(item.getLanguage());
        response.setLevelSystem(item.getLevelSystem());
        response.setLevelCode(item.getLevelCode());
        response.setType(item.getType());
        response.setStatus(item.getStatus());
        response.setOrigin(item.getOrigin());
        response.setConfidence(item.getConfidence());
        response.setContentJson(item.getContentJson());
        response.setOrderIndex(item.getOrderIndex());
        response.setDifficulty(item.getDifficulty());
        return response;
    }

    private SourceReferenceResponse mapSourceReferenceToResponse(SourceReference sourceReference) {
        SourceReferenceResponse response = new SourceReferenceResponse();
        response.setId(sourceReference.getId());
        response.setKnowledgeItemId(sourceReference.getKnowledgeItem().getId());
        response.setBookId(sourceReference.getBook().getId());
        response.setBookName(sourceReference.getBook().getName());
        response.setSectionTitle(sourceReference.getSectionTitle());
        response.setSectionOrder(sourceReference.getSectionOrder());
        response.setPageStart(sourceReference.getPageStart());
        response.setPageEnd(sourceReference.getPageEnd());
        response.setLocationText(sourceReference.getLocationText());
        response.setChunkId(sourceReference.getChunkId());
        response.setEvidenceText(sourceReference.getEvidenceText());
        return response;
    }
}



