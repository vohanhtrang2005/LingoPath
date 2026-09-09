package com.gakudo.content.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ChunkPlanReviewRequest {
    @NotBlank
    private String reason;

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
