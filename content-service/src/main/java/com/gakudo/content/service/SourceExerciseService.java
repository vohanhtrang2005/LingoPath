package com.gakudo.content.service;

import com.gakudo.content.dto.request.SourceExerciseRequest;
import com.gakudo.content.dto.response.SourceExerciseResponse;
import com.gakudo.content.model.Book;
import com.gakudo.content.model.SourceExercise;
import com.gakudo.content.repository.BookRepository;
import com.gakudo.content.repository.SourceExerciseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SourceExerciseService {
    private static final String DEFAULT_STATUS = "EXTRACTED";
    private static final String DEFAULT_ORIGIN = "MANUAL";

    private final SourceExerciseRepository sourceExerciseRepository;
    private final BookRepository bookRepository;

    public SourceExerciseService(
            SourceExerciseRepository sourceExerciseRepository,
            BookRepository bookRepository) {
        this.sourceExerciseRepository = sourceExerciseRepository;
        this.bookRepository = bookRepository;
    }

    public SourceExerciseResponse createSourceExercise(SourceExerciseRequest request) {
        validateRequest(request);
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

        SourceExercise exercise = new SourceExercise();
        exercise.setBook(book);
        exercise.setLanguage(request.getLanguage());
        exercise.setLevelSystem(request.getLevelSystem());
        exercise.setLevelCode(request.getLevelCode());
        exercise.setSectionTitle(request.getSectionTitle());
        exercise.setSectionOrder(request.getSectionOrder());
        exercise.setPageStart(request.getPageStart());
        exercise.setPageEnd(request.getPageEnd());
        exercise.setLocationText(request.getLocationText());
        exercise.setInstruction(request.getInstruction());
        exercise.setRawContentJson(request.getRawContentJson());
        exercise.setAnswerKeyJson(request.getAnswerKeyJson());
        exercise.setSourceReferenceJson(request.getSourceReferenceJson());
        exercise.setStatus(defaultIfBlank(request.getStatus(), DEFAULT_STATUS));
        exercise.setOrigin(defaultIfBlank(request.getOrigin(), DEFAULT_ORIGIN));
        exercise.setConfidence(request.getConfidence());
        exercise.setCreatedAt(LocalDateTime.now());
        exercise.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(sourceExerciseRepository.save(exercise));
    }

    public List<SourceExerciseResponse> getSourceExercises(
            String language,
            String levelSystem,
            String levelCode,
            UUID bookId) {
        List<SourceExercise> exercises;
        if (bookId != null) {
            exercises = sourceExerciseRepository.findByBookIdOrderBySectionOrderAscPageStartAsc(bookId);
        } else {
            requireParam(language, "language");
            requireParam(levelSystem, "levelSystem");
            requireParam(levelCode, "levelCode");
            exercises = sourceExerciseRepository.findByLanguageAndLevelSystemAndLevelCodeOrderBySectionOrderAscPageStartAsc(
                    language,
                    levelSystem,
                    levelCode);
        }

        return exercises.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public SourceExerciseResponse getSourceExercise(UUID id) {
        return sourceExerciseRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Source exercise not found"));
    }

    private void validateRequest(SourceExerciseRequest request) {
        if (request.getBookId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "bookId is required");
        }
        requireParam(request.getLanguage(), "language");
        requireParam(request.getLevelSystem(), "levelSystem");
        requireParam(request.getLevelCode(), "levelCode");
        if (request.getRawContentJson() == null || request.getRawContentJson().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "rawContentJson is required");
        }
    }

    private void requireParam(String value, String name) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, name + " is required");
        }
    }

    private String defaultIfBlank(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value;
    }

    private SourceExerciseResponse mapToResponse(SourceExercise exercise) {
        SourceExerciseResponse response = new SourceExerciseResponse();
        response.setId(exercise.getId());
        response.setBookId(exercise.getBook().getId());
        response.setBookName(exercise.getBook().getName());
        response.setLanguage(exercise.getLanguage());
        response.setLevelSystem(exercise.getLevelSystem());
        response.setLevelCode(exercise.getLevelCode());
        response.setSectionTitle(exercise.getSectionTitle());
        response.setSectionOrder(exercise.getSectionOrder());
        response.setPageStart(exercise.getPageStart());
        response.setPageEnd(exercise.getPageEnd());
        response.setLocationText(exercise.getLocationText());
        response.setInstruction(exercise.getInstruction());
        response.setRawContentJson(exercise.getRawContentJson());
        response.setAnswerKeyJson(exercise.getAnswerKeyJson());
        response.setSourceReferenceJson(exercise.getSourceReferenceJson());
        response.setStatus(exercise.getStatus());
        response.setOrigin(exercise.getOrigin());
        response.setConfidence(exercise.getConfidence());
        response.setCreatedAt(exercise.getCreatedAt());
        response.setUpdatedAt(exercise.getUpdatedAt());
        return response;
    }
}
