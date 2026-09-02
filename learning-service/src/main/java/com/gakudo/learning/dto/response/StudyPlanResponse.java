package com.gakudo.learning.dto.response;

import java.time.LocalDate;
import java.util.UUID;

public class StudyPlanResponse {
    private UUID id;
    private UUID userId;
    private UUID learningProfileId;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer durationMonths;
    private String targetLanguage;
    private String targetLevelSystem;
    private String targetLevelCode;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getLearningProfileId() { return learningProfileId; }
    public void setLearningProfileId(UUID learningProfileId) { this.learningProfileId = learningProfileId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Integer getDurationMonths() { return durationMonths; }
    public void setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; }
    public String getTargetLanguage() { return targetLanguage; }
    public void setTargetLanguage(String targetLanguage) { this.targetLanguage = targetLanguage; }
    public String getTargetLevelSystem() { return targetLevelSystem; }
    public void setTargetLevelSystem(String targetLevelSystem) { this.targetLevelSystem = targetLevelSystem; }
    public String getTargetLevelCode() { return targetLevelCode; }
    public void setTargetLevelCode(String targetLevelCode) { this.targetLevelCode = targetLevelCode; }
}
