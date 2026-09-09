package com.gakudo.content.service;

import com.gakudo.content.dto.response.BookDocumentResponse;
import com.gakudo.content.dto.response.ExtractedPageTextResponse;
import com.gakudo.content.model.Book;
import com.gakudo.content.model.BookDocument;
import com.gakudo.content.model.DocumentStatus;
import com.gakudo.content.model.DocumentType;
import com.gakudo.content.model.ExtractedPageText;
import com.gakudo.content.model.ExtractionMethod;
import com.gakudo.content.repository.BookDocumentRepository;
import com.gakudo.content.repository.BookRepository;
import com.gakudo.content.repository.ExtractedPageTextRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.awt.image.BufferedImage;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class BookDocumentService {
    private static final Logger log = LoggerFactory.getLogger(BookDocumentService.class);
    private static final int PDF_TEXT_MIN_AVERAGE_CHARS_PER_PAGE = 50;

    private final BookRepository bookRepository;
    private final BookDocumentRepository documentRepository;
    private final ExtractedPageTextRepository pageTextRepository;
    private final DocumentTypeDetector documentTypeDetector;
    private final OcrService ocrService;
    private final DocumentExtractionStateService extractionState;
    private final Path uploadRoot;
    private final float ocrPdfDpi;

    public BookDocumentService(
            BookRepository bookRepository,
            BookDocumentRepository documentRepository,
            ExtractedPageTextRepository pageTextRepository,
            DocumentTypeDetector documentTypeDetector,
            OcrService ocrService,
            DocumentExtractionStateService extractionState,
            @Value("${gakudo.content.upload-dir:uploads}") String uploadDir,
            @Value("${gakudo.content.ocr.pdf-dpi:250}") float ocrPdfDpi) {
        this.bookRepository = bookRepository;
        this.documentRepository = documentRepository;
        this.pageTextRepository = pageTextRepository;
        this.documentTypeDetector = documentTypeDetector;
        this.ocrService = ocrService;
        this.extractionState = extractionState;
        this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
        this.ocrPdfDpi = ocrPdfDpi;
    }

    @Transactional
    public BookDocumentResponse uploadDocument(UUID bookId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

        String originalFileName = cleanFileName(file.getOriginalFilename());
        String storedFileName = UUID.randomUUID() + extensionOf(originalFileName);
        Path bookUploadDir = uploadRoot.resolve("books").resolve(bookId.toString()).normalize();
        Path targetPath = bookUploadDir.resolve(storedFileName).normalize();

        if (!targetPath.startsWith(uploadRoot)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid storage path");
        }

        try {
            Files.createDirectories(bookUploadDir);
            file.transferTo(targetPath);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not store uploaded file", e);
        }

        String contentType = file.getContentType();
        DocumentType documentType = documentTypeDetector.detect(contentType, originalFileName);

        BookDocument document = new BookDocument();
        document.setBook(book);
        document.setOriginalFileName(originalFileName);
        document.setStoredFileName(storedFileName);
        document.setContentType(contentType);
        document.setFileSize(file.getSize());
        document.setStoragePath(uploadRoot.relativize(targetPath).toString().replace('\\', '/'));
        document.setDocumentType(documentType);
        document.setStatus(DocumentStatus.UPLOADED);

        return mapDocumentToResponse(documentRepository.save(document));
    }

    public List<BookDocumentResponse> getDocuments(UUID bookId) {
        if (!bookRepository.existsById(bookId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found");
        }
        return documentRepository.findByBookIdOrderByCreatedAtDesc(bookId)
                .stream()
                .map(this::mapDocumentToResponse)
                .toList();
    }

    @Transactional
    public BookDocumentResponse extractDocument(UUID documentId) {
        BookDocument document = documentRepository.findForExtraction(documentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));

        if (document.getStatus() == DocumentStatus.EXTRACTING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Document extraction is already in progress");
        }
        resolveStoredPath(document);

        document.setStatus(DocumentStatus.EXTRACTING);
        document.setErrorMessage(null);
        document.setProcessedPages(0);
        document.setTotalPages(null);
        return mapDocumentToResponse(documentRepository.saveAndFlush(document));
    }

    public void processExtraction(UUID documentId) {
        try {
            BookDocument document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new IllegalStateException("Document not found"));
            log.info("Extracting document id={}, file={}", documentId, document.getOriginalFileName());
            List<ExtractedPageText> pages = switch (document.getDocumentType()) {
                case PDF -> extractPdfText(document);
                case TEXT -> extractPlainText(document);
                case IMAGE -> extractImageText(document);
                case DOCX -> throw new UnsupportedOperationException("DOCX extraction is not implemented yet");
                case HTML -> throw new UnsupportedOperationException("HTML extraction is not implemented yet");
                case AUDIO -> throw new UnsupportedOperationException("Audio upload is stored, speech-to-text is not implemented yet");
                case UNKNOWN -> throw new UnsupportedOperationException("Unsupported document type");
            };

            extractionState.complete(documentId, pages);
            log.info("Extraction complete: documentId={}, pages={}", documentId, pages.size());
        } catch (Exception e) {
            log.error("Extraction failed: documentId={}", documentId, e);
            extractionState.fail(documentId, e.getMessage());
        }
    }

    public List<ExtractedPageTextResponse> getExtractedPages(UUID documentId) {
        if (!documentRepository.existsById(documentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found");
        }
        return pageTextRepository.findByDocumentIdOrderByPageNumberAsc(documentId)
                .stream()
                .map(this::mapPageToResponse)
                .toList();
    }

    private List<ExtractedPageText> extractPdfText(BookDocument document) throws IOException {
        Path filePath = resolveStoredPath(document);
        List<String> pageTexts = new ArrayList<>();

        try (PDDocument pdf = Loader.loadPDF(filePath.toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            int numberOfPages = pdf.getNumberOfPages();
            extractionState.updateProgress(document.getId(), 0, numberOfPages);

            for (int pageNumber = 1; pageNumber <= numberOfPages; pageNumber++) {
                stripper.setStartPage(pageNumber);
                stripper.setEndPage(pageNumber);
                pageTexts.add(stripper.getText(pdf).trim());
            }
        }

        double averageChars = pageTexts.stream()
                .mapToInt(String::length)
                .average()
                .orElse(0);

        if (averageChars < PDF_TEXT_MIN_AVERAGE_CHARS_PER_PAGE) {
            return extractPdfOcr(document);
        }

        List<ExtractedPageText> pages = new ArrayList<>();
        for (int index = 0; index < pageTexts.size(); index++) {
            pages.add(buildPage(document, index + 1, pageTexts.get(index), ExtractionMethod.PDF_TEXT, 1.0));
        }
        return pages;
    }

    private List<ExtractedPageText> extractPlainText(BookDocument document) throws IOException {
        String text = Files.readString(resolveStoredPath(document), StandardCharsets.UTF_8).trim();
        return List.of(buildPage(document, 1, text, ExtractionMethod.TEXT_DIRECT, 1.0));
    }

    private List<ExtractedPageText> extractImageText(BookDocument document) {
        String text = ocrService.extractImage(resolveStoredPath(document));
        if (text.isBlank()) {
            throw new IllegalStateException("OCR did not detect text");
        }
        return List.of(buildPage(document, 1, text, ExtractionMethod.IMAGE_OCR, null));
    }

    private List<ExtractedPageText> extractPdfOcr(BookDocument document) throws IOException {
        Path filePath = resolveStoredPath(document);
        List<ExtractedPageText> pages = new ArrayList<>();

        try (PDDocument pdf = Loader.loadPDF(filePath.toFile())) {
            PDFRenderer renderer = new PDFRenderer(pdf);
            int numberOfPages = pdf.getNumberOfPages();

            for (int pageIndex = 0; pageIndex < numberOfPages; pageIndex++) {
                BufferedImage image = renderer.renderImageWithDPI(pageIndex, ocrPdfDpi, ImageType.RGB);
                try {
                    String text = ocrService.extractImage(image);
                    pages.add(buildPage(document, pageIndex + 1, text, ExtractionMethod.PDF_OCR, null));
                } finally {
                    image.flush();
                }
                extractionState.updateProgress(document.getId(), pageIndex + 1, numberOfPages);
                log.info("OCR progress: documentId={}, page={}/{}", document.getId(), pageIndex + 1, numberOfPages);
            }
        }

        boolean hasText = pages.stream().anyMatch(page -> page.getText() != null && !page.getText().isBlank());
        if (!hasText) {
            throw new IllegalStateException("OCR did not detect text");
        }

        return pages;
    }

    private ExtractedPageText buildPage(
            BookDocument document,
            int pageNumber,
            String text,
            ExtractionMethod extractionMethod,
            Double confidence) {
        ExtractedPageText page = new ExtractedPageText();
        page.setDocument(document);
        page.setPageNumber(pageNumber);
        page.setText(text == null ? "" : text);
        page.setExtractionMethod(extractionMethod);
        page.setConfidence(confidence);
        return page;
    }

    private Path resolveStoredPath(BookDocument document) {
        Path resolved = uploadRoot.resolve(document.getStoragePath()).normalize();
        if (!resolved.startsWith(uploadRoot)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid storage path");
        }
        if (!Files.exists(resolved)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Stored file not found");
        }
        return resolved;
    }

    private BookDocumentResponse mapDocumentToResponse(BookDocument document) {
        BookDocumentResponse response = new BookDocumentResponse();
        response.setId(document.getId());
        response.setBookId(document.getBook().getId());
        response.setBookName(document.getBook().getName());
        response.setOriginalFileName(document.getOriginalFileName());
        response.setStoredFileName(document.getStoredFileName());
        response.setContentType(document.getContentType());
        response.setFileSize(document.getFileSize());
        response.setStoragePath(document.getStoragePath());
        response.setDocumentType(document.getDocumentType());
        response.setStatus(document.getStatus());
        response.setErrorMessage(document.getErrorMessage());
        response.setTotalPages(document.getTotalPages());
        response.setProcessedPages(document.getProcessedPages());
        response.setCreatedAt(document.getCreatedAt());
        response.setUpdatedAt(document.getUpdatedAt());
        return response;
    }

    private ExtractedPageTextResponse mapPageToResponse(ExtractedPageText page) {
        ExtractedPageTextResponse response = new ExtractedPageTextResponse();
        response.setId(page.getId());
        response.setDocumentId(page.getDocument().getId());
        response.setPageNumber(page.getPageNumber());
        response.setText(page.getText());
        response.setExtractionMethod(page.getExtractionMethod());
        response.setConfidence(page.getConfidence());
        response.setCreatedAt(page.getCreatedAt());
        return response;
    }

    private String cleanFileName(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return "document";
        }
        return Path.of(fileName).getFileName().toString();
    }

    private String extensionOf(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(dotIndex).toLowerCase(Locale.ROOT);
    }
}
