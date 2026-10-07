# Contact Desk: UI foundation handoff (D1)

Working React/Vite UI built on the JLab design reference (`DESIGN.md`, `design-system/jlab/`). No backend. This is an initial foundation, not approval of the integrated app.

## Run

```
cd frontend
npm install
npm run dev            # http://localhost:5173, demo controller with in-memory fictional data
npm run build          # tsc --noEmit && vite build -> frontend/dist
npm test               # vitest: validation + filtering
```
Reference states: `/?state=loading`, `/?state=error`, `/?state=empty`.

## Layout of the code (Designer-owned)

| Path | Purpose |
|---|---|
| `src/design-system/globals.css` | JLab tokens (copied 1:1 from `tokens.json`) as CSS variables for `.dark`/`.light`, Tailwind v4 `@theme` mapping (`bg-card`, `text-muted-foreground`, `shadow-pop`, `text-body`...), fonts, motion, reduced motion |
| `src/design-system/theme.tsx` | `ThemeProvider`, `useTheme()`; class on `<html>`, key `contact-desk-theme`, dark default, no flash (inline script in `index.html`) |
| `src/design-system/cn.ts` | clsx + tailwind-merge aware of JLab type styles |
| `src/components/ui/` | `Button`, `Input/Textarea/Select/Field`, `Segmented`, `Status`, `EmptyState/Skeleton/Banner`, `ConfirmDeleteDialog` (Radix AlertDialog), `AppShell/PageHeader` |
| `src/components/contacts/` | `ContactDesk` (page container), `FilterBar`, `ContactList`, `ContactForm`, `ContactFacts`, `ContactStatusLabel` |
| `src/lib/contacts.ts` | Types, `validateContactInput`, `filterContacts`, formatting |
| `src/demo/demo-controller.ts` | In-memory controller with six fictional contacts, two owners |

The tools `scripts/design-system/sync-jlab.py` and the pack's `globals.css`/`MIGRATION.md` referenced by `DESIGN.md` are not in the repository; `globals.css` was written by hand from `tokens.json`. Re-check it if `tokens.json` changes.

## Integration contract (Builder)

Replace `useDemoController()` in `src/App.tsx`; nothing under `components/` needs visual changes.

```ts
interface ContactDeskProps {
  contacts: Contact[];  owners: Owner[];
  loadState: "loading" | "error" | "ready";  loadError?: string;
  onRetry(): void;
  onCreate(input: ContactInput): Promise<SaveResult>;
  onUpdate(id: number, input: ContactInput): Promise<SaveResult>;
  onDelete(id: number): Promise<DeleteResult>;
}
type SaveResult   = { ok: true; contact: Contact } | { ok: false; error: string; fields?: Partial<Record<keyof ContactInput, string>> };
type DeleteResult = { ok: true } | { ok: false; error: string; fields?: ... };
Contact = { id, name, email, company, ownerId: number|null, status: "New"|"Active"|"Archived", notes, createdAt, updatedAt }
ContactInput = Contact minus id/createdAt/updatedAt
```
Map API `{error, fields?}` bodies straight into the `{ok:false}` results; map `{contacts}`, `{contact}`, `{owners}` into props. A rejected promise renders a "could not reach the server" message and keeps form input. Search and owner/status filtering run client-side in `filterContacts` (name/company/email, case-insensitive, owner `all|none|id`, status); if the Builder filters server-side, keep `FilterBar` and pass the results as `contacts`. Server validation must match the client (required name, optional valid email). Vite dev needs an `/api` + `/health` proxy in `vite.config.ts` (marked there). Serving `dist/` from the single app process is the Builder's decision. Navigation is internal state (`list | new | detail`); add URL routing if wanted.

## Behaviour implemented

- List: search + owner (incl. Unassigned) + status, "Clear filters" appears only while active, "n of N contacts" live region. Table from 768 px, row list below. Archived rows dim.
- States: loading (6 skeleton rows at final height), error banner with Retry, empty ("No contacts yet" + New contact), filtered-empty (Clear filters), invalid (inline messages, focus moves to first invalid field), saving ("Saving"/"Creating" keeps width), saved ("Saved at HH:mm").
- Detail is a page: breadcrumb header, name title, form (max 640) + 300 px facts column (stacks below 1024). Create uses the same form; success opens the new contact.
- Delete: header button (destructive style) opens an alert dialog titled "Delete {name}?", typed-name enables the button, Enter never confirms, Escape cancels, focus starts on Cancel and is trapped, errors show inside the dialog.
- Theme toggle in sidebar / bottom bar; dark default.

## Visual acceptance criteria

1. Only theme tokens; no raw hex in components; no gradients, glows, nested cards, KPI strips, charts, agent panel.
2. One inverted primary per view ("New contact" on the list; "Save changes"/"Create contact" in the form footer). The dialog's confirm is the destructive variant.
3. Status is dot + word everywhere (New info, Active running, Archived hollow ring); only the dot is coloured.
4. Mona Sans 14/22 (450); mono only for the ID fact and tabular figures; icons lucide 16 / 1.5 (18 in the phone bar).
5. Heights: controls 32, inputs 36, table rows 44, header 52; radii 7 controls, 10 table, 12 panel, 14 dialog. Phone: controls and inputs 44, header 56, floating 58 px bottom bar.
6. Sidebar 228 from 1024, 52 px rail 768 to 1023, bottom bar below 768. No horizontal overflow at 1440, 834, 390 in both themes (measured `scrollWidth - innerWidth = 0`).
7. 2 px focus ring everywhere; fields have labels and `aria-invalid`/`aria-describedby`; segmented status is a keyboard radiogroup.

## Evidence

Screenshots: `artifacts/design/2bf5f48d89604c67f2925cbf0f65871e06043b20/` — `{desktop,tablet,phone}-{dark,light}-{list,detail}.png` (12) and `state-*` for loading, error, empty, filtered-empty, invalid, saving, delete-dialog (desktop and phone, both themes; delete dialog also at tablet). Functional checks run in the browser at desktop and phone, both themes: invalid create blocked and focus on first invalid field; create works; delete button disabled until the name is typed; Enter keeps the dialog open; Escape closes; typed delete removes only that contact (back to 6 of 6 after removing the test contact).

## Known gaps

- Detail form has no unsaved-changes guard and no URL routing.
- Theme control is a toggle (no system option).
- Wide-screen (1600+) centring uses the shell as is; list stays full width per the reference.
- Not verified on real iOS/Android; Chromium only.
