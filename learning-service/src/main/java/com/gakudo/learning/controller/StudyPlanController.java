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

    @PostMapping("/plans")
    public ResponseEntity<StudyPlanResponse> createPlan(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestBody CreateStudyPlanRequest request) {
        return ResponseEntity.ok(studyPlanService.createPlan(userId, request));
    }

    @GetMapping("/plans/current")
    public ResponseEntity<StudyPlanResponse> getCurrentPlan(@RequestHeader("X-User-Id") UUID userId) {
        return ResponseEntity.ok(studyPlanService.getCurrentPlan(userId));
    }

    @GetMapping("/lessons/{lessonId}")
    public ResponseEntity<DailyLessonResponse> getLesson(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID lessonId) {
        return ResponseEntity.ok(studyPlanService.getLesson(userId, lessonId));
    }
    @GetMapping("/plans/{planId}/lessons")
    public ResponseEntity<List<DailyLessonResponse>> getLessons(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID planId) {
        return ResponseEntity.ok(studyPlanService.getLessons(userId, planId));
    }
}

