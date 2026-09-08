package com.gakudo.content.repository;

import com.gakudo.content.model.ExtractedPageText;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExtractedPageTextRepository extends JpaRepository<ExtractedPageText, UUID> {
    List<ExtractedPageText> findByDocumentIdOrderByPageNumberAsc(UUID documentId);
    void deleteByDocumentId(UUID documentId);
}
