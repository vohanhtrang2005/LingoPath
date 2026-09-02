# Software Requirements Specification

## GAKUDO - AI-assisted Language Learning Platform

| Item | Value |
|---|---|
| Version | 2.0 |
| Status | Draft |
| Scope | Japanese and English first |
| Architecture | Microservices |
| Backend | Java 21, Spring Boot |
| Frontend | React, TypeScript, Vite |
| Database | PostgreSQL |
| Vector storage | PostgreSQL + pgvector |
| AI | LLM + embeddings + RAG |
| Deployment | Docker / Docker Compose |

---

# 1. Executive Summary

GAKUDO is a source-grounded learning platform. Admins upload learning books or documents. The system extracts, chunks, embeds and analyzes those documents, then produces structured learning content for students.

The product is not just a RAG chatbot. RAG and AI are tools used to convert documents into reliable learning content. The core product is the learning loop:

```text
Admin uploads books
-> system extracts and analyzes content
-> admin reviews and publishes knowledge
-> student chooses target language, level and duration
-> system creates a study plan
-> student studies daily lessons
-> student practices and takes tests
-> system scores, reports gaps and updates future plan
```

The first supported languages are:

- Japanese
- English

The architecture must allow more languages later, such as Chinese, without rewriting the core model.

---

# 2. Product Principles

## 2.1 Source of truth

The source of truth for curriculum content is the approved source material uploaded by admin.

AI may help extract, explain, classify and generate candidates, but AI must not become the unchecked source of truth.

## 2.2 Learning-first design

The main user experience is learning, not chatting with AI.

The system must support:

- daily lessons;
- vocabulary learning;
- flashcards;
- grammar explanations;
- grammar practice;
- listening practice;
- reading practice;
- quizzes and tests;
- scoring;
- report and knowledge gap detection;
- plan adjustment.

## 2.3 Source traceability

Every official curriculum knowledge item should be traceable back to source evidence whenever possible.

The system should be able to answer:

```text
This knowledge came from which book, page, section or chunk?
```

## 2.4 AI is advisory

AI may produce:

- `KnowledgeItem` with candidate status;
- `PracticeItem` with candidate status;
- explanations;
- examples;
- tags;
- difficulty suggestions;
- frequency/evidence summaries.

But official learning content should be created only after validation and/or admin approval.

## 2.5 Source order matters

For books and courses, knowledge order should primarily follow the order in the source material.

A well-written book has a pedagogical sequence. The system should treat that sequence as the curriculum backbone instead of randomly selecting daily content from vector search results.

AI may help classify and normalize content, but AI should not freely reorder a curriculum unless the Learning Service has deterministic rules for doing so.

## 2.6 Personalization does not mean breaking the book

Personalization should adapt how the student experiences the curriculum, not destroy the source order.

The system may personalize:

- daily workload;
- skill emphasis;
- review frequency;
- practice difficulty;
- explanation style;
- inline support notes for prerequisite concepts found inside the current target-level material;
- reading/listening selections related to current knowledge;
- future plan adjustments based on performance.

The default backbone remains source order plus deterministic planning.

When a student chooses a target level, the official curriculum plan should focus on that target level. For example, if the student chooses Japanese N3, the study plan should use N3 published content as the main curriculum. Lower-level concepts that appear inside N3 reading/listening/grammar examples should be explained inline as support, not inserted as separate N4/N5 curriculum lessons by default.

## 2.7 RAG supports learning, not scheduling authority

RAG should not be the primary mechanism that decides what the student learns each day.

RAG is used to:

- find source evidence;
- retrieve examples;
- retrieve related exercises;
- retrieve reading/listening passages related to today's knowledge;
- support grounded AI explanations;
- classify mixed-content chunks;
- detect repeated knowledge across sources.

The Learning Service remains responsible for final scheduling.

---

# 3. Scope

## 3.1 In scope

The system shall support:

1. User registration and login.
2. JWT authentication using RS256 and JWKS.
3. API Gateway validation and downstream identity header injection.
4. Admin document/book management.
5. Japanese and English learning content.
6. Document upload.
7. PDF text extraction.
8. OCR for scanned documents.
9. Chunking by page, section and topic.
10. Embedding each chunk.
11. Hybrid retrieval using vector and keyword search.
12. AI-assisted extraction of structured content from chunks.
13. Admin review of AI-created `KnowledgeItem` and `PracticeItem` records before publication.
14. Published `KnowledgeItem` records.
15. Source references for published knowledge.
16. Study profile and onboarding.
17. Study plan creation by target language, level and duration.
18. Daily lessons containing multiple sections.
19. Vocabulary list and flashcards.
20. Grammar explanation and practice.
21. Kanji for Japanese.
22. Listening practice.
23. Reading practice.
24. Quiz and test flow.
25. Deterministic scoring.
26. Knowledge gap detection.
27. Review scheduling.
28. Future plan adjustment.
29. Basic observability.

## 3.2 Out of scope for early versions

The following are not required in the first implementation:

- native mobile application;
- payment;
- marketplace;
- real-time classroom;
- social network;
- teacher-student classroom management;
- advanced multi-agent automation;
- production-scale Kubernetes deployment.

Japanese is not limited to N3. The system should support JLPT N5 to N1 as content becomes available.

---

# 4. Supported Learning Domains

## 4.1 Japanese

Japanese learning shall support JLPT levels:

- N5
- N4
- N3
- N2
- N1

Japanese content types:

- vocabulary;
- grammar;
- kanji;
- reading;
- listening;
- exercises;
- tests.

## 4.2 English

English learning shall support level systems such as CEFR:

- A1
- A2
- B1
- B2
- C1
- C2

English content types:

- vocabulary;
- grammar;
- reading;
- listening;
- exercises;
- tests.

Speaking and writing can be added later.

---

# 5. Users

## 5.1 Student

A student can:

- register and login;
- choose language;
- choose target level;
- describe current level and weaknesses;
- choose target duration;
- follow a generated learning path;
- study daily lessons;
- practice vocabulary and grammar;
- do listening and reading exercises;
- take review tests;
- view scores and reports;
- receive an adjusted future plan.

## 5.2 Admin

An admin can:

- upload source books or documents;
- assign metadata such as language, level and document type;
- start or retry processing jobs;
- inspect chunks and extraction results;
- review AI-generated items;
- approve or reject items;
- publish learning content;
- inspect source references.

---

# 6. Core Concepts

## 6.1 Book

A `Book` is an uploaded learning source.

It may be:

- a vocabulary-only book;
- a grammar-only book;
- a listening book;
- a reading book;
- a mixed book containing many content types.

The system must not assume that one book contains only one type of knowledge.

## 6.2 DocumentChunk

A `DocumentChunk` is a small part of a document extracted from pages or sections.

Chunks are used for:

- embedding;
- retrieval;
- AI extraction;
- source evidence;
- citation.

## 6.3 AI-created item status

The system should not use separate `KnowledgeCandidate` and `PracticeCandidate` tables in the early design.

Instead, AI extraction creates normal `KnowledgeItem` or `PracticeItem` records with candidate-like status.

Examples:

```text
KnowledgeItem.status = AI_CANDIDATE
PracticeItem.status = AI_CANDIDATE
```

Admin review changes the same record to:

```text
PUBLISHED
REJECTED
RETIRED
```

This avoids duplicating candidate tables, candidate services and copy logic.

## 6.4 KnowledgeItem

A `KnowledgeItem` is approved learning knowledge.

`KnowledgeItem` is not a lesson. It is the smallest useful learning unit that can be studied, reviewed, tested and reported as a knowledge gap.

Examples:

- one vocabulary word;
- one grammar pattern;
- one kanji;
- one reading passage;
- one listening item.

The system still keeps the book sequence through source metadata such as `bookId`, `sectionTitle`, `sectionOrder`, `pageStart`, `pageEnd`, `chunkId` and `orderIndex`.

This means the system can preserve the book's learning flow while still tracking each knowledge item precisely.

## 6.5 SourceReference

A `SourceReference` links a `KnowledgeItem` to source evidence:

- book;
- page range;
- section title;
- chunk id;
- evidence text.

## 6.6 StudyPlan

A `StudyPlan` is the student's generated route for a selected target.

Example:

```text
Language: Japanese
Target: JLPT N3
Duration: 3 months
Current note: N4 grammar not firm
```

The planner must create a feasible plan from published content.

## 6.7 DailyLesson

A `DailyLesson` is one day of learning inside a study plan.

A daily lesson may contain:

- vocabulary section;
- grammar section;
- kanji section;
- listening section;
- reading section;
- review section;
- test section.

The web lesson is not the same as the book's lesson. A book lesson is source structure. A web daily lesson is a learning unit created for the user's plan.

---

# 7. Main User Journey

```text
Student registers
-> student logs in
-> student chooses Japanese or English
-> student chooses target level
-> student enters target duration
-> student optionally describes current weaknesses
-> system creates study plan
-> student opens today's lesson
-> student studies vocabulary, grammar, listening, reading
-> student practices
-> system records progress
-> student takes periodic test
-> system scores deterministically
-> system detects weak knowledge
-> system updates future lessons and review schedule
```

---

# 8. Functional Requirements

## 8.1 Authentication and Gateway

### FR-AUTH-001 Register

The system shall allow users to create accounts.

Acceptance criteria:

- email or username uniqueness is enforced;
- passwords are hashed;
- the default role is `STUDENT`.

### FR-AUTH-002 Login

The system shall authenticate users and issue access and refresh tokens.

Acceptance criteria:

- valid credentials return an access token and refresh token;
- invalid credentials return an authentication error;
- login does not reveal whether email or password was wrong.

### FR-AUTH-003 RS256 JWT

The Auth Service shall sign access tokens with RS256.

Acceptance criteria:

- private key stays inside Auth Service;
- public key is exposed through JWKS;
- Gateway can validate tokens using JWKS.

### FR-AUTH-004 Gateway identity headers

The API Gateway shall validate JWTs and inject identity headers into downstream requests.

Acceptance criteria:

- Gateway injects `X-User-Id`;
- Gateway injects `X-User-Roles`;
- downstream services can use these headers without parsing JWT;
- client-supplied identity headers are not trusted.

## 8.2 Admin source management

### FR-SRC-001 Upload source document

Admin shall be able to upload a book or document.

Acceptance criteria:

- admin can specify language;
- admin can specify level system and level code;
- admin can upload mixed-content books;
- upload creates a processing job.

### FR-SRC-002 Processing status

Admin shall be able to inspect document processing status.

Acceptance criteria:

- statuses include `UPLOADED`, `PROCESSING`, `CHUNKED`, `EMBEDDED`, `CANDIDATES_READY`, `FAILED`;
- failure reason is visible;
- failed jobs can be retried.

## 8.3 Document pipeline

### FR-DOC-001 Text extraction

The system shall extract text from text-based PDFs.

### FR-DOC-002 OCR

The system shall run OCR for scanned PDFs.

### FR-DOC-003 Chunking

The system shall split document content into small chunks.

Acceptance criteria:

- chunks preserve page metadata;
- chunks preserve section metadata when detectable;
- chunks are small enough for AI analysis;
- chunks can be embedded.

### FR-DOC-004 Chunk classification

The system shall classify chunks by content type.

Possible chunk types:

- `VOCABULARY`;
- `GRAMMAR`;
- `KANJI`;
- `READING`;
- `LISTENING`;
- `EXERCISE`;
- `MIXED`;
- `UNKNOWN`.

## 8.4 AI extraction and RAG

### FR-AI-001 Source-grounded extraction

AI shall extract structured `KnowledgeItem` and `PracticeItem` records from document chunks with candidate status.

Acceptance criteria:

- output follows a strict schema;
- each AI-created item points to source evidence;
- unsupported items are rejected or flagged.

### FR-AI-002 Mixed book support

AI shall support books that contain multiple content types in the same chapter, page or section.

Acceptance criteria:

- one chunk may produce multiple item types;
- mixed chunks are split or classified as `MIXED`;
- AI-created items keep their source references.

### FR-AI-003 Content enrichment

AI may enrich content with explanations, readings, meanings, examples and notes.

Acceptance criteria:

- enriched content is stored separately from raw source text;
- generated explanations are marked as AI-generated;
- source-backed claims include source references.

### FR-AI-004 Frequency and evidence analysis

The system should calculate or estimate whether a knowledge item appears frequently across uploaded sources.

Acceptance criteria:

- repeated appearances can be grouped;
- frequency can influence notes or priority;
- frequency does not replace admin approval.

### FR-RAG-001 Retrieval

The system shall retrieve relevant chunks using vector search and keyword search.

### FR-RAG-002 Grounded answers

AI answers about curriculum content shall use retrieved source chunks.

Acceptance criteria:

- source citations are returned when possible;
- unsupported answers are marked as insufficient evidence;
- AI must distinguish curriculum-grounded answers from general answers.

## 8.5 Knowledge management

### FR-KNOW-001 Knowledge item model

The system shall store approved knowledge as `KnowledgeItem`.

The system shall split source content into knowledge-level units even when the source book is organized as chapters, lessons or mixed sections.

This split is required so the platform can:

- review individual vocabulary or grammar;
- generate flashcards;
- map wrong answers to specific knowledge;
- detect knowledge gaps;
- schedule spaced repetition;
- retrieve exact source evidence;
- personalize practice without losing the original source order.

Required fields:

- language;
- level system;
- level code;
- type;
- status;
- origin;
- confidence;
- content JSON;
- order index;
- difficulty;
- source references.

### FR-KNOW-002 Knowledge types

Supported initial types:

- `VOCABULARY`;
- `GRAMMAR`;
- `KANJI`;
- `READING`;
- `LISTENING`;
- `EXERCISE`.

### FR-KNOW-003 Publication workflow

Knowledge shall follow a controlled lifecycle.

Possible states:

- `AI_CANDIDATE`;
- `NEEDS_REVIEW`;
- `APPROVED`;
- `PUBLISHED`;
- `REJECTED`;
- `RETIRED`.

Only `PUBLISHED` content can be used for student learning plans.

## 8.6 Study planning

### FR-PLAN-000 Curriculum backbone

The planner shall use source order as the default backbone when a source book has a meaningful learning sequence.

Acceptance criteria:

- `orderIndex`, source order and source references influence default lesson order;
- vector search does not randomly replace source order;
- AI suggestions are advisory inputs only;
- the planner may adjust emphasis, workload and review placement without destroying the book sequence.

### FR-PLAN-001 Learning profile

The student shall provide a learning profile.

Fields:

- target language;
- target level;
- duration months;
- current level note;
- weakness note;
- optional exam date.

`startDate` means the day the plan starts. By default, it is the day the plan is created.

### FR-PLAN-002 Duration-based completion

The system shall use `durationMonths` to distribute the required published content across the available learning days.

The planner must calculate daily item allocation dynamically from available published content and selected duration. The system must not rely on fixed hard-coded daily quotas as the final planning rule.

Default cycle:

```text
6 learning days + 1 review day
```

Recommended baseline formula:

```text
totalDays = days between startDate and endDate + 1
reviewDays = floor(totalDays / 7)
learningDays = totalDays - reviewDays
perTypeDailyQuota = ceil(totalPublishedItemsByType / learningDays)
```

Example:

```text
Target: Japanese JLPT N3
Duration: 3 months
Total days: 90
Review days: 12
Learning days: 78
Published vocabulary items: 780
Vocabulary per learning day: ceil(780 / 78) = 10
```

Acceptance criteria:

- the plan tries to complete the selected target content within the selected duration;
- item quotas are calculated from actual published content counts;
- source order remains the default ordering inside each content type;
- review days are reserved and should not receive new core content by default;
- if the duration is too short for available content, the system returns a feasibility warning;
- the system does not silently hide required content.

### FR-PLAN-003 Daily lesson composition

Each daily lesson should include a balanced mix where content exists:

- vocabulary;
- grammar;
- kanji for Japanese;
- listening;
- reading;
- review;
- practice.

### FR-PLAN-004 Deterministic planner

The Learning Service shall own plan generation.

Acceptance criteria:

- AI does not directly create the final schedule;
- planning uses deterministic rules;
- historical completed learning records are not rewritten;
- only future plan items may be adjusted.

### FR-PLAN-005 Personalization dimensions

The system shall personalize learning without requiring each student to follow a completely different curriculum.

Personalization dimensions include:

- target language and level;
- selected duration;
- current level note;
- weakness note;
- daily workload;
- skill balance;
- review schedule;
- practice difficulty;
- mistake history;
- test performance;
- prerequisite support.

Acceptance criteria:

- two students with the same target may receive different review and practice allocations;
- weak skills receive more practice and review;
- completed history is preserved;
- future plans can be revised with recorded reasons.

### FR-PLAN-006 Inline prerequisite support

When a student studies a target level, the official study plan shall focus on that selected target level.

Example:

```text
Target: Japanese JLPT N3
Official curriculum: published N3 content
```

If lower-level concepts appear inside N3 material, especially in reading and listening, the system shall explain them inline after practice or test submission instead of inserting separate lower-level curriculum lessons by default.

Acceptance criteria:

- N3 plans do not require N4/N5 books to be imported;
- lower-level vocabulary or grammar found in N3 reading/listening can be explained in answer review;
- such explanations are labeled as support explanations;
- the system does not create fake source references for lower-level curriculum that has not been imported;
- lower-level support does not distract from the selected target level.

## 8.7 Learning experience

### FR-LEARN-001 Vocabulary list

The system shall display vocabulary items in a lesson.

### FR-LEARN-002 Flashcards

The system shall support flashcards for vocabulary and other suitable knowledge types.

### FR-LEARN-003 Grammar learning

The system shall display grammar patterns with:

- pattern;
- meaning;
- explanation;
- examples;
- usage notes;
- source reference.

### FR-LEARN-004 Listening practice

The system shall support listening materials and answer submission.

### FR-LEARN-005 Reading practice

The system shall support reading passages and answer submission.

### FR-LEARN-006 Practice items

Vocabulary and grammar lessons should include practice questions when source-backed or approved `PracticeItem` records exist.


### FR-LEARN-007 Passive learning signals

The system shall collect lightweight learning signals without requiring the student to manually rate every item.

Examples of passive signals:

- item viewed;
- flashcard opened;
- explanation opened;
- audio played;
- source reference viewed;
- time spent on an item.

Acceptance criteria:

- passive signals are collected during normal learning flow;
- passive signals can update `LearningProgress`;
- passive signals do not interrupt the student's learning experience.

### FR-LEARN-008 Performance signals

The system shall use practice, quiz and test results as the main signal for mastery and review scheduling.

Examples of performance signals:

- answer correct or wrong;
- related `KnowledgeItem` for each question;
- number of wrong attempts;
- response time;
- corrected after explanation.

Acceptance criteria:

- wrong answers can be mapped to related knowledge items;
- repeated mistakes lower mastery score;
- correct streaks increase mastery score;
- review schedules can be updated automatically from performance signals.

### FR-LEARN-009 No mandatory manual item rating

The system shall not require students to rate every learned item manually.

Acceptance criteria:

- normal daily learning flow does not require `AGAIN`, `HARD`, `GOOD` or `EASY` per item;
- normal daily learning flow does not require batch feedback such as `easy`, `normal` or `hard` for the whole lesson;
- optional manual actions may exist later, but they must not be required to complete a lesson.

### FR-LEARN-010 LearningProgress

The system shall maintain progress per user and knowledge item.

Recommended fields:

```text
userId
knowledgeItemId
status
exposureCount
practiceAttemptCount
correctCount
wrongCount
lastSeenAt
lastCorrectAt
lastWrongAt
masteryScore
```

Acceptance criteria:

- progress is updated from passive signals and performance signals;
- progress supports review scheduling;
- progress supports knowledge gap detection;
- progress is not based only on user self-rating.
## 8.8 Assessment and adaptation

### FR-ASSESS-001 Tests

The system shall provide periodic tests.

### FR-ASSESS-002 Deterministic scoring

The system shall score objective questions deterministically.

AI may explain mistakes, but AI should not be the only scoring mechanism for objective questions.

### FR-GAP-001 Knowledge gap detection

The system shall map wrong answers and weak performance back to related knowledge items.

### FR-ADAPT-001 Adaptive overlay

The system shall use knowledge gaps to add review and practice overlays without removing required target-level curriculum.

Acceptance criteria:

- core target-level curriculum is not silently reduced because of mistakes;
- knowledge gaps add extra review or practice items;
- completed history is immutable;
- each adjustment stores a reason;
- if review load becomes too high, the system reports overload instead of hiding required content.

### FR-REVIEW-001 Automatic review schedule

The system shall schedule reviews for studied knowledge items automatically from passive and performance signals.

Acceptance criteria:

- review scheduling does not require manual rating for every item;
- wrong answers make the next review sooner;
- repeated correct answers can move the next review later;
- early versions may use simple intervals;
- later versions should support FSRS.

---

# 9. Non-functional Requirements

## 9.1 Security

- Passwords must be hashed.
- Access tokens must use RS256.
- JWKS must expose public keys only.
- Gateway must validate protected requests.
- Internal services should not be directly exposed outside Docker network.
- Admin-only actions require admin role.

## 9.2 Reliability

- Long document processing must be asynchronous.
- Failed processing jobs must retain failure reason.
- Reprocessing must not silently destroy existing published content.

## 9.3 Data integrity

- Published knowledge should have source references.
- Document versions should not be mixed accidentally.
- Learning history should be append-only where it affects reports.

## 9.4 Observability

The system should support:

- health endpoints;
- structured logs;
- correlation IDs;
- metrics;
- Prometheus and Grafana in later phases;
- OpenTelemetry tracing in later phases.

---

# 10. Recommended Phases

## Phase 0 - Foundation

Main goal: make the microservice base stable.

Deliverables:

- Docker Compose;
- API Gateway;
- Auth Service;
- RS256 JWT;
- JWKS;
- Gateway identity header injection;
- PostgreSQL setup;
- basic service health endpoints.

## Phase 1 - Core Learning Skeleton

Main goal: make the learning product visible even with seed data.

Deliverables:

- content model for books and knowledge items;
- basic admin CRUD for seed content;
- student learning profile;
- study plan;
- daily lesson;
- daily sections;
- progress tracking;
- simple review schedule.

## Phase 2 - AI/RAG Content Pipeline

Main goal: convert admin-uploaded documents into AI-created items waiting for review.

Deliverables:

- document upload;
- PDF extraction;
- OCR;
- chunking;
- embeddings;
- pgvector;
- hybrid search;
- chunk classification;
- AI-created `KnowledgeItem` extraction;
- AI-created `PracticeItem` extraction;
- source references;
- admin review and publish.

RabbitMQ can be introduced in this phase if document jobs become too heavy for a simple DB-backed worker.

## Phase 3 - Learning Content UX and Practice

Main goal: make each lesson actually teach.

Deliverables:

- vocabulary list;
- flashcards;
- grammar pages;
- grammar exercises;
- kanji pages for Japanese;
- listening practice;
- reading practice;
- lesson completion flow.

## Phase 4 - Assessment and Reports

Main goal: measure learning quality.

Deliverables:

- quizzes;
- periodic tests;
- deterministic scoring;
- answer review;
- performance report;
- knowledge gap detection.

## Phase 5 - Adaptive Learning

Main goal: update the future plan from real performance.

Deliverables:

- gap-based review insertion;
- future lesson rebalancing;
- reason codes for plan changes;
- immutable learning history;
- FSRS review scheduling.

## Phase 6 - AI Tutor and Advanced RAG

Main goal: let AI explain with source grounding.

Deliverables:

- grounded AI explanations;
- source citations;
- reading/listening assistance;
- mistake explanations;
- retrieval evaluation;
- hallucination checks.

## Phase 7 - Production Engineering

Main goal: operate the platform reliably.

Deliverables:

- RabbitMQ if not already added;
- Prometheus;
- Grafana;
- OpenTelemetry;
- resilience patterns;
- rate limiting;
- backups;
- deployment hardening.

---

# 11. Key Business Rules

1. Admin-uploaded and approved sources are the curriculum source of truth.
2. AI extraction creates `KnowledgeItem` or `PracticeItem` records with candidate status, not automatically trusted official content.
3. Published knowledge should have source evidence.
4. A book may contain mixed learning content.
5. Japanese and English are first-class supported languages.
6. JLPT support must allow N5 to N1.
7. The web daily lesson is different from the source book lesson.
8. `KnowledgeItem` is not a lesson; it is the smallest useful unit for study, review, testing and gap detection.
9. Learning Service owns scheduling and adaptation.
10. AI/RAG supports extraction, explanation, retrieval and analysis.
11. Objective scoring is deterministic.
12. Learning history should not be rewritten by future plan changes.
13. Review scheduling starts simple and can evolve to FSRS.
14. Source order is the default curriculum backbone when a book has a clear sequence.
15. RAG retrieves evidence, examples and related practice; it does not own the final schedule.
16. Personalization happens through pace, focus, review, practice, explanation and future plan revision.
17. When a student chooses a target level, the official curriculum focuses on that target level. Lower-level concepts found inside target-level material are explained inline as support, not inserted as separate lower-level lessons by default. Inline AI support is not a `DailyLearningItem` unless a dedicated support entity is introduced later.
18. Adaptive learning must not remove required target-level curriculum. Knowledge gaps add review/practice overlays.
19. The system must not require manual `AGAIN`, `HARD`, `GOOD` or `EASY` rating for every learned item.
20. Review scheduling should be driven mainly by passive learning signals and performance signals.
21. Batch feedback for an entire lesson is not a reliable mastery signal and is not part of the required flow.








