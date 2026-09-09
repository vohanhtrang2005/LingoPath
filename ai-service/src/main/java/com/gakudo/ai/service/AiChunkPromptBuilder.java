package com.gakudo.ai.service;

import com.gakudo.ai.dto.AiChunkBatchRequest;
import com.gakudo.ai.dto.AiChunkPageRequest;
import org.springframework.stereotype.Component;

@Component
public class AiChunkPromptBuilder {

    public String build(AiChunkBatchRequest request) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("""
                You are analyzing extracted textbook pages for GAKUDO,
                a source-grounded language learning platform.

                Task:
                Split the provided textbook pages into meaningful source chunks
                by page, section, or topic.

                Important rules:
                - The uploaded source text is the only source of truth.
                - Do not invent content.
                - Do not rewrite, summarize, translate, or enrich the source.
                - Preserve the original reading order.
                - Do not freely reorder the curriculum.
                - A page may appear in an overlapping batch.
                - Do not create duplicate chunks only because content is repeated.
                - If the content type is unclear, use UNKNOWN.
                - If multiple content types cannot be separated safely, use MIXED.
                - Keep an exercise's instruction, word bank, passage,
                  audio reference, and answer context together.
                - Do not split an exercise if the question would lose required context.
                - Do not generate vocabulary, grammar explanations, or exercises.
                - This step only identifies source chunks.

                Allowed sectionType values:
                VOCABULARY
                GRAMMAR
                KANJI
                READING
                LISTENING
                EXERCISE
                MIXED
                UNKNOWN

                Output requirements:
                - Return JSON only.
                - Do not wrap the JSON in Markdown.
                - Preserve the source order.
                - pageFrom and pageTo must use the original page numbers.
                - startMarker must be copied exactly from the source text.
                - endMarker must be copied exactly from the source text.
                - Prefer a short, distinctive, single-line marker.
                - Avoid quotation marks and backslashes in markers when an equivalent
                  source excerpt without them is available.
                - If a marker contains a line break, encode it as \\n inside the JSON string.
                - Never place a literal line break, tab, or control character inside a JSON string.
                - If the chunk continues until the end of the batch,
                  set endMarker to null.

                JSON format:
                {
                  "chunks": [
                    {
                      "sectionTitle": "string",
                      "sectionType": "VOCABULARY",
                      "pageFrom": 1,
                      "pageTo": 2,
                      "startMarker": "exact source text",
                      "endMarker": "exact source text or null"
                    }
                  ]
                }

                Document ID: """);

        prompt.append(request.getDocumentId());

        prompt.append("\nBatch index: ")
                .append(request.getBatchIndex());

        prompt.append("\nBatch page range: ")
                .append(request.getPageFrom())
                .append("-")
                .append(request.getPageTo());

        if (request.getReviewFeedback() != null && !request.getReviewFeedback().isBlank()) {
            prompt.append("\n\nADMIN REVIEW FEEDBACK FOR REGENERATION:\n")
                    .append(request.getReviewFeedback());
        }

        prompt.append("\n\nSOURCE PAGES:\n");

        if (request.getPages() != null) {
            for (AiChunkPageRequest page : request.getPages()) {
                prompt.append("\n===== PAGE ")
                        .append(page.getPageNumber())
                        .append(" =====\n");

                if (page.getText() == null || page.getText().isBlank()) {
                    prompt.append("[EMPTY PAGE TEXT]\n");
                } else {
                    prompt.append(page.getText())
                            .append("\n");
                }

                prompt.append("===== END PAGE ")
                        .append(page.getPageNumber())
                        .append(" =====\n");
            }
        }

        return prompt.toString();
    }
}
