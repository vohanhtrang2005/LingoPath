package com.gakudo.content.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "source_exercises")
public class SourceExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(nullable = false)
    private String language;

    @Column(nullable = false)
    private String levelSystem;

    @Column(nullable = false)
    private String levelCode;

    private String sectionTitle;

    private Integer sectionOrder;

    private Integer pageStart;

    private Integer pageEnd;

    private String locationText;

    @Column(columnDefinition = "text")
    private String instruction;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "raw_content_json", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> rawContentJson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "answer_key_json", columnDefinition = "jsonb")
    private Map<String, Object> answerKeyJson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "source_reference_json", columnDefinition = "jsonb")
    private Map<String, Object> sourceReferenceJson;

    @Column(nullable = false)
    private String status;

    private String origin;

    private Double confidence;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
