package com.gakudo.content.controller;

import com.gakudo.content.dto.request.SourceExerciseRequest;
import com.gakudo.content.dto.response.SourceExerciseResponse;
import com.gakudo.content.service.SourceExerciseService;
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
@RequestMapping("/api/content/source-exercises")
public class SourceExerciseController {
    private final SourceExerciseService sourceExerciseService;

    public SourceExerciseController(SourceExerciseService sourceExerciseService) {
        this.sourceExerciseService = sourceExerciseService;
    }

    // Muc dich: Luu bai tap goc trong sach/tai lieu truoc khi cat thanh PracticeItem.
    @PostMapping
    public ResponseEntity<SourceExerciseResponse> createSourceExercise(@RequestBody SourceExerciseRequest request) {
        return ResponseEntity.ok(sourceExerciseService.createSourceExercise(request));
    }

    // Muc dich: Lay SourceExercise theo bookId hoac theo ngon ngu/level de admin kiem tra.
    @GetMapping
    public ResponseEntity<List<SourceExerciseResponse>> getSourceExercises(
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String levelSystem,
            @RequestParam(required = false) String levelCode,
            @RequestParam(required = false) UUID bookId) {
        return ResponseEntity.ok(sourceExerciseService.getSourceExercises(language, levelSystem, levelCode, bookId));
    }

    // Muc dich: Xem chi tiet mot bai tap goc, gom instruction, raw questions va answer key.
    @GetMapping("/{id}")
    public ResponseEntity<SourceExerciseResponse> getSourceExercise(@PathVariable UUID id) {
        return ResponseEntity.ok(sourceExerciseService.getSourceExercise(id));
    }
}
