package com.gakudo.learning.dto.response;

import java.util.UUID;

public class ContentKnowledgeItemResponse {
    private UUID id;
    private String type;
    private Integer orderIndex;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
