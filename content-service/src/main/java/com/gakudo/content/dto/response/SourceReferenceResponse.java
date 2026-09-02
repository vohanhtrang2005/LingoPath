package com.gakudo.content.dto.response;

import java.util.UUID;

public class SourceReferenceResponse {
    private UUID id;
    private UUID knowledgeItemId;
    private UUID bookId;
    private String bookName;
    private String sectionTitle;
    private Integer sectionOrder;
    private Integer pageStart;
    private Integer pageEnd;
    private String locationText;
    private UUID chunkId;
    private String evidenceText;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getKnowledgeItemId() { return knowledgeItemId; }
    public void setKnowledgeItemId(UUID knowledgeItemId) { this.knowledgeItemId = knowledgeItemId; }
    public UUID getBookId() { return bookId; }
    public void setBookId(UUID bookId) { this.bookId = bookId; }
    public String getBookName() { return bookName; }
    public void setBookName(String bookName) { this.bookName = bookName; }
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
    public UUID getChunkId() { return chunkId; }
    public void setChunkId(UUID chunkId) { this.chunkId = chunkId; }
    public String getEvidenceText() { return evidenceText; }
    public void setEvidenceText(String evidenceText) { this.evidenceText = evidenceText; }
}
