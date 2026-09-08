package com.gakudo.content.service;

import com.gakudo.content.dto.request.PracticeItemRequest;
import com.gakudo.content.dto.response.PracticeItemResponse;
import com.gakudo.content.model.PracticeItem;
import com.gakudo.content.model.SourceExercise;
import com.gakudo.content.repository.PracticeItemRepository;
import com.gakudo.content.repository.SourceExerciseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PracticeItemService {
    private static final String DEFAULT_STATUS = "PUBLISHED";
    private static final String DEFAULT_ORIGIN = "MANUAL";

    private final PracticeItemRepository practiceItemRepository;
    private final SourceExerciseRepository sourceExerciseRepository;

    public PracticeItemService(
            PracticeItemRepository practiceItemRepository,
            SourceExerciseRepository sourceExerciseRepository) {
        this.practiceItemRepository = practiceItemRepository;
        this.sourceExerciseRepository = sourceExerciseRepository;
    }

    public PracticeItemResponse createPracticeItem(PracticeItemRequest request) {
        validateRequest(request);

        PracticeItem item = new PracticeItem();
        item.setSourceExercise(resolveSourceExercise(request.getSourceExerciseId()));
        item.setLanguage(request.getLanguage());
        item.setLevelSystem(request.getLevelSystem());
        item.setLevelCode(request.getLevelCode());
        item.setSkill(request.getSkill());
        item.setPracticeType(request.getPracticeType());
        item.setStatus(defaultIfBlank(request.getStatus(), DEFAULT_STATUS));
        item.setOrigin(defaultIfBlank(request.getOrigin(), DEFAULT_ORIGIN));
        item.setConfidence(request.getConfidence());
        item.setDifficulty(request.getDifficulty());
        item.setOrderIndex(request.getOrderIndex());
        item.setPromptJson(request.getPromptJson());
        item.setAnswerJson(request.getAnswerJson());
        item.setExplanationJson(request.getExplanationJson());
        item.setRelatedKnowledgeItemIds(request.getRelatedKnowledgeItemIds());
        item.setSourceReferenceJson(request.getSourceReferenceJson());
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(practiceItemRepository.save(item));
    }

    public List<PracticeItemResponse> getPracticeItems(
            String language,
            String levelSystem,
            String levelCode,
            String skill,
            String status,
            UUID sourceExerciseId) {
        List<PracticeItem> items;
        if (sourceExerciseId != null) {
            items = practiceItemRepository.findBySourceExerciseIdOrderByOrderIndexAsc(sourceExerciseId);
        } else {
            requireParam(language, "language");
            requireParam(levelSystem, "levelSystem");
            requireParam(levelCode, "levelCode");
            String resolvedStatus = defaultIfBlank(status, DEFAULT_STATUS);
            if (skill == null || skill.isBlank()) {
                items = practiceItemRepository.findByLanguageAndLevelSystemAndLevelCodeAndStatusOrderByOrderIndexAsc(
                        language,
                        levelSystem,
                        levelCode,
                        resolvedStatus);
            } else {
                items = practiceItemRepository.findByLanguageAndLevelSystemAndLevelCodeAndSkillAndStatusOrderByOrderIndexAsc(
                        language,
                        levelSystem,
                        levelCode,
                        skill,
                        resolvedStatus);
            }
        }

        return items.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public PracticeItemResponse getPracticeItem(UUID id) {
        return practiceItemRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Practice item not found"));
    }

    private void validateRequest(PracticeItemRequest request) {
        requireParam(request.getLanguage(), "language");
        requireParam(request.getLevelSystem(), "levelSystem");
        requireParam(request.getLevelCode(), "levelCode");
        requireParam(request.getSkill(), "skill");
        requireParam(request.getPracticeType(), "practiceType");
        if (request.getPromptJson() == null || request.getPromptJson().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "promptJson is required");
        }
        if (request.getAnswerJson() == null || request.getAnswerJson().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "answerJson is required");
        }
    }

    private SourceExercise resolveSourceExercise(UUID sourceExerciseId) {
        if (sourceExerciseId == null) {
            return null;
        }
        return sourceExerciseRepository.findById(sourceExerciseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Source exercise not found"));
    }

    private void requireParam(String value, String name) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, name + " is required");
        }
    }

    private String defaultIfBlank(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value;
    }

    private PracticeItemResponse mapToResponse(PracticeItem item) {
        PracticeItemResponse response = new PracticeItemResponse();
        response.setId(item.getId());
        response.setSourceExerciseId(item.getSourceExercise() == null ? null : item.getSourceExercise().getId());
        response.setLanguage(item.getLanguage());
        response.setLevelSystem(item.getLevelSystem());
        response.setLevelCode(item.getLevelCode());
        response.setSkill(item.getSkill());
        response.setPracticeType(item.getPracticeType());
        response.setStatus(item.getStatus());
        response.setOrigin(item.getOrigin());
        response.setConfidence(item.getConfidence());
        response.setDifficulty(item.getDifficulty());
        response.setOrderIndex(item.getOrderIndex());
        response.setPromptJson(item.getPromptJson());
        response.setAnswerJson(item.getAnswerJson());
        response.setExplanationJson(item.getExplanationJson());
        response.setRelatedKnowledgeItemIds(item.getRelatedKnowledgeItemIds());
        response.setSourceReferenceJson(item.getSourceReferenceJson());
        response.setCreatedAt(item.getCreatedAt());
        response.setUpdatedAt(item.getUpdatedAt());
        return response;
    }
}
