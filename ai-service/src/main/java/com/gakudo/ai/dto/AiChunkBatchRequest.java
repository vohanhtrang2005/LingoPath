package com.gakudo.ai.dto;

import java.util.List;
import java.util.UUID;

public class AiChunkBatchRequest {
    private UUID documentId;
    private int batchIndex;
    private int pageFrom;
    private int pageTo;
    private List<AiChunkPageRequest> pages;
    private String reviewFeedback;

    public UUID getDocumentId() { return documentId; }
    public void setDocumentId(UUID documentId) { this.documentId = documentId; }
    public int getBatchIndex() { return batchIndex; }
    public void setBatchIndex(int batchIndex) { this.batchIndex = batchIndex; }
    public int getPageFrom() { return pageFrom; }
    public void setPageFrom(int pageFrom) { this.pageFrom = pageFrom; }
    public int getPageTo() { return pageTo; }
    public void setPageTo(int pageTo) { this.pageTo = pageTo; }
    public List<AiChunkPageRequest> getPages() { return pages; }
    public void setPages(List<AiChunkPageRequest> pages) { this.pages = pages; }
    public String getReviewFeedback() { return reviewFeedback; }
    public void setReviewFeedback(String reviewFeedback) { this.reviewFeedback = reviewFeedback; }
}
