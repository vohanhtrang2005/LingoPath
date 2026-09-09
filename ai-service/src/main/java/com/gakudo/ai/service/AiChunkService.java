package com.gakudo.ai.service;

import com.gakudo.ai.dto.AiChunkBatchRequest;
import com.gakudo.ai.dto.AiChunkBatchResponse;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

@Service
public class AiChunkService {

    private static final Logger log = LoggerFactory.getLogger(AiChunkService.class);

    private final AiChunkPromptBuilder promptBuilder;
    private final ObjectProvider<AiProviderClient> aiProviderClientProvider;
    private final ObjectMapper objectMapper;

    public AiChunkService(
            AiChunkPromptBuilder promptBuilder,
            ObjectProvider<AiProviderClient> aiProviderClientProvider,
            ObjectMapper objectMapper) {
        this.promptBuilder = promptBuilder;
        this.aiProviderClientProvider = aiProviderClientProvider;
        this.objectMapper = objectMapper;
    }

    public AiChunkBatchResponse generateChunkPlan(
            AiChunkBatchRequest request) {

        String prompt = promptBuilder.build(request);

        AiProviderClient aiProviderClient = aiProviderClientProvider.getIfAvailable();
        if (aiProviderClient == null) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "AI provider is not configured"
            );
        }
        log.info("Using AI provider client: {}", aiProviderClient.getClass().getName());

        String aiJsonResponse = aiProviderClient.generate(prompt);

        try {
            return objectMapper.readValue(
                    normalizeJsonControlCharacters(aiJsonResponse),
                    AiChunkBatchResponse.class
            );
        } catch (JacksonException e) {
            log.error("AI returned invalid chunk JSON: {}", abbreviate(aiJsonResponse), e);
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "AI returned invalid chunk response: " + abbreviate(aiJsonResponse),
                    e
            );
        }
    }

    /**
     * Gemini can copy a multi-line source marker into a JSON string using
     * literal control characters. JSON requires those characters to be escaped.
     */
    private String normalizeJsonControlCharacters(String value) {
        if (value == null || value.isEmpty()) {
            return value;
        }

        StringBuilder normalized = new StringBuilder(value.length());
        boolean insideString = false;
        boolean escaped = false;

        for (int index = 0; index < value.length(); index++) {
            char character = value.charAt(index);
            if (escaped) {
                if (isValidJsonEscape(character)) {
                    normalized.append(character);
                } else {
                    // Preserve source backslashes such as "\\l" as literal JSON content.
                    normalized.append('\\').append(character);
                }
                escaped = false;
                continue;
            }

            if (insideString && character == '\\') {
                normalized.append(character);
                escaped = true;
                continue;
            }

            if (character == '"') {
                if (!insideString || isLikelyStringTerminator(value, index)) {
                    insideString = !insideString;
                    normalized.append(character);
                } else {
                    normalized.append("\\\"");
                }
                continue;
            }

            if (insideString) {
                switch (character) {
                    case '\n' -> normalized.append("\\n");
                    case '\r' -> normalized.append("\\r");
                    case '\t' -> normalized.append("\\t");
                    default -> {
                        if (Character.isISOControl(character)) {
                            normalized.append(String.format("\\u%04x", (int) character));
                        } else {
                            normalized.append(character);
                        }
                    }
                }
            } else {
                normalized.append(character);
            }
        }

        return normalized.toString();
    }

    private boolean isLikelyStringTerminator(String value, int quoteIndex) {
        int nextIndex = quoteIndex + 1;
        while (nextIndex < value.length() && Character.isWhitespace(value.charAt(nextIndex))) {
            nextIndex++;
        }

        if (nextIndex >= value.length()) {
            return true;
        }

        char next = value.charAt(nextIndex);
        return next == ',' || next == '}' || next == ']' || next == ':';
    }

    private boolean isValidJsonEscape(char character) {
        return character == '"'
                || character == '\\'
                || character == '/'
                || character == 'b'
                || character == 'f'
                || character == 'n'
                || character == 'r'
                || character == 't'
                || character == 'u';
    }

    private String abbreviate(String value) {
        if (value == null) {
            return "";
        }
        return value.length() <= 1000
                ? value
                : value.substring(0, 1000) + "...";
    }
}
