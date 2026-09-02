package com.gakudo.learning.repository;

import com.gakudo.learning.model.ReviewSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ReviewScheduleRepository extends JpaRepository<ReviewSchedule, UUID> {
    
    // Tìm các thẻ đến hạn học của User (VD: những thẻ có nextReviewDate <= thời điểm hiện tại và chưa MASTERED)
    List<ReviewSchedule> findByUserIdAndNextReviewDateBeforeAndStatus(UUID userId, LocalDateTime now, String status);
    
    // Tìm thẻ cụ thể của User theo id từ vựng
    ReviewSchedule findByUserIdAndKnowledgeItemId(UUID userId, UUID knowledgeItemId);
}
