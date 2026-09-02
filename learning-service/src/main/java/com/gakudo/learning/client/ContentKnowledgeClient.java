package com.gakudo.learning.client;

import com.gakudo.learning.dto.response.ContentKnowledgeItemResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
public class ContentKnowledgeClient {
    private final RestClient restClient;

    public ContentKnowledgeClient(@Value("${gakudo.services.content-service-url:http://content-service:8083}") String contentServiceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(contentServiceUrl)
                .build();
    }

    public List<ContentKnowledgeItemResponse> getPublishedKnowledge(String language, String levelSystem, String levelCode) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/content/knowledge")
                        .queryParam("language", language)
                        .queryParam("levelSystem", levelSystem)
                        .queryParam("levelCode", levelCode)
                        .build())
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}
