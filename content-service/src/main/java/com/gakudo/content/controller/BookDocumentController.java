package com.gakudo.content.controller;

import com.gakudo.content.dto.response.BookDocumentResponse;
import com.gakudo.content.dto.response.ExtractedPageTextResponse;
import com.gakudo.content.service.BookDocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/content")
public class BookDocumentController {
    private final BookDocumentService bookDocumentService;

    public BookDocumentController(BookDocumentService bookDocumentService) {
        this.bookDocumentService = bookDocumentService;
    }

    // Muc dich: Upload file vao mot Book, luu file goc va metadata rieng cho tung file.
    @PostMapping("/books/{bookId}/documents")
    public ResponseEntity<BookDocumentResponse> uploadDocument(
            @PathVariable UUID bookId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(bookDocumentService.uploadDocument(bookId, file));
    }

    // Muc dich: Xem danh sach file da upload cua mot Book.
    @GetMapping("/books/{bookId}/documents")
    public ResponseEntity<List<BookDocumentResponse>> getDocuments(@PathVariable UUID bookId) {
        return ResponseEntity.ok(bookDocumentService.getDocuments(bookId));
    }

    // Muc dich: Bat dau extract text sync cho phase dau; sau nay co the tach queue async.
    @PostMapping("/documents/{documentId}/extract")
    public ResponseEntity<BookDocumentResponse> extractDocument(@PathVariable UUID documentId) {
        return ResponseEntity.ok(bookDocumentService.extractDocument(documentId));
    }

    // Muc dich: Lay text da extract theo page/de don vi tai lieu.
    @GetMapping("/documents/{documentId}/pages")
    public ResponseEntity<List<ExtractedPageTextResponse>> getExtractedPages(@PathVariable UUID documentId) {
        return ResponseEntity.ok(bookDocumentService.getExtractedPages(documentId));
    }
}
