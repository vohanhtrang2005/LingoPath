package com.gakudo.learning.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "learning_profiles")
public class LearningProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String targetLanguage;

    @Column(nullable = false)
    private String targetLevelSystem;

    @Column(nullable = false)
    private String targetLevelCode;

    @Column(nullable = false)
    private Integer durationMonths;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate examDate;

    @Column(columnDefinition = "text")
    private String currentLevelNote;

    @Column(columnDefinition = "text")
    private String weaknessNote;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (startDate == null) startDate = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getTargetLanguage() { return targetLanguage; }
    public void setTargetLanguage(String targetLanguage) { this.targetLanguage = targetLanguage; }
    public String getTargetLevelSystem() { return targetLevelSystem; }
    public void setTargetLevelSystem(String targetLevelSystem) { this.targetLevelSystem = targetLevelSystem; }
    public String getTargetLevelCode() { return targetLevelCode; }
    public void setTargetLevelCode(String targetLevelCode) { this.targetLevelCode = targetLevelCode; }
    public Integer getDurationMonths() { return durationMonths; }
    public void setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getExamDate() { return examDate; }
    public void setExamDate(LocalDate examDate) { this.examDate = examDate; }
    public String getCurrentLevelNote() { return currentLevelNote; }
    public void setCurrentLevelNote(String currentLevelNote) { this.currentLevelNote = currentLevelNote; }
    public String getWeaknessNote() { return weaknessNote; }
    public void setWeaknessNote(String weaknessNote) { this.weaknessNote = weaknessNote; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
