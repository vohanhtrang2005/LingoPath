package com.gakudo.content.service;

import com.gakudo.content.dto.request.BookRequest;
import com.gakudo.content.dto.response.BookResponse;
import com.gakudo.content.model.Book;
import com.gakudo.content.repository.BookRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookService {
    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public BookResponse createBook(BookRequest request) {
        requireText(request.getName(), "Book name is required");
        requireText(request.getLanguage(), "Language is required");
        requireText(request.getLevelSystem(), "Level system is required");
        requireText(request.getLevelCode(), "Level code is required");

        Book book = new Book();
        book.setName(request.getName().trim());
        book.setAuthor(blankToNull(request.getAuthor()));
        book.setLanguage(request.getLanguage().trim());
        book.setLevelSystem(request.getLevelSystem().trim());
        book.setLevelCode(request.getLevelCode().trim());
        book.setStatus(blankToDefault(request.getStatus(), "ACTIVE"));
        book.setCreatedAt(LocalDateTime.now());

        return mapToResponse(bookRepository.save(book));
    }

    public List<BookResponse> getBooks(String language, String levelSystem, String levelCode) {
        return bookRepository.searchBooks(blankToNull(language), blankToNull(levelSystem), blankToNull(levelCode))
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public BookResponse getBook(UUID id) {
        return bookRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));
    }

    private BookResponse mapToResponse(Book book) {
        BookResponse response = new BookResponse();
        response.setId(book.getId());
        response.setName(book.getName());
        response.setAuthor(book.getAuthor());
        response.setLanguage(book.getLanguage());
        response.setLevelSystem(book.getLevelSystem());
        response.setLevelCode(book.getLevelCode());
        response.setStatus(book.getStatus());
        response.setCreatedAt(book.getCreatedAt());
        return response;
    }

    private void requireText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String blankToDefault(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value.trim();
    }
}
