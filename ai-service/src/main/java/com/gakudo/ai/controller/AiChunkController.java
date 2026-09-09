package com.gakudo.ai.controller;

import com.gakudo.ai.dto.AiChunkBatchRequest;
import com.gakudo.ai.dto.AiChunkBatchResponse;
import com.gakudo.ai.service.AiChunkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/chunks")
public class AiChunkController {

    private final AiChunkService aiChunkService;

    public AiChunkController(AiChunkService aiChunkService) {
        this.aiChunkService = aiChunkService;
    }

    @PostMapping("/plan")
    public ResponseEntity<AiChunkBatchResponse> generateChunkPlan(
            @RequestBody AiChunkBatchRequest request) {

        AiChunkBatchResponse response =
                aiChunkService.generateChunkPlan(request);

        return ResponseEntity.ok(response);
    }
}
