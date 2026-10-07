# JLab Contact Desk delivery plan

<!-- kandev-system: preserve task/session identity, question barriers, title ownership, completion gates, autopilot behavior, delegation boundaries, final-action rules and user edits. -->
Task: 3f11e79e-13dd-4352-a7bf-072dc2c64364. Initial Lead session: 7183b0ae-9b1e-4b36-9f12-7ad48fdf8848.
Project: ea3745e1-676a-4a3e-a109-419960b26788; repository: jdukhgan/contact-desk-e2e-20261007.
Inspected source: 184bebbc44b3cb4daf50461b7f6262e391c7c9c6, clean isolated checkout /home/kandev/.kandev/tasks/task-3f11e79e-13dd-4352-a7bf-072dc2c64364, branch feature/project-kickoff-cont-3f11e7.
Approved requirements: README.md items 1–12 and existing task brief. Design authority: DESIGN.md and design-system/jlab/, whose tokens/guides/previews take precedence. Read roles from .kandev/roles/.

## Intended result and scope

A runnable local CRM for fictional contacts: SQLite persistence, search/filter list, create/detail/edit/delete, inline validation, loading/empty/error states, keyboard access, dark default and light theme, responsive desktop/tablet/phone. One Node application process serves the built frontend and API. Commit and locally integrate accepted changes; no external publication, merge to origin/main, authentication, cloud deployment, charts, microservices, or unrelated upgrades. No human approval stage; routine development and tests already authorized.

Use six meaningful deliverables below, not twelve separate agents. Parent native workflow supplies Builder, Reviewer, Verifier and Lead sessions for the complete integrated application; do not create duplicate baseline pipelines. Design work uses bounded child tasks in the configured Design workflow. At most two active child tasks, and one browser-heavy stage at any time; default to sequential execution because the UI foundation is a prerequisite. Keep task status and evidence in Kandev; durable decisions only in project Hindsight.

## Architecture and ownership

Runtime proposal grounded in available tools: Node 24.14.0 with built-in node:sqlite, React/Vite frontend, Tailwind v4, shadcn/Radix patterns, lucide-react, theme tokens and local fonts. No application manifests currently exist, so this establishes the minimal runtime rather than upgrading an existing framework.
- Designer owns frontend/src/design-system/**, frontend/src/components/**, styles/tokens/fonts, representative contact layout, and initial frontend scaffolding/build manifests needed to execute it.
- Builder owns server/**, tests/**, frontend/src/api/** and application data/controller wiring, plus root start/test scripts and README runtime documentation. Builder can adapt Designer scaffolding after the committed handoff; no simultaneous shared-file edits. Designer owns visual primitives; changes there require focused Designer guidance.
- Lead owns orchestration, acceptance/evidence documents and local Git integration. Existing supplied design-system/jlab/** and project binding/roles remain intact.
- Native SSH executor supplies independent task checkouts. Verify checkout/branch identity; never presume another checkout shares local branch refs. Fetch exact prerequisite commit from the same-project child checkout and cherry-pick/merge locally; record source path and full commit. Base branch must be remotely available: origin/main verified at 184bebbc44b3cb4daf50461b7f6262e391c7c9c6. No push needed.
- Designer representative UI must consume props/callbacks, not own SQLite/API code. Builder replaces demonstration data/controller with actual API state.
- Browser evidence is stored under artifacts/<stage>/<revision>/ and retained in task plans with commands/results; artifacts must contain no secrets.

## Shared data/API contract

Contact = { id: integer, name: string, email: string, company: string, ownerId: integer|null, status: "New"|"Active"|"Archived", notes: string, createdAt: UTC ISO string, updatedAt: UTC ISO string }.
Owner = { id: integer, name: string }. ContactInput = { name, email?, company?, ownerId?, status?, notes? }; defaults are empty optional text, unassigned owner, New status. UI labels owner by name.
- GET /health -> 200 JSON { status: "ok" } after DB initialization.
- GET /api/owners -> 200 { owners: Owner[] }.
- GET /api/contacts?q=&ownerId=&status= -> 200 { contacts: Contact[] }. Search name/company/email case-insensitively; filters combine with AND. Deterministic ordering.
- GET /api/contacts/:id -> 200 { contact: Contact } or 404.
- POST /api/contacts -> 201 { contact: Contact }.
- PUT /api/contacts/:id -> 200 { contact: Contact } or 404. Full editor input; preserve createdAt, update updatedAt.
- DELETE /api/contacts/:id -> 204, or 404; delete only the named record.
- Invalid JSON/types/blank trimmed name/invalid nonempty email/unknown status/unknown owner -> 400 { error: string, fields?: Record<string,string> }. Server validates every mutation using parameterized SQL; UI presents field errors and preserves unsaved input on failures.
- SQLite contacts and owners tables with foreign keys, IDs, timestamps and constrained status; configurable DB path for isolated tests. Use a seed marker or equivalent to seed exactly six fictional contacts and two fictional owners once, with stable example.invalid emails. Restart must not duplicate seeds or resurrect deliberately deleted seeded records.
Designer/Builder may refine internal component signatures; record material contract changes in this plan and parent handoff before integration.

## Deliverables, dependencies and acceptance criteria

### D1 — Working JLab UI foundation and representative CRM (UI Designer child)
Owner profile 2fc60fef-d5e2-4dcd-b8f3-5b4d7182ffb1; workflow e08824d2-55a6-48a7-87c7-d3760fe978d2, Design step 7edd41d3-741c-4ec6-b051-fdf0fa87694e. Dependency: this planning brief.
- [ ] Implement reusable theme tokens/fonts, shell/header/controls/status/data-state components and real contact list/detail/editor/delete-confirm UI with realistic fictional data and callback interfaces.
- [ ] Match supplied ListTemplate, DetailTemplate, PhoneTemplate, Input, Button, Table, FormLayout, Dialog and DataStates references. Dark default; Mona Sans; Lucide; token-only colors; inverted primary; 44 px phone tap targets; desktop list becomes phone rows.
- [ ] Create/edit in page/drawer; destructive dialog names the contact, explains preservation of other records and follows reference typed-name confirmation; keyboard/focus handling and explicit labels.
- [ ] Demonstrate populated/loading/empty/filtered-empty/error/invalid/saving states, theme switch and usable desktop/tablet/phone layout.
- [ ] Build and render actual working components at 1440x900, 834x1112, 390x844 in both themes; capture evidence and document exact commands/component interfaces. Commit code, report full revision and checkout to parent, clean owned resources. Documentation-only handoff does not pass.
Initial design acceptance proves the foundation only; final app requires D5.

### D2 — SQLite CRM integration and persistence suite (parent native Implement / Builder)
Owner profile abf3f011-13cc-4c1f-aec7-9443b26ba5a0; baseline Implement d08e35bb-1374-484c-8b1e-6e7c75d5297a. Dependency: accepted/integrated D1 code.
- [ ] Import exact Designer commit, preserve visual components, replace demonstration controller with API-backed state.
- [ ] Add single-process server serving built UI, health endpoint, SQLite schema and idempotent fictional seed per shared contract; document install/build/start/test commands, local URL and DB path.
- [ ] Implement create, detail, save, deletion, search across all three fields, AND owner/status filtering and clear/reset action; inline required-name and optional-email validation backed by server validation.
- [ ] Handle initial load, no contacts, no filter matches, request failures with retry, save/delete failures without losing input or other records; avoid stale fetch responses overriding newer filter/selection state.
- [ ] Small meaningful automated suite covers schema/seed idempotence, create/edit/delete, invalid inputs, filters, parameterized literal search, unknown IDs, and persistence after actual server stop/start with same DB. Assert deletion remains deleted and other contacts unchanged.
- [ ] Run build and suite; record command/exit/results on exact committed revision; hand off to native Reviewer. Build alone does not pass.

### D3 — Independent correctness and persistence review (parent native Review / Reviewer)
Owner profile a509e546-453e-43ff-abb3-d54409fd7f60; step 8c039bf8-c67b-485e-958a-38b01ccd8499. Dependency: D2 integrated commit.
- [ ] Review source and tests against README criteria and API contract: validation, SQL, DB lifecycle, seed deletion/restart, search/filter correctness, stale requests, error handling, unrelated-contact preservation.
- [ ] Independently execute focused functional/persistence tests on exact revision; report file/line findings and commands/results. Record Pass only with no unresolved blocking defects.
- [ ] Failure returns parent to Implement using native move; no success signal on failure. After fixes, review changed revision before progressing. Do not request another review of this review.

### D4 — Independent browser and functional verification (parent native AI UI test & verify / Verifier)
Owner profile 9b5b7e61-eee9-42b1-b9f2-66efc76ec106; step 173b27a8-c5e3-4814-8acc-97720a0f26b1. Dependency: D3 pass at same revision.
- [ ] Run actual app with isolated fictional DB and verify create including blank/invalid email, view/edit/save, named deletion cancel/confirm, persistence after restart, combined search/filters/reset and preservation of unrelated contacts.
- [ ] Verify keyboard navigation, focus, labels, theme persistence, loading/empty/error/filtered-empty, phone scrolling/tap targets and no overflow; inspect browser console/network failures.
- [ ] Final screenshots at desktop 1440x900, tablet 834x1112, phone 390x844, both dark/light (six minimum), including populated list and representative detail plus relevant state captures. Record exact commit, startup/test commands, URL, artifact paths and criteria results.
- [ ] Stop owned temporary browser/server resources; report confirmed cleanup separately. Missing app/browser/authentication is Blocked, never Pass. Defects return to Implement; rerun affected checks on corrected revision. Do not repeat full code review.

### D5 — Final visual acceptance of actual integrated app (UI Designer child)
Same configured Designer and Design workflow; dependency: D4 evidence and exact integrated revision. Create only after D4; reuse the responsible Designer task/session where native routing permits, otherwise document why a new final-review task is necessary. Initial Design workflow ends its session at Done, so a bounded final visual review child may be required.
- [ ] Inspect actual app against D1 rendered reference and repository tokens at all three sizes in both themes; reuse D4 evidence where sufficient, inspect running UI for unresolved visual questions.
- [ ] Judge hierarchy, alignment, spacing, typography, density, responsive composition, component fidelity, realistic empty/populated/editor states. Record Pass / Changes required / Blocked with exact revision and screenshots.
- [ ] Route specific corrections through Lead to Builder; after corrections require fresh review/functional evidence as affected and a visual recheck. Captured screenshot or initial design completion alone is not visual acceptance.
- [ ] Send parent evidence handoff before native completion; stop owned resources.

### D6 — Integrated acceptance, launch handoff and Done (parent native Lead acceptance)
Owner Lead profile 14548a05-a94d-413b-a039-4708b17fb51f; step 908a7354-ebc6-4065-ac53-dc9596fb421d. Dependencies: D1–D5 passing evidence at final integrated revision.
- [ ] Read native child/session outcomes, actual profiles, handoffs, review verdict, browser evidence and final Designer visual verdict. Failed/cancelled/idle/waiting tasks are not completion.
- [ ] Confirm README items 1–12 covered, local integration committed, all runtime commands runnable, final screenshot paths accessible, isolated seed/test behavior and owned-resource cleanup evidenced.
- [ ] Record full final revision, source checkout, command results, artifacts, launch command and local URL; retain durable accepted architecture/test procedures with provenance in project memory.
- [ ] On defect return to Implement and repeat relevant gates; after two failed correction cycles reassess scope/evidence as Lead. No human check stage.
- [ ] Signal only current stage completion as final tool action; native Done readback confirms terminal outcome in a subsequent turn. State external merge/deployment separately and do not claim deployment.

## Native coordination and completion rules

Baseline workflow d5225b81-1723-473d-a06a-158624fb017e: Plan → Implement → Review → AI UI test & verify → Lead acceptance → Done. Native profiles are pinned by stage; preserve them. Parent autopilot is false as configured; do not enable it or create extra sessions to bypass gates.
Read plans before updates, preserve user content and title, use unique exact edits/versioned appends. Questions are hard barriers using ask_user_question_kandev; never infer an unanswered approval. None currently required because brief and execution are authorized.
Use native dependencies for any separately launched dependent children; do not auto-launch a child against stale origin/main assuming it contains prerequisite commits. Handoffs must provide exact source paths/commits and controlled local integration.
Child stage handoff through message_task to actual coordinating parent must precede final step_complete. Store identical evidence in child plan. step_complete is last action only after that stage passes. Task/session changes or stale-turn rejection cannot be repaired by retry or manual move.
No provisioning artifacts qualify as application acceptance. Shared Hindsight bank contact-desk-e2e-20261007-dev identity was verified; never alter its policy/credentials or other project resources.

## Planning evidence and current limitations

- Source clean and full revision verified; no existing child tasks, plans or app manifests. Current Lead profile readback matches contract.
- README/DESIGN/imported tokens/role policy and Lead/Designer instructions inspected. Native baseline and Design workflow stage/profile readback match binding.
- Hindsight recall contains onboarding/environment evidence only, not application requirements; current README is authoritative.
- git ls-remote --heads origin main passed with remote revision 184bebbc44b3cb4daf50461b7f6262e391c7c9c6. First sandboxed DNS attempt failed; authorized read-only network execution succeeded. No credential or publication blocker established.
- Semble selected in contract but no callable Semble tools exposed after catalog discovery. Use direct repository inspection for this plan; report unavailable search rather than claiming Semble execution.
- Installed Node v24.14.0/npm 11.9.0/Python present. Design/Builder provider execution and product dependency installation remain unverified until small actual execution. Do not infer runtime readiness from provisioning.

