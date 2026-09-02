package com.gakudo.learning.service;

import com.gakudo.learning.client.ContentKnowledgeClient;
import com.gakudo.learning.dto.request.CreateStudyPlanRequest;
import com.gakudo.learning.dto.response.DailyLearningItemResponse;
import com.gakudo.learning.dto.response.DailyLessonResponse;
import com.gakudo.learning.dto.response.ContentKnowledgeItemResponse;
import com.gakudo.learning.dto.response.DailySectionResponse;
import com.gakudo.learning.dto.response.StudyPlanResponse;
import com.gakudo.learning.model.DailyLearningItem;
import com.gakudo.learning.model.DailyLesson;
import com.gakudo.learning.model.DailySection;
import com.gakudo.learning.model.LearningProfile;
import com.gakudo.learning.model.StudyPlan;
import com.gakudo.learning.repository.DailyLessonRepository;
import com.gakudo.learning.repository.LearningProfileRepository;
import com.gakudo.learning.repository.StudyPlanRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudyPlanService {
    private static final String ACTIVE = "ACTIVE";
    private static final String ARCHIVED = "ARCHIVED";
    private static final String NOT_STARTED = "NOT_STARTED";
    private static final String LEARNING_DAY = "LEARNING_DAY";
    private static final String REVIEW_DAY = "REVIEW_DAY";
    private static final String KNOWLEDGE = "KNOWLEDGE";
    private static final String NEW_LEARNING = "NEW_LEARNING";

    private final LearningProfileRepository learningProfileRepository;
    private final StudyPlanRepository studyPlanRepository;
    private final DailyLessonRepository dailyLessonRepository;
    private final ContentKnowledgeClient contentKnowledgeClient;

    public StudyPlanService(
            LearningProfileRepository learningProfileRepository,
            StudyPlanRepository studyPlanRepository,
            DailyLessonRepository dailyLessonRepository,
            ContentKnowledgeClient contentKnowledgeClient) {
        this.learningProfileRepository = learningProfileRepository;
        this.studyPlanRepository = studyPlanRepository;
        this.dailyLessonRepository = dailyLessonRepository;
        this.contentKnowledgeClient = contentKnowledgeClient;
    }

    @Transactional
    public StudyPlanResponse createPlan(UUID userId, CreateStudyPlanRequest request) {
        validateCreatePlanRequest(request);

        LocalDate startDate = request.getStartDate() == null ? LocalDate.now() : request.getStartDate();
        LocalDate endDate = startDate.plusMonths(request.getDurationMonths()).minusDays(1);

        LearningProfile profile = new LearningProfile();
        profile.setUserId(userId);
        profile.setTargetLanguage(request.getTargetLanguage());
        profile.setTargetLevelSystem(request.getTargetLevelSystem());
        profile.setTargetLevelCode(request.getTargetLevelCode());
        profile.setDurationMonths(request.getDurationMonths());
        profile.setStartDate(startDate);
        profile.setExamDate(request.getExamDate());
        profile.setCurrentLevelNote(request.getCurrentLevelNote());
        profile.setWeaknessNote(request.getWeaknessNote());
        LearningProfile savedProfile = learningProfileRepository.save(profile);

        studyPlanRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(userId, ACTIVE)
                .ifPresent(existingPlan -> {
                    existingPlan.setStatus(ARCHIVED);
                    studyPlanRepository.save(existingPlan);
                });

        StudyPlan plan = new StudyPlan();
        plan.setUserId(userId);
        plan.setLearningProfile(savedProfile);
        plan.setStatus(ACTIVE);
        plan.setStartDate(startDate);
        plan.setEndDate(endDate);
        plan.setDurationMonths(request.getDurationMonths());
        plan.setTargetLanguage(request.getTargetLanguage());
        plan.setTargetLevelSystem(request.getTargetLevelSystem());
        plan.setTargetLevelCode(request.getTargetLevelCode());
        StudyPlan savedPlan = studyPlanRepository.save(plan);

        List<ContentKnowledgeItemResponse> curriculum = contentKnowledgeClient.getPublishedKnowledge(
                savedPlan.getTargetLanguage(),
                savedPlan.getTargetLevelSystem(),
                savedPlan.getTargetLevelCode()
        );
        dailyLessonRepository.saveAll(buildDailyLessons(savedPlan, curriculum));

        return mapPlan(savedPlan);
    }

    public StudyPlanResponse getCurrentPlan(UUID userId) {
        StudyPlan plan = studyPlanRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(userId, ACTIVE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Active study plan not found"));
        return mapPlan(plan);
    }

    public DailyLessonResponse getLesson(UUID userId, UUID lessonId) {
        DailyLesson lesson = dailyLessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Daily lesson not found"));
        if (!lesson.getStudyPlan().getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Khong co quyen truy cap");
        }
        return mapLesson(lesson);
    }

    public List<DailyLessonResponse> getLessons(UUID userId, UUID planId) {
        StudyPlan plan = studyPlanRepository.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Study plan not found"));
        if (!plan.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Khong co quyen truy cap");
        }
        return dailyLessonRepository.findByStudyPlanIdOrderByDayIndexAsc(planId)
                .stream()
                .map(this::mapLesson)
                .toList();
    }

    private void validateCreatePlanRequest(CreateStudyPlanRequest request) {
        if (request.getTargetLanguage() == null || request.getTargetLanguage().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "targetLanguage is required");
        }
        if (request.getTargetLevelSystem() == null || request.getTargetLevelSystem().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "targetLevelSystem is required");
        }
        if (request.getTargetLevelCode() == null || request.getTargetLevelCode().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "targetLevelCode is required");
        }
        if (request.getDurationMonths() == null || request.getDurationMonths() < 1 || request.getDurationMonths() > 24) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "durationMonths must be between 1 and 24");
        }
    }

    private List<DailyLesson> buildDailyLessons(StudyPlan plan, List<ContentKnowledgeItemResponse> curriculum) {
        long totalDays = ChronoUnit.DAYS.between(plan.getStartDate(), plan.getEndDate()) + 1;
        List<DailyLesson> lessons = new ArrayList<>();
        long learningDays = Math.max(1, totalDays - (totalDays / 7));
        Map<String, Queue<ContentKnowledgeItemResponse>> itemsByType = groupItemsByType(curriculum);
        Map<String, Integer> quotaByType = calculateQuotaByType(curriculum, learningDays);
        for (int i = 0; i < totalDays; i++) {
            DailyLesson lesson = new DailyLesson();
            lesson.setStudyPlan(plan);
            lesson.setLessonDate(plan.getStartDate().plusDays(i));
            int dayIndex = i + 1;
            String lessonType = dayIndex % 7 == 0 ? REVIEW_DAY : LEARNING_DAY;
            lesson.setDayIndex(dayIndex);
            lesson.setLessonType(lessonType);
            lesson.setStatus(NOT_STARTED);
            lesson.setSections(buildDefaultSections(lesson, plan.getTargetLanguage(), lessonType));
            if (LEARNING_DAY.equals(lessonType)) {
                assignKnowledgeItems(lesson, itemsByType, quotaByType);
            }
            lessons.add(lesson);
        }
        return lessons;
    }

    private Map<String, Queue<ContentKnowledgeItemResponse>> groupItemsByType(List<ContentKnowledgeItemResponse> curriculum) {
        if (curriculum == null) {
            return new HashMap<>();
        }
        return curriculum.stream()
                .filter(item -> item.getType() != null)
                .sorted(Comparator.comparing(
                        ContentKnowledgeItemResponse::getOrderIndex,
                        Comparator.nullsLast(Integer::compareTo)
                ))
                .collect(Collectors.groupingBy(
                        ContentKnowledgeItemResponse::getType,
                        Collectors.toCollection(ArrayList::new)
                ))
                .entrySet()
                .stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> new ArrayDeque<>(entry.getValue())
                ));
    }

    private Map<String, Integer> calculateQuotaByType(List<ContentKnowledgeItemResponse> curriculum, long learningDays) {
        Map<String, Long> countsByType = curriculum == null
                ? Map.of()
                : curriculum.stream()
                        .filter(item -> item.getType() != null)
                        .collect(Collectors.groupingBy(ContentKnowledgeItemResponse::getType, Collectors.counting()));

        Map<String, Integer> quotaByType = new HashMap<>();
        for (Map.Entry<String, Long> entry : countsByType.entrySet()) {
            quotaByType.put(entry.getKey(), (int) Math.ceil((double) entry.getValue() / learningDays));
        }
        return quotaByType;
    }

    private void assignKnowledgeItems(
            DailyLesson lesson,
            Map<String, Queue<ContentKnowledgeItemResponse>> itemsByType,
            Map<String, Integer> quotaByType) {
        for (DailySection section : lesson.getSections()) {
            Queue<ContentKnowledgeItemResponse> queue = itemsByType.get(section.getType());
            int quota = quotaByType.getOrDefault(section.getType(), 0);
            if (queue == null || quota <= 0) {
                continue;
            }
            int order = 1;
            while (order <= quota && !queue.isEmpty()) {
                ContentKnowledgeItemResponse knowledgeItem = queue.poll();
                DailyLearningItem item = new DailyLearningItem();
                item.setDailySection(section);
                item.setItemType(KNOWLEDGE);
                item.setItemId(knowledgeItem.getId());
                item.setAssignmentType(NEW_LEARNING);
                item.setOrderIndex(order);
                item.setStatus(NOT_STARTED);
                section.getItems().add(item);
                order++;
            }
        }
    }

    private List<DailySection> buildDefaultSections(DailyLesson lesson, String targetLanguage, String lessonType) {
        List<DailySection> sections = new ArrayList<>();
        int order = 1;
        if (REVIEW_DAY.equals(lessonType)) {
            sections.add(section(lesson, "REVIEW", order++, "Cumulative Review"));
            sections.add(section(lesson, "PRACTICE", order++, "Weak Items Practice"));
            sections.add(section(lesson, "TEST", order, "Review Test"));
            return sections;
        }

        sections.add(section(lesson, "VOCABULARY", order++, "Vocabulary"));
        sections.add(section(lesson, "GRAMMAR", order++, "Grammar"));
        if ("JAPANESE".equalsIgnoreCase(targetLanguage)) {
            sections.add(section(lesson, "KANJI", order++, "Kanji"));
        }
        sections.add(section(lesson, "READING", order++, "Reading"));
        sections.add(section(lesson, "LISTENING", order++, "Listening"));
        sections.add(section(lesson, "REVIEW", order, "Review"));
        return sections;
    }

    private DailySection section(DailyLesson lesson, String type, int orderIndex, String title) {
        DailySection section = new DailySection();
        section.setDailyLesson(lesson);
        section.setType(type);
        section.setOrderIndex(orderIndex);
        section.setTitle(title);
        section.setStatus(NOT_STARTED);
        return section;
    }

    private StudyPlanResponse mapPlan(StudyPlan plan) {
        StudyPlanResponse response = new StudyPlanResponse();
        response.setId(plan.getId());
        response.setUserId(plan.getUserId());
        response.setLearningProfileId(plan.getLearningProfile().getId());
        response.setStatus(plan.getStatus());
        response.setStartDate(plan.getStartDate());
        response.setEndDate(plan.getEndDate());
        response.setDurationMonths(plan.getDurationMonths());
        response.setTargetLanguage(plan.getTargetLanguage());
        response.setTargetLevelSystem(plan.getTargetLevelSystem());
        response.setTargetLevelCode(plan.getTargetLevelCode());
        return response;
    }

    private DailyLessonResponse mapLesson(DailyLesson lesson) {
        DailyLessonResponse response = new DailyLessonResponse();
        response.setId(lesson.getId());
        response.setStudyPlanId(lesson.getStudyPlan().getId());
        response.setLessonDate(lesson.getLessonDate());
        response.setDayIndex(lesson.getDayIndex());
        response.setLessonType(lesson.getLessonType());
        response.setStatus(lesson.getStatus());
        response.setSections(lesson.getSections().stream()
                .map(this::mapSection)
                .toList());
        return response;
    }

    private DailySectionResponse mapSection(DailySection section) {
        DailySectionResponse response = new DailySectionResponse();
        response.setId(section.getId());
        response.setType(section.getType());
        response.setOrderIndex(section.getOrderIndex());
        response.setTitle(section.getTitle());
        response.setStatus(section.getStatus());
        response.setItems(section.getItems().stream()
                .map(this::mapItem)
                .toList());
        return response;
    }

    private DailyLearningItemResponse mapItem(DailyLearningItem item) {
        DailyLearningItemResponse response = new DailyLearningItemResponse();
        response.setId(item.getId());
        response.setItemType(item.getItemType());
        response.setItemId(item.getItemId());
        response.setAssignmentType(item.getAssignmentType());
        response.setOrderIndex(item.getOrderIndex());
        response.setStatus(item.getStatus());
        return response;
    }
}


