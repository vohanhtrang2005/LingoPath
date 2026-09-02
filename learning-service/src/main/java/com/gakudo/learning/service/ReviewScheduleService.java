package com.gakudo.learning.service;

import com.gakudo.learning.dto.request.ReviewSubmitRequest;
import com.gakudo.learning.dto.response.ReviewScheduleResponse;
import com.gakudo.learning.model.ReviewSchedule;
import com.gakudo.learning.repository.ReviewScheduleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;

@Service
public class ReviewScheduleService {
    private final ReviewScheduleRepository repository;

    public ReviewScheduleService(ReviewScheduleRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ReviewScheduleResponse submitReview(UUID reviewId, UUID userId, ReviewSubmitRequest request) {
        ReviewSchedule review = repository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review schedule not found"));

        if (!review.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Khong co quyen truy cap");
        }

        Rating rating = Rating.from(request.getRating());
        int nextStep = nextReviewStep(review.getReviewStep(), rating);
        review.setReviewStep(nextStep);
        review.setStatus(nextStep >= 5 ? "MASTERED" : "LEARNING");
        review.setNextReviewDate(LocalDateTime.now().plusDays(intervalDays(nextStep, rating)));

        return mapToResponse(repository.save(review));
    }

    private int nextReviewStep(int currentStep, Rating rating) {
        return switch (rating) {
            case AGAIN -> 0;
            case HARD -> Math.max(currentStep, 1);
            case GOOD -> currentStep + 1;
            case EASY -> currentStep + 2;
        };
    }

    private long intervalDays(int reviewStep, Rating rating) {
        if (rating == Rating.AGAIN) {
            return 1;
        }
        return switch (reviewStep) {
            case 0, 1 -> 1;
            case 2 -> 4;
            case 3 -> 10;
            case 4 -> 21;
            default -> 60;
        };
    }

    private ReviewScheduleResponse mapToResponse(ReviewSchedule review) {
        ReviewScheduleResponse response = new ReviewScheduleResponse();
        response.setId(review.getId());
        response.setUserId(review.getUserId());
        response.setKnowledgeItemId(review.getKnowledgeItemId());
        response.setReviewStep(review.getReviewStep());
        response.setNextReviewDate(review.getNextReviewDate());
        response.setStatus(review.getStatus());
        return response;
    }

    private enum Rating {
        AGAIN,
        HARD,
        GOOD,
        EASY;

        static Rating from(String value) {
            if (value == null || value.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "rating is required");
            }
            try {
                return Rating.valueOf(value.trim().toUpperCase(Locale.ROOT));
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "rating must be AGAIN, HARD, GOOD, or EASY");
            }
        }
    }
}
