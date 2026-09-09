package com.gakudo.content.service;

import com.gakudo.content.model.BookDocument;
import com.gakudo.content.model.DocumentStatus;
import com.gakudo.content.model.ExtractedPageText;
import com.gakudo.content.repository.BookDocumentRepository;
import com.gakudo.content.repository.ExtractedPageTextRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DocumentExtractionStateService {
    private final BookDocumentRepository documentRepository;
    private final ExtractedPageTextRepository pageRepository;

    public DocumentExtractionStateService(
            BookDocumentRepository documentRepository, ExtractedPageTextRepository pageRepository) {
        this.documentRepository = documentRepository;
        this.pageRepository = pageRepository;
    }

    @Transactional
    public void updateProgress(UUID documentId, int processedPages, int totalPages) {
        BookDocument document = documentRepository.findById(documentId).orElseThrow();
        document.setProcessedPages(processedPages);
        document.setTotalPages(totalPages);
    }

    // Replace page text and publish EXTRACTED together, after all OCR has succeeded.
    @Transactional
    public void complete(UUID documentId, List<ExtractedPageText> pages) {
        BookDocument document = documentRepository.findById(documentId).orElseThrow();
        pageRepository.deleteByDocumentId(documentId);
        pages.forEach(page -> page.setDocument(document));
        pageRepository.saveAll(pages);
        document.setTotalPages(pages.size());
        document.setProcessedPages(pages.size());
        document.setStatus(DocumentStatus.EXTRACTED);
        document.setErrorMessage(null);
    }

    @Transactional
    public void fail(UUID documentId, String message) {
        BookDocument document = documentRepository.findById(documentId).orElseThrow();
        document.setStatus(DocumentStatus.FAILED);
        document.setErrorMessage(message == null ? "Document extraction failed" : message);
    }

    // The local worker queue does not survive a service restart. Allow an explicit retry.
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void recoverInterruptedExtractions() {
        for (BookDocument document : documentRepository.findByStatus(DocumentStatus.EXTRACTING)) {
            document.setStatus(DocumentStatus.FAILED);
            document.setErrorMessage("Extraction interrupted by service restart. Please extract again.");
        }
    }
}
