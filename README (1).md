# LifeOS

**One Platform to Organize Your Entire Digital Life**

## Project Name & Overview

LifeOS is an AI-powered Personal Operating System (POS) — a single mobile application that replaces the calendar, notes, task manager, expense tracker, habit tracker, password manager, document vault, and AI assistant apps most people juggle every day. Instead of switching between eight different tools, users open one app that understands their whole life and helps them run it.

## Problem It Solves

The average person's productivity and personal data are scattered across a dozen disconnected apps — a to-do app that doesn't know about the calendar, a habit tracker that doesn't know about the gym log, an expense app that doesn't talk to the budget goals. Nothing shares context, so users manually re-enter the same information everywhere and get no real insight into how their habits, time, money, and goals actually connect. LifeOS solves this by putting every module on one data model, behind one account, with one AI that can see across all of it.

## Target Users (Personas)

- **Students** — juggling assignments, exams, study schedules, and part-time budgets.
- **Professionals** — managing tasks, meetings, and finances alongside personal goals.
- **Developers** — tracking coding hours, LeetCode streaks, and project tasks.
- **Entrepreneurs** — running expenses, goals, and schedules without a full software stack.
- **Gym enthusiasts** — logging workouts, streaks, and body metrics daily.
- **Anyone who wants their digital life organized in one place**, without stitching together five apps.

## Vision Statement

To become the single application people open every day to run their entire life — the way an operating system runs a computer — by connecting productivity, health, learning, and finance into one intelligent, always-in-sync platform.

## Key Features / Goals

- **Unified Dashboard** — tasks, calendar, habits, goals, expenses, and AI suggestions in one command center.
- **Task & Project Management** — subtasks, priorities, Kanban, dependencies, and time tracking.
- **Smart Notes & Journal** — rich text, OCR, voice notes, AI summaries, and mood tracking.
- **Goal & Habit Tracking** — streaks, milestones, heatmaps, and AI-generated recommendations.
- **Universal Counter System** — track literally anything (pushups, books, coding hours) with charts and history.
- **Expense Manager** — budgets, receipt OCR, forecasting, and net worth tracking.
- **Document & Password Vaults** — encrypted storage with biometric access.
- **Cross-Module AI Assistant** — a single AI that can answer questions across every module ("How productive was I today?").
- **Automation Engine** — event-driven rules connecting modules automatically (e.g., a completed workout updates the gym counter, marks the habit, and updates the goal).

## Success Metrics

- Daily Active Usage: user opens LifeOS at least once per day within the first month.
- Module Adoption: average user actively uses 4+ modules (not just tasks).
- Retention: 30-day retention rate above industry baseline for productivity apps (~25%).
- Automation Engagement: percentage of users who create at least one automation rule.
- AI Assistant Usage: number of AI queries per active user per week.
- Data Continuity: near-zero data loss/sync failure rate across devices.

## Assumptions & Constraints

**Assumptions**
- Users are willing to consolidate multiple apps into one, given a good enough experience.
- Initial user base has stable internet access; offline-first sync is a Phase 2 feature.
- AI features rely on third-party LLM APIs (OpenAI-compatible) in early versions.

**Constraints**
- Solo/small-team development — must be built incrementally (Phase 1 → Phase 6), not all at once.
- Android-first via React Native + Expo; iOS, web, and desktop are future platforms.
- Backend: Spring Boot (Java), PostgreSQL, Redis, AWS S3 for object storage.
- Security requirements (JWT, AES encryption, biometric auth) apply from Version 1 for sensitive modules (Password Vault, Document Vault).
- Timeline: MVP (Version 1) scoped to authentication, dashboard, tasks, notes, habits, counters, goals, and cloud sync only — all other modules are post-MVP.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile Frontend | React Native + Expo |
| Backend | Spring Boot (Java) |
| Database | PostgreSQL |
| Cache | Redis |
| Object Storage | AWS S3 |
| Auth | JWT, Refresh Tokens, Google OAuth, Biometric unlock |
| DevOps | Docker, Docker Compose, GitHub Actions, Nginx |

## Branching Strategy

This repository follows **GitHub Flow**:
- `main` is always deployable.
- New work happens on feature branches named `feature/<short-description>` (e.g. `feature/task-crud-api`).
- Open a Pull Request into `main` when a feature is ready; use PR review before merging.
- Delete feature branches after merge to keep the repo clean.

## Quick Start – Local Development

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd lifeos

# 2. Build and start all services
docker compose up --build

# 3. Open the app
# Backend API:   http://localhost:8080
# (Frontend/web preview, if applicable): http://localhost:3000
```

### Local Development Tools

- **Docker Desktop** — runs the backend, database, and cache as containers.
- **Docker Compose** — orchestrates multi-container local environment (`docker-compose.yml`).
- **Git** — version control, GitHub Flow branching.
- **VS Code / IntelliJ** — primary editors for backend (Java) and frontend (React Native).
- ## Software Design

- Architecture diagram (editable): `docs/design/LifeOS-architecture.drawio`
- Architecture diagram (image): `docs/design/architecture.png`
- UI wireframes: `docs/design/wireframes/`
- Full design document: `docs/design/LifeOS-Software-Design-Document.pdf`

LifeOS uses a layered client–server architecture (React Native + Expo Router client,
Spring Boot REST API, PostgreSQL) chosen for clear separation of concerns and to match
a solo-developer, phased build timeline. Each feature module (Tasks, Habits, Notes,
Counters) follows an identical load/save abstraction and shares one design-token file,
keeping the codebase modular, cohesive, and loosely coupled as new modules are added.
