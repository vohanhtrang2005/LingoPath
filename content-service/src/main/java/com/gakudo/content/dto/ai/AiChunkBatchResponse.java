package com.gakudo.content.dto.ai;

import java.util.List;

public class AiChunkBatchResponse {
    private List<AiChunkPlanItem> chunks;

    public List<AiChunkPlanItem> getChunks() { return chunks; }
    public void setChunks(List<AiChunkPlanItem> chunks) { this.chunks = chunks; }
}
