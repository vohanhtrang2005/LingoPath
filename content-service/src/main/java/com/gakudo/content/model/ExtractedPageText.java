package com.gakudo.content.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "extracted_page_texts")
public class ExtractedPageText {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "document_id", nullable = false)
    private BookDocument document;

    @Column(nullable = false)
    private int pageNumber;

    @Column(columnDefinition = "text", nullable = false)
    private String text;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExtractionMethod extractionMethod;

    private Double confidence;

    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public BookDocument getDocument() { return document; }
    public void setDocument(BookDocument document) { this.document = document; }
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
