package com.gakudo.content.service;

import com.gakudo.content.controller.BookDocumentController;
import com.gakudo.content.model.*;
import com.gakudo.content.repository.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.core.task.TaskRejectedException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.awt.image.BufferedImage;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class BookDocumentExtractionTest {
    @TempDir Path uploads;
    BookDocumentRepository documents;
    ExtractedPageTextRepository pages;
    DocumentExtractionStateService state;
    OcrService ocr;
    BookDocumentService service;
    BookDocument document;

    @BeforeEach
    void setUp() throws Exception {
        documents = mock(BookDocumentRepository.class);
        pages = mock(ExtractedPageTextRepository.class);
        state = mock(DocumentExtractionStateService.class);
        ocr = mock(OcrService.class);
        service = new BookDocumentService(mock(BookRepository.class), documents, pages,
                new DocumentTypeDetector(), ocr, state, uploads.toString(), 72);
        Book book = new Book();
        book.setId(UUID.randomUUID());
        document = new BookDocument();
        document.setId(UUID.randomUUID());
        document.setBook(book);
        document.setStatus(DocumentStatus.UPLOADED);
        document.setDocumentType(DocumentType.TEXT);
        document.setStoragePath("sample.txt");
        Files.writeString(uploads.resolve("sample.txt"), "sample text");
        when(documents.findForExtraction(document.getId())).thenReturn(Optional.of(document));
        when(documents.findById(document.getId())).thenReturn(Optional.of(document));
        when(documents.saveAndFlush(document)).thenReturn(document);
    }

    @Test
    void acceptsRequestWithoutWaitingForOcr() {
        DocumentExtractionWorker worker = mock(DocumentExtractionWorker.class);
        var controller = new BookDocumentController(service, worker, state);
        var response = controller.extractDocument(document.getId());
        assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
        assertEquals(DocumentStatus.EXTRACTING, response.getBody().getStatus());
        assertEquals(0, response.getBody().getProcessedPages());
        verify(worker).extractAsync(document.getId());
        verifyNoInteractions(ocr, pages);
    }

    @Test
    void rejectsDuplicateRequestWithoutSchedulingAnotherWorker() {
        document.setStatus(DocumentStatus.EXTRACTING);
        DocumentExtractionWorker worker = mock(DocumentExtractionWorker.class);
        var controller = new BookDocumentController(service, worker, state);
        var error = assertThrows(ResponseStatusException.class,
                () -> controller.extractDocument(document.getId()));
        assertEquals(HttpStatus.CONFLICT, error.getStatusCode());
        verifyNoInteractions(worker, ocr, pages);
    }

    @Test
    void fullQueueMarksDocumentFailedForRetry() {
        DocumentExtractionWorker worker = mock(DocumentExtractionWorker.class);
        doThrow(new TaskRejectedException("full")).when(worker).extractAsync(document.getId());
        var controller = new BookDocumentController(service, worker, state);
        var error = assertThrows(ResponseStatusException.class,
                () -> controller.extractDocument(document.getId()));
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, error.getStatusCode());
        verify(state).fail(eq(document.getId()), contains("queue is full"));
    }

    @Test
    void scannedPdfReportsProgressAndCompletesWithOrderedPages() throws Exception {
        createScanPdf();
        when(ocr.extractImage(any(BufferedImage.class))).thenReturn("page one", "page two", "page three");
        service.processExtraction(document.getId());
        var order = inOrder(state);
        order.verify(state).updateProgress(document.getId(), 0, 3);
        order.verify(state).updateProgress(document.getId(), 1, 3);
        order.verify(state).updateProgress(document.getId(), 2, 3);
        order.verify(state).updateProgress(document.getId(), 3, 3);
        order.verify(state).complete(eq(document.getId()), argThat(result ->
                result.size() == 3 && result.get(0).getPageNumber() == 1
                        && result.get(2).getPageNumber() == 3
                        && result.get(1).getText().equals("page two")
                        && result.stream().allMatch(page -> page.getExtractionMethod() == ExtractionMethod.PDF_OCR)));
    }

    @Test
    void failedOcrDoesNotPublishPartialTextOrDeletePreviousPages() throws Exception {
        createScanPdf();
        when(ocr.extractImage(any(BufferedImage.class))).thenReturn("page one")
                .thenThrow(new IllegalStateException("page two failed"));
        service.processExtraction(document.getId());
        verify(state).updateProgress(document.getId(), 1, 3);
        verify(state).fail(document.getId(), "page two failed");
        verify(state, never()).complete(any(), anyList());
        verifyNoInteractions(pages);
    }

    @Test
    void plainTextStillExtractsDirectly() {
        service.processExtraction(document.getId());
        verify(state).complete(eq(document.getId()), argThat(result -> result.size() == 1
                && result.getFirst().getText().equals("sample text")
                && result.getFirst().getExtractionMethod() == ExtractionMethod.TEXT_DIRECT));
        verifyNoInteractions(ocr);
    }

    private void createScanPdf() throws Exception {
        document.setDocumentType(DocumentType.PDF);
        document.setStoragePath("scan.pdf");
        try (PDDocument pdf = new PDDocument()) {
            for (int index = 0; index < 3; index++) pdf.addPage(new PDPage());
            pdf.save(uploads.resolve("scan.pdf").toFile());
        }
    }
}
