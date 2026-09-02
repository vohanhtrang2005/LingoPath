package com.gakudo.learning.dto.request;

import java.time.LocalDate;

public class CreateStudyPlanRequest {
    private String targetLanguage;
    private String targetLevelSystem;
    private String targetLevelCode;
    private Integer durationMonths;
    private LocalDate startDate;
    private LocalDate examDate;
    private String currentLevelNote;
    private String weaknessNote;

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
}
