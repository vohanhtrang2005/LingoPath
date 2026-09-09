package com.gakudo.content.service;

import com.gakudo.content.dto.ai.AiChunkBatchRequest;
import com.gakudo.content.dto.ai.AiChunkBatchResponse;

public interface AiChunkClient {
    AiChunkBatchResponse generateChunkPlan(AiChunkBatchRequest request);
}
