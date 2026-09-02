package com.gakudo.learning.controller;

import com.gakudo.learning.dto.request.ReviewSubmitRequest;
import com.gakudo.learning.dto.response.ReviewScheduleResponse;
import com.gakudo.learning.service.ReviewScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewScheduleService reviewScheduleService;

    public ReviewController(ReviewScheduleService reviewScheduleService) {
        this.reviewScheduleService = reviewScheduleService;
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ReviewScheduleResponse> submitReview(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") UUID userId,
            @RequestBody ReviewSubmitRequest request) {
        return ResponseEntity.ok(reviewScheduleService.submitReview(id, userId, request));
    }
}
