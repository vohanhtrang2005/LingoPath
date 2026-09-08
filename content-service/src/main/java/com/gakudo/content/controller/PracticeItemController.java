package com.gakudo.content.controller;

import com.gakudo.content.dto.request.PracticeItemRequest;
import com.gakudo.content.dto.response.PracticeItemResponse;
import com.gakudo.content.service.PracticeItemService;
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
@RequestMapping("/api/content/practice-items")
public class PracticeItemController {
    private final PracticeItemService practiceItemService;

    public PracticeItemController(PracticeItemService practiceItemService) {
        this.practiceItemService = practiceItemService;
    }

    // Muc dich: Tao bai practice dua len web, co the lay tu SourceExercise hoac AI/admin tao.
    @PostMapping
    public ResponseEntity<PracticeItemResponse> createPracticeItem(@RequestBody PracticeItemRequest request) {
        return ResponseEntity.ok(practiceItemService.createPracticeItem(request));
    }

    // Muc dich: Lay PracticeItem theo sourceExerciseId hoac theo ngon ngu/level/skill/status.
    @GetMapping
    public ResponseEntity<List<PracticeItemResponse>> getPracticeItems(
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String levelSystem,
            @RequestParam(required = false) String levelCode,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) UUID sourceExerciseId) {
        return ResponseEntity.ok(practiceItemService.getPracticeItems(
                language,
                levelSystem,
                levelCode,
                skill,
                status,
                sourceExerciseId));
    }

    // Muc dich: Xem chi tiet mot PracticeItem de FE hien thi cau hoi va BE cham diem sau nay.
    @GetMapping("/{id}")
    public ResponseEntity<PracticeItemResponse> getPracticeItem(@PathVariable UUID id) {
        return ResponseEntity.ok(practiceItemService.getPracticeItem(id));
    }
}
