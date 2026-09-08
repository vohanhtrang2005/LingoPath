package com.gakudo.content.controller;

import com.gakudo.content.dto.request.BookRequest;
import com.gakudo.content.dto.response.BookResponse;
import com.gakudo.content.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/content/books")
public class BookController {
    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // Muc dich: Tao book/nguon hoc de gan tai lieu upload vao dung ngon ngu va level.
    @PostMapping
    public ResponseEntity<BookResponse> createBook(@RequestBody BookRequest request) {
        return ResponseEntity.ok(bookService.createBook(request));
    }

    // Muc dich: Tim book theo language, levelSystem, levelCode hoac lay tat ca neu khong filter.
    @GetMapping
    public ResponseEntity<List<BookResponse>> getBooks(
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String levelSystem,
            @RequestParam(required = false) String levelCode) {
        return ResponseEntity.ok(bookService.getBooks(language, levelSystem, levelCode));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBook(@PathVariable UUID id) {
        return ResponseEntity.ok(bookService.getBook(id));
    }
}
