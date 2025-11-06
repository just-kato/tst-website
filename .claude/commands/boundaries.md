# boundaries.md

## Purpose
This document defines **hard boundaries** for AI assistants reviewing or working with this codebase. It ensures reviews are accurate, safe, and aligned with project standards.

---

## Discovery Scope
When reviewing, the assistant should **read and map** the following:

- **Codebase**
  - Next.js routes, components, hooks, GraphQL resolvers, API endpoints.
  - Utility modules, validation logic, and template systems.

- **Database**
  - Inspect schema definitions, migrations, and SQL queries.
  - Identify all tables, columns, defaults, indexes, foreign keys, and views.
  - Flag mismatches between schema and code (e.g., referencing a non-existent column).

- **Environment Variables**
  - Parse `.env.example` (or equivalent).
  - Cross-check that variables used in code exist in env files.
  - Identify unused or shadowed variables.

---

## Hard Boundaries
- **No file adds/renames/deletes** unless explicitly approved.
- **No schema changes** (tables, columns, FKs, migrations) without explicit greenlight.
- **No live network calls** (email, SMS, external APIs) during review.
- **No exposure of secrets** (redact PII/PHI and API keys).
- **No UI/UX redesigns** unless requested.

---

## Review Deliverables
Each review should produce a **single markdown report** including:

1. **App Summary (≤200 words)** – main purpose and flows.
2. **Runtime Map** – list of key modules (path + 1-line purpose).
3. **DB Audit** – list of tables + columns, with mismatches flagged.
4. **Env Audit** – list of env vars used vs declared; flag unused or missing.
5. **Flow Sketches** – 2–3 critical paths traced (e.g., Booking → GraphQL → DB → Email/SMS).
6. **Used vs. Unused Code** – active imports vs. likely dead code.
7. **Issues & Risks** – ranked High/Med/Low, with file + line refs.
8. **Minimal Fix Suggestions** – inline diffs only, no new files.
9. **Open Questions** – 1–3 clarifications needed from the dev team.

---

## Safe Actions Allowed
- Static code and schema analysis.
- Suggesting **inline patches** to existing files only.
- Drafting documentation/tests inside existing files.
- Proposing migration SQL with clear rollback notes (do not apply).

---

## Must Not Do
- Create new features, files, or directories.
- Apply schema migrations or cascade drops.
- Redesign flows or UI unasked.
- Run live jobs or integrations.  
