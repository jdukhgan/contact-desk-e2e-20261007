# JLab Contact Desk

Public disposable acceptance project for one central Kandev / remote Debian worker run.
A small local CRM for fictional contacts, stored in SQLite. No external services or real personal data.

## Acceptance brief
Build an elegant responsive contact tracker with a list, search, owner/status filters and a detail editor. Follow the supplied JLab design reference. Keep one application process, SQLite and a small useful test suite; no accounts, authentication, microservices, charts, cloud deployment or framework upgrades.

1. Inspect the repository, binding, installed roles and project memory; record a concise plan and acceptance criteria.
2. UI Designer implements the reusable UI foundation and actual contact-list/detail components using the supplied JLab reference, with desktop and phone layouts. Deliver code, not only a design document.
3. Create the minimal app/server, documented start command and health endpoint.
4. Create SQLite schema for contacts: name, email, company, owner, status (New/Active/Archived), notes and timestamps.
5. Seed six fictional contacts and two fictional owners idempotently; never use real data.
6. Implement contact creation with required name and valid optional email; clear inline errors.
7. Implement edit/save and view details.
8. Implement deletion with named confirmation, preserving other contacts.
9. Implement search across name/company/email and owner/status filters, with clear/reset action.
10. Provide useful loading, empty and error states; keyboard access, theme switch and responsive layout.
11. Independently review correctness, data validation and persistence; prove create/edit/delete survive server restart with a small functional suite.
12. UI Tester verifies the running app at desktop and phone in both themes, captures final screenshots, and supplies exact-commit evidence. Lead integrates commits, accepts the result, documents the launch URL/command and completes the workflow.

Treat this as 4–6 meaningful delegated deliverables, not twelve separate implementation agents. At most two active child tasks and one browser-heavy stage at a time. UI Designer first establishes the code foundation; Builder handles frontend integration and backend. Reviewer reviews code/persistence; UI Tester verifies the actual UI without repeating the full code review. Lead owns integration and final acceptance. Stop owned browser/server processes when finished; leave a documented runnable app.
