package com.gakudo.content.repository;

import com.gakudo.content.model.BookDocument;
import com.gakudo.content.model.DocumentStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookDocumentRepository extends JpaRepository<BookDocument, UUID> {
    List<BookDocument> findByBookIdOrderByCreatedAtDesc(UUID bookId);

    List<BookDocument> findByStatus(DocumentStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select d from BookDocument d where d.id = :id")
    Optional<BookDocument> findForExtraction(@Param("id") UUID id);
}
