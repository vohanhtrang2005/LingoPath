package com.gakudo.ai.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;
import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class GeminiProviderClient implements AiProviderClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiProviderClient.class);

    private final RestClient restClient;
    private final String baseUrl;
    private final String apiKey;
    private final String model;
    private final String fallbackModel;
    private static final int MAX_ATTEMPTS = 4;
    private static final long MAX_RETRY_DELAY_SECONDS = 60L;
    private static final Pattern RETRY_DELAY_PATTERN =
            Pattern.compile("\\\"retryDelay\\\"\\s*:\\s*\\\"(\\d+)s\\\"");

    public GeminiProviderClient(
            @Value("${gakudo.ai.gemini.base-url}") String baseUrl,
            @Value("${gakudo.ai.gemini.api-key:}") String apiKey,
            @Value("${gakudo.ai.gemini.model}") String model,
            @Value("${gakudo.ai.gemini.fallback-model:gemini-3.6-flash}") String fallbackModel) {
        this.baseUrl = baseUrl;
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
        this.apiKey = firstNonBlank(apiKey, System.getenv("GEMINI_API_KEY"));
        this.model = model;
        this.fallbackModel = fallbackModel;
    }

    @Override
    public String generate(String prompt) {
        log.info(
                "Generating content with Gemini provider. baseUrl={}, model={}, apiKeyConfigured={}",
                baseUrl,
                model,
                apiKey != null && !apiKey.isBlank()
        );

        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gemini API key is not configured"
            );
        }

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                ),
                "generationConfig", Map.of(
                        "temperature", 0.1,
                        "responseMimeType", "application/json"
                )
        );

        try {
            return requestTextWithRetries(model, requestBody);
        } catch (RestClientResponseException primaryException) {
            if (isBusy(primaryException) && hasFallbackModel()) {
                log.warn("Gemini model {} is busy after retries. Trying fallback model {}.", model, fallbackModel);
                return generateWithFallback(requestBody);
            }
            throw toBadGateway(primaryException);
        } catch (ResponseStatusException primaryException) {
            if (isInvalidResponse(primaryException) && hasFallbackModel()) {
                log.warn("Gemini model {} returned an invalid response. Trying fallback model {}.", model, fallbackModel);
                return generateWithFallback(requestBody);
            }
            throw primaryException;
        } catch (RestClientException exception) {
            log.error("Gemini API request failed before receiving a response", exception);
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Gemini service is unavailable",
                    exception
            );
        }
    }

    private String generateWithFallback(Map<String, Object> requestBody) {
        try {
            return requestTextWithRetries(fallbackModel, requestBody);
        } catch (RestClientResponseException fallbackException) {
            throw toBadGateway(fallbackException);
        } catch (ResponseStatusException fallbackException) {
            throw fallbackException;
        } catch (RestClientException fallbackException) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Gemini fallback service is unavailable",
                    fallbackException
            );
        }
    }

    private String requestTextWithRetries(
            String selectedModel,
            Map<String, Object> requestBody) {
        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                Map<?, ?> response = restClient.post()
                        .uri("/v1beta/models/{model}:generateContent", selectedModel)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("x-goog-api-key", apiKey)
                        .body(requestBody)
                        .retrieve()
                        .body(Map.class);
                return extractText(response);
            } catch (RestClientResponseException exception) {
                if (isRetryable(exception) && attempt < MAX_ATTEMPTS) {
                    long delaySeconds = retryDelaySeconds(exception, attempt);
                    log.warn("Gemini model {} attempt {} failed with {}. Retrying in {}s.",
                            selectedModel, attempt, exception.getStatusCode(), delaySeconds);
                    sleepBeforeRetry(delaySeconds);
                    continue;
                }
                throw exception;
            } catch (ResponseStatusException exception) {
                if (attempt < MAX_ATTEMPTS) {
                    log.warn("Gemini model {} returned an invalid response on attempt {}. Retrying.", selectedModel, attempt);
                    sleepBeforeRetry(Math.min(8L, attempt * 2L));
                    continue;
                }
                throw exception;
            } catch (RestClientException exception) {
                if (attempt < MAX_ATTEMPTS) {
                    log.warn("Gemini model {} attempt {} failed before receiving a response. Retrying.", selectedModel, attempt);
                    sleepBeforeRetry(Math.min(8L, attempt * 2L));
                    continue;
                }
                throw exception;
            }
        }
        throw new IllegalStateException("Gemini request failed after retries");
    }

    private boolean isRetryable(RestClientResponseException exception) {
        return exception.getStatusCode().value() == 429 || exception.getStatusCode().is5xxServerError();
    }

    private boolean isBusy(RestClientResponseException exception) {
        return exception.getStatusCode().value() == 429 || exception.getStatusCode().value() == 503;
    }

    private long retryDelaySeconds(RestClientResponseException exception, int attempt) {
        if (exception.getStatusCode().value() == 429) {
            Matcher matcher = RETRY_DELAY_PATTERN.matcher(exception.getResponseBodyAsString());
            if (matcher.find()) {
                return Math.min(MAX_RETRY_DELAY_SECONDS, Long.parseLong(matcher.group(1)));
            }

            long exponentialDelay = 8L * (1L << Math.min(attempt - 1, 2));
            return Math.min(MAX_RETRY_DELAY_SECONDS, exponentialDelay);
        }

        return Math.min(8L, attempt * 2L);
    }

    private boolean hasFallbackModel() {
        return fallbackModel != null && !fallbackModel.isBlank() && !fallbackModel.equals(model);
    }

    private boolean isInvalidResponse(ResponseStatusException exception) {
        return exception.getReason() != null
                && exception.getReason().startsWith("Invalid Gemini response");
    }

    private ResponseStatusException toBadGateway(RestClientResponseException exception) {
        String responseBody = exception.getResponseBodyAsString();
        String detail = responseBody == null || responseBody.isBlank()
                ? exception.getMessage()
                : responseBody;
        log.error("Gemini API rejected generateContent request. status={}, body={}",
                exception.getStatusCode(), abbreviate(detail), exception);
        return new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "Gemini returned " + exception.getStatusCode() + ": " + detail,
                exception
        );
    }

    private void sleepBeforeRetry(long delaySeconds) {
        try {
            Thread.sleep(Duration.ofSeconds(delaySeconds).toMillis());
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Gemini retry interrupted", exception);
        }
    }

    private String extractText(Map<?, ?> response) {
        try {
            List<?> candidates = (List<?>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new IllegalStateException("Gemini response has no candidates");
            }
            Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
            if (content == null) {
                throw new IllegalStateException("Gemini response candidate has no content");
            }
            List<?> parts = (List<?>) content.get("parts");
            if (parts == null || parts.isEmpty()) {
                throw new IllegalStateException("Gemini response content has no parts");
            }

            for (Object part : parts) {
                if (part instanceof Map<?, ?> partMap && partMap.get("text") != null) {
                    return partMap.get("text").toString();
                }
            }

            throw new IllegalStateException("Gemini response parts have no text");
        } catch (RuntimeException e) {
            log.warn("Gemini response could not be parsed: {}", e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Invalid Gemini response",
                    e
            );
        }
    }

    private String abbreviate(String value) {
        if (value == null) {
            return "";
        }
        return value.length() <= 2000
                ? value
                : value.substring(0, 2000) + "...";
    }

    private String firstNonBlank(String first, String second) {
        if (first != null && !first.isBlank()) {
            return first;
        }
        return second == null ? "" : second;
    }
}
