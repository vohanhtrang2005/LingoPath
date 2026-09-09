package com.gakudo.content.service;

import com.gakudo.content.dto.ai.AiChunkBatchRequest;
import com.gakudo.content.dto.ai.AiChunkBatchResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@Service
public class HttpAiChunkClient implements AiChunkClient {
    private final RestClient restClient;

    public HttpAiChunkClient(
            @Value("${gakudo.ai.base-url:http://ai-service:8084}") String aiBaseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(aiBaseUrl)
                .build();
    }

    @Override
    public AiChunkBatchResponse generateChunkPlan(AiChunkBatchRequest request) {
        try {
            return restClient.post()
                    .uri("/api/ai/chunks/plan")
                    .body(request)
                    .retrieve()
                    .body(AiChunkBatchResponse.class);
        } catch (RestClientResponseException e) {
            String responseBody = e.getResponseBodyAsString();
            String detail = responseBody == null || responseBody.isBlank()
                    ? e.getMessage()
                    : responseBody;
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "AI chunk service returned " + e.getStatusCode() + ": " + detail,
                    e
            );
        } catch (RestClientException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI chunk service is unavailable", e);
        }
    }
}
