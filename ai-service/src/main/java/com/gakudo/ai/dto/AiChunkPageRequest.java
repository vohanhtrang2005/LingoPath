package com.gakudo.ai.dto;

public class AiChunkPageRequest {
    private int pageNumber;
    private String text;

    public int getPageNumber() { return pageNumber; }
    public void setPageNumber(int pageNumber) { this.pageNumber = pageNumber; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}
