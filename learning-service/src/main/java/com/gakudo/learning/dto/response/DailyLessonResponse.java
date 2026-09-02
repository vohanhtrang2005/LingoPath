package com.gakudo.learning.dto.response;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class DailyLessonResponse {
    private UUID id;
    private UUID studyPlanId;
    private LocalDate lessonDate;
    private Integer dayIndex;
    private String lessonType;
    private String status;
    private List<DailySectionResponse> sections = new ArrayList<>();

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getStudyPlanId() { return studyPlanId; }
    public void setStudyPlanId(UUID studyPlanId) { this.studyPlanId = studyPlanId; }
    public LocalDate getLessonDate() { return lessonDate; }
    public void setLessonDate(LocalDate lessonDate) { this.lessonDate = lessonDate; }
    public Integer getDayIndex() { return dayIndex; }
    public void setDayIndex(Integer dayIndex) { this.dayIndex = dayIndex; }
    public String getLessonType() { return lessonType; }
    public void setLessonType(String lessonType) { this.lessonType = lessonType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<DailySectionResponse> getSections() { return sections; }
    public void setSections(List<DailySectionResponse> sections) { this.sections = sections; }
}

