package com.gakudo.content.service;

import com.gakudo.content.model.DocumentType;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class DocumentTypeDetector {
    public DocumentType detect(String contentType, String fileName) {
        String normalizedContentType = contentType == null ? "" : contentType.toLowerCase(Locale.ROOT);
        String normalizedFileName = fileName == null ? "" : fileName.toLowerCase(Locale.ROOT);

        if (normalizedContentType.equals("application/pdf") || normalizedFileName.endsWith(".pdf")) return DocumentType.PDF;
        if (normalizedContentType.startsWith("image/") || hasAnyExtension(normalizedFileName, ".png", ".jpg", ".jpeg")) {
            return DocumentType.IMAGE;
        }
        if (normalizedContentType.startsWith("text/plain") || hasAnyExtension(normalizedFileName, ".txt", ".md", ".csv")) {
            return DocumentType.TEXT;
        }
        if (normalizedContentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                || normalizedFileName.endsWith(".docx")) {
            return DocumentType.DOCX;
        }
        if (normalizedContentType.equals("text/html") || hasAnyExtension(normalizedFileName, ".html", ".htm")) {
            return DocumentType.HTML;
        }
        if (normalizedContentType.startsWith("audio/") || hasAnyExtension(normalizedFileName, ".mp3", ".wav", ".m4a")) {
            return DocumentType.AUDIO;
        }

        return DocumentType.UNKNOWN;
    }

    private boolean hasAnyExtension(String fileName, String... extensions) {
        for (String extension : extensions) {
            if (fileName.endsWith(extension)) {
                return true;
            }
        }
        return false;
    }
}
