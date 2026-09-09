package com.gakudo.content.controller;

import com.gakudo.content.dto.response.SourceChunkResponse;
import com.gakudo.content.dto.request.ChunkPlanReviewRequest;
import com.gakudo.content.service.SourceChunkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/content")
public class SourceChunkController {
    private final SourceChunkService sourceChunkService;

    public SourceChunkController(SourceChunkService sourceChunkService) {
        this.sourceChunkService = sourceChunkService;
    }

    @PostMapping("/documents/{documentId}/chunks/plan")
    public ResponseEntity<List<SourceChunkResponse>> generateChunkPlan(@PathVariable UUID documentId) {
        return ResponseEntity.ok(sourceChunkService.generateAndSaveChunks(documentId));
    }

    @GetMapping("/documents/{documentId}/chunks")
    public ResponseEntity<List<SourceChunkResponse>> getChunks(@PathVariable UUID documentId) {
        return ResponseEntity.ok(sourceChunkService.getChunks(documentId));
    }

    @PatchMapping("/documents/{documentId}/chunks/{chunkId}/approve")
    public ResponseEntity<SourceChunkResponse> approveChunk(
            @PathVariable UUID documentId,
            @PathVariable UUID chunkId) {
        return ResponseEntity.ok(sourceChunkService.approveChunk(documentId, chunkId));
    }

    @PatchMapping("/documents/{documentId}/chunks/{chunkId}/reject")
    public ResponseEntity<SourceChunkResponse> rejectChunk(
            @PathVariable UUID documentId,
            @PathVariable UUID chunkId) {
        return ResponseEntity.ok(sourceChunkService.rejectChunk(documentId, chunkId));
    }

    @PatchMapping("/documents/{documentId}/chunks/approve")
    public ResponseEntity<List<SourceChunkResponse>> approvePlan(@PathVariable UUID documentId) {
        return ResponseEntity.ok(sourceChunkService.approvePlan(documentId));
    }

    @PatchMapping("/documents/{documentId}/chunks/reject")
    public ResponseEntity<List<SourceChunkResponse>> rejectPlan(
            @PathVariable UUID documentId,
            @Valid @org.springframework.web.bind.annotation.RequestBody ChunkPlanReviewRequest request) {
        return ResponseEntity.ok(sourceChunkService.rejectPlan(documentId, request.getReason()));
    }
}
