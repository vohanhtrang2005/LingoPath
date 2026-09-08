package com.gakudo.content.dto.request;

import java.util.Map;
import java.util.UUID;

public class SourceExerciseRequest {
    private UUID bookId;
    private String language;
    private String levelSystem;
    private String levelCode;
    private String sectionTitle;
    private Integer sectionOrder;
    private Integer pageStart;
    private Integer pageEnd;
    private String locationText;
    private String instruction;
    private Map<String, Object> rawContentJson;
    private Map<String, Object> answerKeyJson;
    private Map<String, Object> sourceReferenceJson;
    private String status;
    private String origin;
    private Double confidence;

    public UUID getBookId() { return bookId; }
    public void setBookId(UUID bookId) { this.bookId = bookId; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getLevelSystem() { return levelSystem; }
    public void setLevelSystem(String levelSystem) { this.levelSystem = levelSystem; }
    public String getLevelCode() { return levelCode; }
    public void setLevelCode(String levelCode) { this.levelCode = levelCode; }
    public String getSectionTitle() { return sectionTitle; }
    public void setSectionTitle(String sectionTitle) { this.sectionTitle = sectionTitle; }
    public Integer getSectionOrder() { return sectionOrder; }
    public void setSectionOrder(Integer sectionOrder) { this.sectionOrder = sectionOrder; }
    public Integer getPageStart() { return pageStart; }
    public void setPageStart(Integer pageStart) { this.pageStart = pageStart; }
    public Integer getPageEnd() { return pageEnd; }
    public void setPageEnd(Integer pageEnd) { this.pageEnd = pageEnd; }
    public String getLocationText() { return locationText; }
    public void setLocationText(String locationText) { this.locationText = locationText; }
    public String getInstruction() { return instruction; }
    public void setInstruction(String instruction) { this.instruction = instruction; }
    public Map<String, Object> getRawContentJson() { return rawContentJson; }
    public void setRawContentJson(Map<String, Object> rawContentJson) { this.rawContentJson = rawContentJson; }
    public Map<String, Object> getAnswerKeyJson() { return answerKeyJson; }
    public void setAnswerKeyJson(Map<String, Object> answerKeyJson) { this.answerKeyJson = answerKeyJson; }
    public Map<String, Object> getSourceReferenceJson() { return sourceReferenceJson; }
    public void setSourceReferenceJson(Map<String, Object> sourceReferenceJson) { this.sourceReferenceJson = sourceReferenceJson; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
}
