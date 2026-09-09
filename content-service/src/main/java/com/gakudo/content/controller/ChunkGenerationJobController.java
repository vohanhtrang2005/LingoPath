package com.gakudo.content.controller;

import com.gakudo.content.dto.response.ChunkGenerationJobResponse;
import com.gakudo.content.dto.request.ChunkGenerationRequest;
import com.gakudo.content.service.ChunkGenerationJobService;
import com.gakudo.content.service.ChunkGenerationWorker;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/content")
public class ChunkGenerationJobController {
    private final ChunkGenerationJobService jobService;
    private final ChunkGenerationWorker worker;

    public ChunkGenerationJobController(
            ChunkGenerationJobService jobService,
            ChunkGenerationWorker worker) {
        this.jobService = jobService;
        this.worker = worker;
    }

    @PostMapping("/documents/{documentId}/chunks/generate")
    public ResponseEntity<ChunkGenerationJobResponse> createJob(
            @PathVariable UUID documentId,
            @org.springframework.web.bind.annotation.RequestBody(required = false) ChunkGenerationRequest request) {
        String feedback = request == null ? null : request.getFeedback();
        ChunkGenerationJobResponse job = jobService.createJob(documentId, feedback);
        worker.processJobAsync(job.getJobId());
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(job);
    }

    @GetMapping("/chunk-generation-jobs/{jobId}")
    public ResponseEntity<ChunkGenerationJobResponse> getJob(
            @PathVariable UUID jobId) {
        return ResponseEntity.ok(jobService.getJob(jobId));
    }

    @PostMapping("/chunk-generation-jobs/{jobId}/retry")
    public ResponseEntity<ChunkGenerationJobResponse> retryJob(
            @PathVariable UUID jobId) {
        ChunkGenerationJobResponse job = jobService.retryJob(jobId);
        worker.processJobAsync(job.getJobId());
        return ResponseEntity.accepted().body(job);
    }
}
