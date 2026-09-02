package com.gakudo.learning.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public class ReviewScheduleResponse {
    private UUID id;
    private UUID userId;
    private UUID knowledgeItemId;
    private int reviewStep;
    private LocalDateTime nextReviewDate;
    private String status;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getKnowledgeItemId() {
        return knowledgeItemId;
    }

    public void setKnowledgeItemId(UUID knowledgeItemId) {
        this.knowledgeItemId = knowledgeItemId;
    }

    public int getReviewStep() {
        return reviewStep;
    }

    public void setReviewStep(int reviewStep) {
        this.reviewStep = reviewStep;
    }

    public LocalDateTime getNextReviewDate() {
        return nextReviewDate;
    }

    public void setNextReviewDate(LocalDateTime nextReviewDate) {
        this.nextReviewDate = nextReviewDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
