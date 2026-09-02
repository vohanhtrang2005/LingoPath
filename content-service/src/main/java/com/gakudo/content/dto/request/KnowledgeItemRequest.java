package com.gakudo.content.dto.request;

import java.util.Map;
import java.util.List;
import java.util.UUID;

public class KnowledgeItemRequest {
    private String language;
    private String levelSystem;
    private String levelCode;
    private String type;
    private String status;
    private String origin;
    private Double confidence;
    private Map<String, Object> contentJson;
    private Integer orderIndex;
    private String difficulty;
    private List<SourceReferenceRequest> sourceReferences;

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getLevelSystem() { return levelSystem; }
    public void setLevelSystem(String levelSystem) { this.levelSystem = levelSystem; }
    public String getLevelCode() { return levelCode; }
    public void setLevelCode(String levelCode) { this.levelCode = levelCode; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    public Map<String, Object> getContentJson() { return contentJson; }
    public void setContentJson(Map<String, Object> contentJson) { this.contentJson = contentJson; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public List<SourceReferenceRequest> getSourceReferences() { return sourceReferences; }
    public void setSourceReferences(List<SourceReferenceRequest> sourceReferences) { this.sourceReferences = sourceReferences; }
}


