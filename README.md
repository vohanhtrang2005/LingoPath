# GAKUDO - AI-assisted Language Learning Platform

GAKUDO is a modern, microservices-based language learning platform designed to support AI-extracted curriculum, spaced repetition (SRS), and multi-language support (initially focusing on Japanese and English).

## 🏗 Microservices Architecture

The system is broken down into independent microservices communicating via an API Gateway.

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| **API Gateway** | 8080 | N/A | Central entry point, handles JWT routing and identity injection. |
| **Auth Service** | 8081 | auth_db | Handles user registration, login, and JWT token issuance. |
| **Learning Service** | 8082 | learning_db | Manages study plans, daily lessons, and spaced repetition (SRS). |
| **Content Service** | 8083 | content_db | Library of all books, vocabulary, grammar, and source references. |
| **AI Service** | 8084 | ai_db (pgvector) | Handles document extraction, RAG, and candidate generation. |

## 🚀 Tech Stack

- **Backend:** Java 21, Spring Boot 3, Spring Cloud Gateway
- **Database:** PostgreSQL (with `pgvector` for AI embeddings)
- **Security:** RS256 JWT (Access & Refresh Tokens)
- **Infrastructure:** Docker & Docker Compose

## 🛠 How to run locally

Ensure Docker Desktop is running, then execute:

```bash
docker compose up -d --build
```

The API Gateway will be available at `http://localhost:8080`.
