package com.gakudo.content.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "practice_items")
public class PracticeItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_exercise_id")
    private SourceExercise sourceExercise;

    @Column(nullable = false)
    private String language;

    @Column(nullable = false)
    private String levelSystem;

    @Column(nullable = false)
    private String levelCode;

    @Column(nullable = false)
    private String skill;

    @Column(nullable = false)
    private String practiceType;

    @Column(nullable = false)
    private String status;

    private String origin;

    private Double confidence;

    private String difficulty;

    private Integer orderIndex;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "prompt_json", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> promptJson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "answer_json", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> answerJson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "explanation_json", columnDefinition = "jsonb")
    private Map<String, Object> explanationJson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "related_knowledge_item_ids", columnDefinition = "jsonb")
    private List<UUID> relatedKnowledgeItemIds;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "source_reference_json", columnDefinition = "jsonb")
    private Map<String, Object> sourceReferenceJson;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public SourceExercise getSourceExercise() { return sourceExercise; }
    public void setSourceExercise(SourceExercise sourceExercise) { this.sourceExercise = sourceExercise; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
