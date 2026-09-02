package com.gakudo.content.controller;

import com.gakudo.content.dto.request.KnowledgeItemRequest;
import com.gakudo.content.dto.response.KnowledgeItemResponse;
import com.gakudo.content.dto.response.SourceReferenceResponse;
import com.gakudo.content.service.KnowledgeItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/content/knowledge")
public class KnowledgeItemController {

    private final KnowledgeItemService knowledgeItemService;

    public KnowledgeItemController(KnowledgeItemService knowledgeItemService) {
        this.knowledgeItemService = knowledgeItemService;
    }

    @PostMapping
    public ResponseEntity<KnowledgeItemResponse> createKnowledge(@RequestBody KnowledgeItemRequest request) {
        KnowledgeItemResponse response = knowledgeItemService.createKnowledgeItem(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<KnowledgeItemResponse>> getKnowledge(
            @RequestParam String language,
            @RequestParam String levelSystem,
            @RequestParam String levelCode,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(knowledgeItemService.getKnowledgeItems(language, levelSystem, levelCode, type));
    }

    @GetMapping("/{id}/source")
    public ResponseEntity<List<SourceReferenceResponse>> getKnowledgeSources(@PathVariable UUID id) {
        return ResponseEntity.ok(knowledgeItemService.getSourceReferences(id));
    }
}

