# Project Context — Toasted Sesame Therapy (TST)

Use this context when evaluating or generating UI, copy, or code.

## Business & Audience

- Practice: **Toasted Sesame Therapy (TST)** — virtual-only, Georgia-based therapy practice.
- Audience: Adults (including trauma survivors and neurodivergent folks) seeking clear structure, practical tools, and culturally-aware care.
- Goal: Increase qualified consults at **$150/session**; reduce no‑shows via clear messaging and reminders.

## Brand & Style

- **Design Aesthetic:** Neo‑Brutalist (boxy blocks, bold borders, high contrast, minimal gradients, purposeful shadows).
- **Primary palette:** Black & White; **Secondary:** light sky blue.
- **Accent/fashion colors:** crimson, millennial pink, lilac, black, brown (use sparingly and consistently).
- **Tone:** Warm, supportive, direct. Short, helpful sentences. Avoid jargon.
- **Typography:** Clean sans with optional grotesk/mono accents. Big H1s, confident hierarchy.

## Product & Pages

- Tech: Next.js app; TailwindCSS with a project `tailwind.config.{js,ts}` schema.
- Pages: Home/landing, Services, About, FAQs, Resources/Lead magnets, Contact/Scheduling.
- Primary CTA: “Book a consultation” (or equivalent). Secondary: “Learn more / Resources”.

## Accessibility & Usability Priorities

- WCAG AA contrast as minimum; visible focus; keyboard‑friendly flows.
- Large tap targets and simple forms (collect essentials only).
- Clear error states and plain‑language copy.

## Review Expectations

- Always align tokens to Tailwind config (colors/spacing/radii/type/shadows).
- Apply the Neo‑Brutalist principles overlay (`neo-brutalist-principles.md`).
- When proposing fixes, **prefer Tailwind utilities using tokens** over raw CSS or ad‑hoc hex values.
- Provide “Quick Wins” when a change can be made with utility classes alone.

---

Fill in specifics as they become available:

- Exact fonts (e.g., `font-sans` = Inter/Geist/SF?)
- Tailwind color tokens (`brand`, `accent`, etc.)
- Space scale extensions
- Component library usage (e.g., shadcn/ui), if any
