# Step 0: Autonomous Discovery & Freeze

> **Goal:** Claude independently inspects the codebase to **understand purpose, functionality, and design principles**, then **freezes mission-critical surfaces** before any cleanup. No product briefs required.

---

## 0.1 Outputs Claude must produce (and commit)

- `reports/PROJECT_SNAPSHOT.md` – narrative overview Claude writes after reading the code.
- `reports/FEATURE_MAP.md` – pages ↔ components ↔ hooks ↔ services ↔ external APIs.
- `reports/DEPENDENCY_GRAPH.json` – import graph (nodes = files, edges = imports).
- `reports/RUNTIME_TOUCHPOINTS.md` – env vars, secrets, webhooks, external services usage.
- `freezefile.json` – **locked, do-not-break** manifest (see schema below).
- `tests/smoke/*.spec.ts` – auto-generated smoke tests for frozen flows (Playwright).

**Rule:** No deletions or refactors until these artifacts exist and are approved in PR #0.

---

## 0.2 How Claude determines “importance” (evidence-driven)

Claude will rank files/features as **Critical / Important / Peripheral** using multiple signals:

1. **Structural signals**
   - Files under `/app/book`, `/api/booking`, `/dashboard`, `/blog`.
   - API handlers called by those routes.
   - Server actions / RPCs / Supabase queries tied to appointments, CRM, messaging, newsletters.

2. **Call-graph centrality**
   - Higher in-degree (many modules depend on it).
   - Bridge nodes (betweenness) in the dependency graph.

3. **Runtime touchpoints**
   - Uses **Twilio**, **Resend**, or **Supabase** clients.
   - Reads critical env vars (e.g., `TWILIO_*`, `RESEND_*`, `SUPABASE_*`).
   - Handles webhooks or sends outbound network calls.

4. **Route exposure**
   - Public routes that gate key user actions (`/book/*`, reschedule/cancel endpoints).
   - Admin routes for dashboard/newsletter/CRM.

5. **Data gravity**
   - Modules that write to `appointments`, `leads/contacts`, `messages`, `newsletters`, `blog_posts`.

6. **Heuristic safety**
   - Code with dynamic imports/registries, reflection, or string-keyed dispatch (harder to prove unused).

**Inference rule:** Any file/function that sits on the path of *“book/reschedule/cancel appointment”, “CRM qualification”, “newsletter → blog publish”* becomes **Critical** by default.

---

## 0.3 Commands Claude should run (edit to your package manager)

```bash
# 1) Type + lint baseline
pnpm tsc --noEmit || npm run tsc --noEmit
pnpm eslint . --max-warnings=0 || npm run lint

# 2) Static usage discovery
pnpm dlx ts-prune --ignore "tests|__mocks__" > reports/ts-prune.txt
pnpm dlx depcheck --json > reports/depcheck.json

# 3) Dependency graph (Node/TS projects)
pnpm dlx madge --ts-config tsconfig.json --extensions ts,tsx --json . > reports/madge.json

# 4) Grep for runtime touchpoints
git grep -nE "TWILIO_|RESEND_|SUPABASE_|createClient|Resend\\(|Twilio\\(|createServerComponentClient" > reports/runtime_touchpoints.txt

# 5) Next.js route inventory
git ls-files "app/**/page.tsx" "app/**/route.ts" > reports/next_routes.txt
```

---

## 0.4 freezefile.json (Claude must create)

```json
{
  "$schema": "https://example.com/tst/freezefile.schema.json",
  "generated_at": "<ISO8601>",
  "critical_flows": [
    {
      "name": "Book consultation",
      "paths": ["/book/trauma", "/book/nd"],
      "apis": ["/api/booking/create", "/api/booking/availability"],
      "data": ["appointments", "contacts"],
      "notifications": ["email:Resend", "sms:Twilio"],
      "tests": ["tests/smoke/book.spec.ts"]
    },
    {
      "name": "Reschedule appointment",
      "paths": ["<discover link route or tokenized URL>"],
      "apis": ["/api/booking/reschedule"],
      "data": ["appointments"],
      "notifications": ["email:Resend", "sms:Twilio"],
      "tests": ["tests/smoke/reschedule.spec.ts"]
    },
    {
      "name": "Cancel appointment",
      "paths": ["<discover cancel route>"],
      "apis": ["/api/booking/cancel"],
      "data": ["appointments"],
      "notifications": ["email:Resend", "sms:Twilio"],
      "tests": ["tests/smoke/cancel.spec.ts"]
    },
    {
      "name": "CRM qualification",
      "paths": ["/dashboard/crm"],
      "apis": ["/api/crm/*"],
      "data": ["contacts", "pipeline", "messages"],
      "tests": ["tests/smoke/crm.spec.ts"]
    },
    {
      "name": "Newsletter → Blog",
      "paths": ["/dashboard/newsletters", "/blog", "/blog/[slug]"],
      "apis": ["/api/newsletter/*", "/api/blog/*"],
      "data": ["newsletters", "blog_posts"],
      "tests": ["tests/smoke/newsletter_to_blog.spec.ts"]
    }
  ],
  "do_not_touch": [
    "app/book/**",
    "api/booking/**",
    "api/webhooks/twilio*",
    "api/email/**",
    "dashboard/newsletters/**",
    "dashboard/crm/**",
    "lib/analytics/**"
  ],
  "env_contract": [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_MESSAGING_SERVICE_SID",
    "RESEND_API_KEY",
    "RESEND_FROM",
    "NEXT_PUBLIC_SITE_URL"
  ]
}
```

---

## 0.5 Auto-generated smoke tests (Claude must write before cleanup)

Minimal Playwright specs per frozen flow (examples):

```ts
// tests/smoke/book.spec.ts
import { test, expect } from '@playwright/test';

test('booking page renders and calendar loads', async ({ page }) => {
  await page.goto('/book/trauma');
  await expect(page.getByRole('heading', { name: /book/i })).toBeVisible();
  await expect(page.locator('[data-testid="calendar"]')).toBeVisible(); // adjust selector
});

test('nd booking page renders', async ({ page }) => {
  await page.goto('/book/nd');
  await expect(page.getByRole('heading', { name: /book/i })).toBeVisible();
});
```

```ts
// tests/smoke/newsletter_to_blog.spec.ts
import { test, expect } from '@playwright/test';

test('dashboard newsletters route mounts', async ({ page }) => {
  await page.goto('/dashboard/newsletters');
  await expect(page.getByText(/create newsletter/i)).toBeVisible();
});
```

---

## 0.6 PR #0 (“Discovery & Freeze”) checklist

Claude opens a PR that contains only the discovery artifacts and tests:

- [ ] `reports/PROJECT_SNAPSHOT.md` explains **purpose, users, flows** in Claude’s words.
- [ ] `reports/FEATURE_MAP.md` lists **pages → components → services**.
- [ ] `reports/DEPENDENCY_GRAPH.json` + derived **centrality summary**.
- [ ] `reports/RUNTIME_TOUCHPOINTS.md` with envs, webhooks, external APIs.
- [ ] `freezefile.json` created and reviewed.
- [ ] `tests/smoke/*` added; CI runs them.
- [ ] **No code deletions** yet.

**Merge gate:** No cleanup PRs may start until PR #0 is merged.

---

## 0.7 Safety invariants (enforced throughout cleanup)

- **Invariant A:** All flows in `freezefile.json.critical_flows` continue to pass smoke tests.
- **Invariant B:** Files under `do_not_touch` are not deleted/renamed/moved.
- **Invariant C:** No changes to env names, API contracts, or DB schema without a separate approved PR.

---

## 0.8 Design principles (Claude derives + records)

Claude must read the code and write a short **Design Principles** section inside `reports/PROJECT_SNAPSHOT.md` (e.g., state management approach, server/client boundaries, naming conventions, error handling patterns). This becomes the reference for acceptable refactors.

---
