package com.gakudo.content.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Service
public class OcrService {
    private final String language;
    private final String dataPath;

    public OcrService(
            @Value("${gakudo.content.ocr.language:eng+jpn}") String language,
            @Value("${gakudo.content.ocr.datapath:}") String dataPath
    ) {
        this.language = language;
        this.dataPath = resolveDataPath(dataPath);
    }

    public String extractImage(Path imagePath) {
        try {
            return normalizeText(createTesseract().doOCR(imagePath.toFile()));
        } catch (TesseractException e) {
            throw new IllegalStateException("OCR failed: " + e.getMessage(), e);
        }
    }

    public String extractImage(BufferedImage image) {
        try {
            return normalizeText(createTesseract().doOCR(image));
        } catch (TesseractException e) {
            throw new IllegalStateException("OCR failed: " + e.getMessage(), e);
        }
    }

    private Tesseract createTesseract() {
        Tesseract tesseract = new Tesseract();
        tesseract.setLanguage(language);
        if (!dataPath.isBlank()) {
            tesseract.setDatapath(dataPath);
        }
        return tesseract;
    }

    private String resolveDataPath(String configuredDataPath) {
        if (configuredDataPath != null && !configuredDataPath.isBlank()) {
            return configuredDataPath.trim();
        }

        List<String> commonLinuxPaths = List.of(
                "/usr/share/tesseract-ocr/4.00/tessdata",
                "/usr/share/tesseract-ocr/5/tessdata",
                "/usr/share/tessdata"
        );
        return commonLinuxPaths.stream()
                .filter(path -> Files.isDirectory(Path.of(path)))
                .findFirst()
                .orElse("");
    }

    private String normalizeText(String text) {
        return text == null ? "" : text.trim();
    }
}
