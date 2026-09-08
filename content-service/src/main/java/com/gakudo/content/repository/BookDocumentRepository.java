package com.gakudo.content.repository;

import com.gakudo.content.model.BookDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BookDocumentRepository extends JpaRepository<BookDocument, UUID> {
    List<BookDocument> findByBookIdOrderByCreatedAtDesc(UUID bookId);
}
