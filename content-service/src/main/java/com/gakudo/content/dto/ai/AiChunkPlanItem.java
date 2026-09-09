package com.gakudo.content.dto.ai;

public class AiChunkPlanItem {
    private String sectionTitle;
    private String sectionType;
    private int pageFrom;
    private int pageTo;
    private String startMarker;
    private String endMarker;

    public String getSectionTitle() { return sectionTitle; }
    public void setSectionTitle(String sectionTitle) { this.sectionTitle = sectionTitle; }
    public String getSectionType() { return sectionType; }
    public void setSectionType(String sectionType) { this.sectionType = sectionType; }
    public int getPageFrom() { return pageFrom; }
    public void setPageFrom(int pageFrom) { this.pageFrom = pageFrom; }
    public int getPageTo() { return pageTo; }
    public void setPageTo(int pageTo) { this.pageTo = pageTo; }
    public String getStartMarker() { return startMarker; }
    public void setStartMarker(String startMarker) { this.startMarker = startMarker; }
    public String getEndMarker() { return endMarker; }
    public void setEndMarker(String endMarker) { this.endMarker = endMarker; }
}
