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

    // Muc dich: Tao KnowledgeItem thu cong hoac candidate da duoc chuan hoa tu tai lieu.
    @PostMapping
    public ResponseEntity<KnowledgeItemResponse> createKnowledge(@RequestBody KnowledgeItemRequest request) {
        KnowledgeItemResponse response = knowledgeItemService.createKnowledgeItem(request);
        return ResponseEntity.ok(response);
    }

    // Muc dich: Lay danh sach KnowledgeItem PUBLISHED theo ngon ngu, level va type tuy chon.
    @GetMapping
    public ResponseEntity<List<KnowledgeItemResponse>> getKnowledge(
            @RequestParam String language,
            @RequestParam String levelSystem,
            @RequestParam String levelCode,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(knowledgeItemService.getKnowledgeItems(language, levelSystem, levelCode, type));
    }

    // Muc dich: Lay chi tiet mot KnowledgeItem de FE hien thi noi dung hoc that.
    @GetMapping("/{id}")
    public ResponseEntity<KnowledgeItemResponse> getKnowledgeItem(@PathVariable UUID id) {
        return ResponseEntity.ok(knowledgeItemService.getKnowledgeItem(id));
    }

    // Muc dich: Lay source evidence cua mot KnowledgeItem de truy vet ve sach/trang/section.
    @GetMapping("/{id}/source")
    public ResponseEntity<List<SourceReferenceResponse>> getKnowledgeSources(@PathVariable UUID id) {
        return ResponseEntity.ok(knowledgeItemService.getSourceReferences(id));
    }
}

