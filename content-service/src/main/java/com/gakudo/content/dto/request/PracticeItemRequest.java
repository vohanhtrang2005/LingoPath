package com.gakudo.content.dto.request;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public class PracticeItemRequest {
    private UUID sourceExerciseId;
    private String language;
    private String levelSystem;
    private String levelCode;
    private String skill;
    private String practiceType;
    private String status;
    private String origin;
    private Double confidence;
    private String difficulty;
    private Integer orderIndex;
    private Map<String, Object> promptJson;
    private Map<String, Object> answerJson;
    private Map<String, Object> explanationJson;
    private List<UUID> relatedKnowledgeItemIds;
    private Map<String, Object> sourceReferenceJson;

    public UUID getSourceExerciseId() { return sourceExerciseId; }
    public void setSourceExerciseId(UUID sourceExerciseId) { this.sourceExerciseId = sourceExerciseId; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getLevelSystem() { return levelSystem; }
    public void setLevelSystem(String levelSystem) { this.levelSystem = levelSystem; }
    public String getLevelCode() { return levelCode; }
    public void setLevelCode(String levelCode) { this.levelCode = levelCode; }
    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }
    public String getPracticeType() { return practiceType; }
    public void setPracticeType(String practiceType) { this.practiceType = practiceType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public Map<String, Object> getPromptJson() { return promptJson; }
    public void setPromptJson(Map<String, Object> promptJson) { this.promptJson = promptJson; }
    public Map<String, Object> getAnswerJson() { return answerJson; }
    public void setAnswerJson(Map<String, Object> answerJson) { this.answerJson = answerJson; }
    public Map<String, Object> getExplanationJson() { return explanationJson; }
    public void setExplanationJson(Map<String, Object> explanationJson) { this.explanationJson = explanationJson; }
    public List<UUID> getRelatedKnowledgeItemIds() { return relatedKnowledgeItemIds; }
    public void setRelatedKnowledgeItemIds(List<UUID> relatedKnowledgeItemIds) { this.relatedKnowledgeItemIds = relatedKnowledgeItemIds; }
    public Map<String, Object> getSourceReferenceJson() { return sourceReferenceJson; }
    public void setSourceReferenceJson(Map<String, Object> sourceReferenceJson) { this.sourceReferenceJson = sourceReferenceJson; }
}
