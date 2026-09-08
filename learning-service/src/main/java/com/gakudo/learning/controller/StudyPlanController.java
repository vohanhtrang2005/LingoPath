package com.gakudo.learning.controller;

import com.gakudo.learning.dto.request.CreateStudyPlanRequest;
import com.gakudo.learning.dto.response.DailyLessonResponse;
import com.gakudo.learning.dto.response.StudyPlanResponse;
import com.gakudo.learning.service.StudyPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/learning")
public class StudyPlanController {
    private final StudyPlanService studyPlanService;

    public StudyPlanController(StudyPlanService studyPlanService) {
        this.studyPlanService = studyPlanService;
    }

    // Muc dich: Tao lo trinh hoc tu muc tieu user va noi dung PUBLISHED hien co.
    @PostMapping("/plans")
    public ResponseEntity<StudyPlanResponse> createPlan(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestBody CreateStudyPlanRequest request) {
        return ResponseEntity.ok(studyPlanService.createPlan(userId, request));
    }

    // Muc dich: Lay study plan ACTIVE hien tai cua user dang dang nhap.
    @GetMapping("/plans/current")
    public ResponseEntity<StudyPlanResponse> getCurrentPlan(@RequestHeader("X-User-Id") UUID userId) {
        return ResponseEntity.ok(studyPlanService.getCurrentPlan(userId));
    }

    // Muc dich: Lay chi tiet mot DailyLesson va kiem tra lesson thuoc dung user.
    @GetMapping("/lessons/{lessonId}")
    public ResponseEntity<DailyLessonResponse> getLesson(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID lessonId) {
        return ResponseEntity.ok(studyPlanService.getLesson(userId, lessonId));
    }

    // Muc dich: Lay DailyLesson kem noi dung that cua KnowledgeItem/PracticeItem de FE hien thi man hoc.
    @GetMapping("/lessons/{lessonId}/content")
    public ResponseEntity<DailyLessonResponse> getLessonContent(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID lessonId) {
        return ResponseEntity.ok(studyPlanService.getLessonContent(userId, lessonId));
    }

    // Muc dich: Lay danh sach DailyLesson trong mot StudyPlan cua user.
    @GetMapping("/plans/{planId}/lessons")
    public ResponseEntity<List<DailyLessonResponse>> getLessons(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID planId) {
        return ResponseEntity.ok(studyPlanService.getLessons(userId, planId));
    }
}

