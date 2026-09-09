package com.gakudo.content.repository;

import com.gakudo.content.model.SourceChunk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SourceChunkRepository extends JpaRepository<SourceChunk, UUID> {
    List<SourceChunk> findByDocumentIdOrderByChunkIndexAsc(UUID documentId);
    Optional<SourceChunk> findByIdAndDocumentId(UUID id, UUID documentId);
    void deleteByDocumentId(UUID documentId);
}
