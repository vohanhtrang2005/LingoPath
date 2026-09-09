package com.gakudo.content.dto.response;

import com.gakudo.content.model.ChunkGenerationJobStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public class ChunkGenerationJobResponse {
    private UUID jobId;
    private UUID documentId;
    private ChunkGenerationJobStatus status;
    private Integer totalBatches;
    private Integer completedBatches;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime updatedAt;

    public UUID getJobId() { return jobId; }
    public void setJobId(UUID jobId) { this.jobId = jobId; }
    public UUID getDocumentId() { return documentId; }
    public void setDocumentId(UUID documentId) { this.documentId = documentId; }
    public ChunkGenerationJobStatus getStatus() { return status; }
    public void setStatus(ChunkGenerationJobStatus status) { this.status = status; }
    public Integer getTotalBatches() { return totalBatches; }
    public void setTotalBatches(Integer totalBatches) { this.totalBatches = totalBatches; }
    public Integer getCompletedBatches() { return completedBatches; }
    public void setCompletedBatches(Integer completedBatches) { this.completedBatches = completedBatches; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
