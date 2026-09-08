package com.gakudo.content.repository;

import com.gakudo.content.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface BookRepository extends JpaRepository<Book, UUID> {
    @Query("""
            select b from Book b
            where (:language is null or b.language = :language)
              and (:levelSystem is null or b.levelSystem = :levelSystem)
              and (:levelCode is null or b.levelCode = :levelCode)
            order by b.createdAt desc
            """)
    List<Book> searchBooks(
            @Param("language") String language,
            @Param("levelSystem") String levelSystem,
            @Param("levelCode") String levelCode);
}
