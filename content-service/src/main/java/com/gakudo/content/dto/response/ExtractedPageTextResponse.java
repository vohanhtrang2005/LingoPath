package com.gakudo.content.dto.response;

import com.gakudo.content.model.ExtractionMethod;

import java.time.LocalDateTime;
import java.util.UUID;

public class ExtractedPageTextResponse {
    private UUID id;
    private UUID documentId;
    private int pageNumber;
    private String text;
    private ExtractionMethod extractionMethod;
    private Double confidence;
    private LocalDateTime createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getDocumentId() { return documentId; }
    public void setDocumentId(UUID documentId) { this.documentId = documentId; }
    public int getPageNumber() { return pageNumber; }
    public void setPageNumber(int pageNumber) { this.pageNumber = pageNumber; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public ExtractionMethod getExtractionMethod() { return extractionMethod; }
    public void setExtractionMethod(ExtractionMethod extractionMethod) { this.extractionMethod = extractionMethod; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
