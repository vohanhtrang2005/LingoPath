package com.gakudo.learning.dto.response;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class DailySectionResponse {
    private UUID id;
    private String type;
    private Integer orderIndex;
    private String title;
    private String status;
    private List<DailyLearningItemResponse> items = new ArrayList<>();

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<DailyLearningItemResponse> getItems() { return items; }
    public void setItems(List<DailyLearningItemResponse> items) { this.items = items; }
}
