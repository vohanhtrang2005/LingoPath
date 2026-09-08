package com.gakudo.learning.client;

import com.gakudo.learning.dto.response.ContentPracticeItemResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.UUID;

@Component
public class ContentPracticeClient {
    private final RestClient restClient;

    public ContentPracticeClient(@Value("${gakudo.services.content-service-url:http://content-service:8083}") String contentServiceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(contentServiceUrl)
                .build();
    }

    public List<ContentPracticeItemResponse> getPublishedPractice(String language, String levelSystem, String levelCode) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/content/practice-items")
                        .queryParam("language", language)
                        .queryParam("levelSystem", levelSystem)
                        .queryParam("levelCode", levelCode)
                        .queryParam("status", "PUBLISHED")
                        .build())
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

    public ContentPracticeItemResponse getPracticeItem(UUID id) {
        return restClient.get()
                .uri("/api/content/practice-items/{id}", id)
                .retrieve()
                .body(ContentPracticeItemResponse.class);
    }
}
