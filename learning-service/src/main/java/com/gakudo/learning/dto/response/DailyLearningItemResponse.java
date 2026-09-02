package com.gakudo.learning.dto.response;

import java.util.UUID;

public class DailyLearningItemResponse {
    private UUID id;
    private String itemType;
    private UUID itemId;
    private String assignmentType;
    private Integer orderIndex;
    private String status;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }
    public UUID getItemId() { return itemId; }
    public void setItemId(UUID itemId) { this.itemId = itemId; }
    public String getAssignmentType() { return assignmentType; }
    public void setAssignmentType(String assignmentType) { this.assignmentType = assignmentType; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
