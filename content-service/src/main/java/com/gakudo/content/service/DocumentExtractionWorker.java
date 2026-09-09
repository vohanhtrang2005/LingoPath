package com.gakudo.content.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DocumentExtractionWorker {
    private final BookDocumentService documentService;

    public DocumentExtractionWorker(BookDocumentService documentService) {
        this.documentService = documentService;
    }

    @Async("documentExtractionExecutor")
    public void extractAsync(UUID documentId) {
        documentService.processExtraction(documentId);
    }
}
