package com.gakudo.content.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class DocumentExtractionConfig {
    @Bean(name = "documentExtractionExecutor", defaultCandidate = false)
    public ThreadPoolTaskExecutor documentExtractionExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        // OCR holds rendered pages in memory, so process one document at a time.
        executor.setCorePoolSize(1);
        executor.setMaxPoolSize(1);
        executor.setQueueCapacity(16);
        executor.setThreadNamePrefix("document-extraction-");
        return executor;
    }
}
