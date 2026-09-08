package com.gakudo.content.dto.request;

public class BookRequest {
    private String name;
    private String author;
    private String language;
    private String levelSystem;
    private String levelCode;
    private String status;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getLevelSystem() { return levelSystem; }
    public void setLevelSystem(String levelSystem) { this.levelSystem = levelSystem; }
    public String getLevelCode() { return levelCode; }
    public void setLevelCode(String levelCode) { this.levelCode = levelCode; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
