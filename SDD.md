# Software Design Document

## GAKUDO - AI-assisted Language Learning Platform

| Item | Value |
|---|---|
| Version | 2.0 |
| Status | Draft |
| Based on SRS | v2.0 |
| Architecture | Microservices |
| Backend | Java 21, Spring Boot 3.x |
| Frontend | React, TypeScript, Vite |
| Database | PostgreSQL |
| Vector storage | PostgreSQL + pgvector |
| AI | LLM + embeddings + RAG |
| Deployment | Docker / Docker Compose |

---

# 1. Architecture Overview

GAKUDO uses microservices behind one API Gateway.

```text
Client
-> API Gateway
   -> Auth Service
   -> Content Service
   -> Learning Service
   -> AI Service
```

Service ownership:

- Auth Service owns users, passwords, refresh tokens and JWT issuance.
- API Gateway owns external routing, JWT validation and identity header injection.
- Content Service owns books, documents, knowledge items and source references.
- AI Service owns document chunks, embeddings, retrieval and AI generation.
- Learning Service owns study plans, daily lessons, progress, review schedules, scoring and adaptation.

No service may directly access another service's database.

---

# 2. Technology Stack

## 2.1 Backend

- Java 21
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- Maven multi-module project

## 2.2 Data

- PostgreSQL for relational data
- PostgreSQL JSONB for flexible knowledge content
- pgvector for embeddings

## 2.3 AI and document processing

- PDFBox for text PDFs
- OCR provider abstraction for scanned PDFs
- Embedding model behind an internal interface
- LLM provider behind an internal interface
- Hybrid retrieval using vector and keyword search

## 2.4 Infrastructure

- Docker Compose for local development
- RabbitMQ in Phase 2 or Phase 7 depending on job complexity
- Prometheus/Grafana in later phases
- OpenTelemetry in later phases

---

# 3. Security Design

## 3.1 Auth Service

Auth Service signs JWT access tokens with RS256.

```text
Private key: Auth Service only
Public key: exposed through JWKS endpoint
```

JWT claims:

- `sub`: user id;
- `roles`: user roles;
- `iat`;
- `exp`;
- `jti`.

## 3.2 JWKS endpoint

Auth Service exposes:

```text
GET /api/auth/.well-known/jwks.json
```

This endpoint returns public keys only.

## 3.3 API Gateway

Gateway validates incoming JWTs using the JWKS endpoint.

After validation, Gateway injects:

```text
X-User-Id
X-User-Roles
```

Downstream services trust only headers injected by Gateway, not headers supplied directly by clients.

In Docker, internal services should not be externally exposed. External traffic should enter through Gateway only.

---

# 4. Content Service Design

## 4.1 Responsibility

Content Service owns official learning content and source traceability.

It stores:

- books;
- document metadata;
- knowledge items;
- source references;
- item review status.

## 4.2 Book

`Book` represents an uploaded source.

Important design rule:

```text
A book may contain one content type or many mixed content types.
```

Therefore, the system must not depend on `book.type = VOCAB_ONLY` or `book.type = GRAMMAR_ONLY`.

Recommended fields:

```text
id
title
language
levelSystem
levelCode
sourceType
status
createdAt
updatedAt
```

Examples:

```text
language = JAPANESE
levelSystem = JLPT
levelCode = N3
```

```text
language = ENGLISH
levelSystem = CEFR
levelCode = B1
```

## 4.3 KnowledgeItem

`KnowledgeItem` is official approved knowledge.

Recommended fields:

```text
id
language
levelSystem
levelCode
type
status
contentJson
orderIndex
difficulty
sourceReferences
createdAt
updatedAt
```

Supported initial types:

```text
VOCABULARY
GRAMMAR
KANJI
READING
LISTENING
EXERCISE
```

`contentJson` stays flexible because vocabulary, grammar, listening and reading have different shapes.

Example vocabulary content:

```json
{
  "word": "予約",
  "reading": "よやく",
  "meaning": "reservation",
  "examples": [
    {
      "text": "ホテルを予約しました。",
      "meaning": "I reserved a hotel."
    }
  ]
}
```

Example grammar content:

```json
{
  "pattern": "Vたばかり",
  "meaning": "just did something",
  "explanation": "Used when an action has just been completed.",
  "examples": [
    {
      "text": "ご飯を食べたばかりです。",
      "meaning": "I have just eaten."
    }
  ]
}
```

## 4.4 SourceReference

`SourceReference` links official knowledge to evidence.

Current simplified model:

```text
id
knowledgeItem
book
sectionTitle
sectionOrder
pageStart
pageEnd
locationText
chunkId
evidenceText
```

No separate `SourceSection` table is required in the early design. If source structure becomes complex later, `SourceSection` can be reintroduced.

---

# 5. AI Service Design

## 5.1 Responsibility

AI Service supports content creation and learning assistance.

It owns:

- document chunks;
- embeddings;
- vector search;
- keyword search;
- hybrid retrieval;
- AI extraction;
- AI explanation;
- grounded chat.

AI Service does not own the final curriculum schedule.

## 5.2 DocumentChunk

Recommended fields:

```text
id
bookId
documentVersionId
language
levelSystem
levelCode
pageStart
pageEnd
sectionTitle
sectionOrder
chunkText
chunkType
embeddingStatus
createdAt
```

`chunkType` values:

```text
VOCABULARY
GRAMMAR
KANJI
READING
LISTENING
EXERCISE
MIXED
UNKNOWN
```

## 5.3 EmbeddingRecord

Recommended fields:

```text
id
chunkId
embeddingModel
embeddingVector
createdAt
```

## 5.4 AI-created KnowledgeItem and PracticeItem

The early design does not use separate `KnowledgeCandidate` or `PracticeCandidate` tables.

AI extraction writes normal `KnowledgeItem` or `PracticeItem` records with candidate status.

Recommended shared review fields:

```text
status
origin
confidence
reviewedAt
reviewedBy
```

Example statuses:

```text
AI_CANDIDATE
NEEDS_REVIEW
PUBLISHED
REJECTED
RETIRED
```

Example origins:

```text
MANUAL
AI_EXTRACTED
AI_GENERATED
IMPORTED
```

This avoids duplicate candidate tables and copy logic. Admin review updates the same record's status.

## 5.5 Mixed book processing

For a mixed book, AI Service processes each chunk independently.

Example:

```text
Page 20 chunk:
- dialogue
- vocabulary list
- grammar explanation
- exercise
```

The chunk can produce:

```text
KnowledgeItem records with `AI_CANDIDATE` status
PracticeItem records with `AI_CANDIDATE` status
```

Each AI-created item keeps the same `chunkId` and evidence text through `SourceReference`.

---

# 6. Document Processing Pipeline

## 6.1 Pipeline

```text
Upload book/document
-> create ProcessingJob
-> detect text PDF or scanned PDF
-> extract text or OCR
-> clean text
-> split pages
-> chunk by page, section and topic
-> classify chunk type
-> embed chunks
-> extract AI-created items
-> admin review
-> publish KnowledgeItem
```

## 6.2 ProcessingJob

Recommended fields:

```text
id
bookId
status
currentStep
errorMessage
createdAt
startedAt
finishedAt
```

Statuses:

```text
UPLOADED
PROCESSING
EXTRACTING
OCR_PROCESSING
CHUNKING
EMBEDDING
CANDIDATES_READY
FAILED
DONE
```

## 6.3 Async design

Early implementation may use:

```text
DB-backed job table + scheduled worker
```

RabbitMQ should be introduced when:

- processing jobs become long and numerous;
- retries need stronger durability;
- multiple workers are needed;
- Content Service and AI Service need event-based decoupling.

---

# 7. Learning Service Design

## 7.1 Responsibility

Learning Service owns the student's actual learning flow.

It stores:

- learning profile;
- study plan;
- daily lessons;
- daily sections;
- daily learning items;
- progress;
- practice attempts;
- test attempts;
- scores;
- knowledge gaps;
- review schedules;
- plan revisions.

## 7.2 LearningProfile

Recommended fields:

```text
id
userId
targetLanguage
targetLevelSystem
targetLevelCode
durationMonths
startDate
examDate
currentLevelNote
weaknessNote
createdAt
updatedAt
```

`startDate` defaults to the plan creation date.

## 7.3 StudyPlan

Recommended fields:

```text
id
userId
learningProfileId
status
startDate
endDate
durationMonths
targetLanguage
targetLevelSystem
targetLevelCode
createdAt
updatedAt
```

Statuses:

```text
DRAFT
ACTIVE
COMPLETED
ARCHIVED
```

## 7.4 DailyLesson

`DailyLesson` is the web learning unit for one day.

Recommended fields:

```text
id
studyPlanId
lessonDate
dayIndex
status
createdAt
updatedAt
```

This is not the same as a book lesson.

## 7.5 DailySection

`DailySection` groups a part of the daily lesson.

Recommended fields:

```text
id
dailyLessonId
type
orderIndex
title
status
```

Types:

```text
VOCABULARY
GRAMMAR
KANJI
LISTENING
READING
PRACTICE
REVIEW
TEST
```

## 7.6 DailyLearningItem

Recommended fields:

```text
id
dailySectionId
knowledgeItemId
practiceItemId
orderIndex
status
```

Statuses:

```text
NOT_STARTED
IN_PROGRESS
COMPLETED
SKIPPED
```

## 7.7 AI support placement

AI support explanations are not stored as `DailyLearningItem` records in the current design.

`DailyLearningItem.itemType` supports:

```text
KNOWLEDGE
PRACTICE
REVIEW
TEST
```

Inline lower-level explanations should be returned in answer review or explanation responses. If the system later needs persistent AI support assignments, a dedicated `AiSupportItem` entity should be introduced first.

## 7.8 ReviewSchedule

Current early model:

```text
id
userId
knowledgeItemId
reviewStep
nextReviewDate
status
createdAt
updatedAt
```

Early version may use simple intervals.

Later version should use FSRS and immutable review history.

---

# 8. Planner Design

The planner must be deterministic.

Inputs:

```text
LearningProfile
Published KnowledgeItems
Knowledge orderIndex
Knowledge type
Source order
Duration
Weakness notes
Existing progress
Review load
```

Outputs:

```text
StudyPlan
DailyLessons
DailySections
DailyLearningItems
ReviewSchedules
```

Planning rules:

1. Select published content matching target language and level.
2. Order content mainly by source order and `orderIndex`.
3. Spread required content across available days.
4. Balance daily sections across vocabulary, grammar, kanji, listening and reading where available.
5. Insert review items.
6. Return feasibility warning if selected duration is too short.
7. Never rewrite completed learning history.
8. Adjust only future daily lessons during adaptation.

AI may provide notes or candidate difficulty, but AI does not create the final schedule.

---

# 9. Learning Content Design

## 9.1 Vocabulary

Screens/API should support:

- list words for a daily lesson;
- view word detail;
- flashcard mode;
- submit practice answer;
- mark known or needs review.

## 9.2 Grammar

Screens/API should support:

- pattern;
- meaning;
- explanation;
- examples;
- source references;
- practice questions;
- mistake explanation.

## 9.3 Kanji

Japanese-only module.

Screens/API should support:

- kanji;
- readings;
- meanings;
- example words;
- source references;
- practice.

## 9.4 Listening

Screens/API should support:

- audio or transcript reference;
- question list;
- answer submission;
- deterministic scoring;
- explanation after submit.

## 9.5 Reading

Screens/API should support:

- passage;
- question list;
- answer submission;
- deterministic scoring;
- explanation after submit.

---

# 10. Assessment and Adaptation Design

## 10.1 PracticeItem

Recommended fields:

```text
id
knowledgeItemId
type
questionJson
answerJson
explanationJson
sourceReferenceId
status
```

Practice items can come from:

- source book exercises;
- AI-extracted exercises with `AI_CANDIDATE` status;
- AI-generated but source-grounded practice items approved by admin.

## 10.2 Attempt

Attempts store user answers.

Recommended fields:

```text
id
userId
practiceItemId
answerJson
score
isCorrect
createdAt
```

## 10.3 Scoring

Objective scoring is deterministic.

AI may be used for:

- explanation;
- mistake summary;
- qualitative analysis;
- suggestions.

## 10.4 KnowledgeGap

Recommended fields:

```text
id
userId
knowledgeItemId
source
severity
reason
status
createdAt
resolvedAt
```

Gap sources:

```text
PRACTICE_WRONG
TEST_WRONG
REVIEW_FAILED
LOW_CONFIDENCE
REPEATED_MISTAKE
```

## 10.5 Adaptive plan revision

Adaptation creates future changes only.

It may:

- add review items;
- reduce new content on heavy days;
- repeat weak knowledge;
- add supporting lower-level content if the user's note says the foundation is weak.

Example:

```text
Target: JLPT N3
Current note: N4 grammar not firm
```

Planner may include some N4 prerequisite grammar when useful.

---

# 11. RAG Design

## 11.1 Retrieval flow

```text
User/admin/system query
-> keyword search
-> vector search
-> merge results
-> rerank when available
-> build context
-> LLM answer or extraction
-> validate source grounding
-> return answer with citations
```

## 11.2 Grounding classes

AI responses should label provenance:

```text
CURRICULUM_GROUNDED
GENERAL_KNOWLEDGE
INSUFFICIENT_EVIDENCE
```

## 11.3 Validation

Structured AI output must be validated before storage.

Validation checks:

- required fields exist;
- type is allowed;
- source reference exists;
- evidence text is not empty for curriculum claims;
- language and level are valid;
- JSON schema matches content type.

---

# 12. API Boundary Summary

## 12.1 Gateway routes

```text
/api/auth/**       -> Auth Service
/api/content/**    -> Content Service
/api/learning/**   -> Learning Service
/api/reviews/**    -> Learning Service
/api/ai/**         -> AI Service
```

## 12.2 Learning to Content

Learning Service calls Content Service to fetch published curriculum.

Examples:

```text
GET /internal/content/knowledge?language=JAPANESE&levelSystem=JLPT&levelCode=N3
GET /internal/content/knowledge/{id}
GET /internal/content/knowledge/{id}/source
```

## 12.3 Content to AI

Content Service calls AI Service for processing.

Examples:

```text
POST /internal/ai/documents/{bookId}/chunk
POST /internal/ai/chunks/{chunkId}/embed
POST /internal/ai/chunks/{chunkId}/extract-candidates
```

## 12.4 Learning to AI

Learning Service calls AI Service for explanation and analysis, not for final scheduling.

Examples:

```text
POST /internal/ai/explain/mistake
POST /internal/ai/analyze/test
POST /internal/ai/rag/answer
```

---

# 13. Database Ownership

## 13.1 Auth DB

```text
users
refresh_tokens
roles
```

## 13.2 Content DB

```text
books
knowledge_items
source_references
processing_jobs
```

## 13.3 AI DB

```text
document_chunks
embedding_records
retrieval_logs
ai_generation_logs
```

## 13.4 Learning DB

```text
learning_profiles
study_plans
daily_lessons
daily_sections
daily_learning_items
practice_items
attempts
test_attempts
knowledge_gaps
review_schedules
review_history
plan_revisions
```

---

# 14. Phased Implementation Map

## Phase 0 - Foundation

- Docker Compose.
- Gateway routes.
- Auth register/login/refresh.
- RS256 and JWKS.
- Gateway validates JWT.
- Gateway injects `X-User-Id` and `X-User-Roles`.
- Java 21 build baseline.

## Phase 1 - Core Learning Skeleton

- Content CRUD for books and knowledge items.
- SourceReference model.
- LearningProfile.
- StudyPlan.
- DailyLesson.
- DailySection.
- DailyLearningItem.
- Progress.
- Simple ReviewSchedule.
- Seed Japanese and English content manually if needed.

## Phase 2 - AI/RAG Content Pipeline

- Upload source books.
- PDFBox text extraction.
- OCR abstraction.
- Chunking.
- Embeddings.
- pgvector.
- Hybrid retrieval.
- AI chunk classification.
- AI-created `KnowledgeItem` extraction.
- AI-created `PracticeItem` extraction.
- Admin review and publish.
- RabbitMQ if DB-backed jobs are no longer enough.

## Phase 3 - Learning Content UX and Practice

- Vocabulary list.
- Flashcards.
- Grammar detail.
- Grammar practice.
- Kanji detail for Japanese.
- Listening practice.
- Reading practice.
- Lesson completion flow.

## Phase 4 - Assessment and Reports

- Quiz generation from approved practice items.
- Periodic tests.
- Deterministic scoring.
- Test report.
- Knowledge gap detection.

## Phase 5 - Adaptive Learning

- Future plan adjustment.
- Review insertion from gaps.
- Weakness-aware content selection.
- Immutable history.
- FSRS review scheduling.

## Phase 6 - AI Tutor and Advanced RAG

- Grounded AI explanations.
- Source citations.
- Mistake explanations.
- Retrieval evaluation.
- Hallucination checks.

## Phase 7 - Production Engineering

- RabbitMQ if not already used.
- Redis if justified.
- Prometheus.
- Grafana.
- OpenTelemetry.
- Resilience4j.
- Backup and deployment hardening.

---

# 15. Current Implementation Alignment

Already aligned:

- Auth Service exists.
- Gateway exists.
- RS256/JWKS design has been introduced.
- Gateway identity header injection has been introduced.
- Content Service has `Book`, `KnowledgeItem`, `SourceReference`.
- Learning Service has early `ReviewSchedule`.

Needs next implementation:

- add language and level fields to `Book` and `KnowledgeItem`;
- add learning profile and study plan;
- add daily lesson and daily section;
- add practice item model;
- add `origin` and `confidence` fields for AI-reviewed content;
- add document processing pipeline.


