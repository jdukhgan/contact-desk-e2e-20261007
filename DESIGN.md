# JLab design system

Read this before building or changing any JLab interface. Written for people and for coding agents.
The current authority is `design-system/jlab/`, imported from `jlab-design-system_updated.zip` on 2026-10-06. It supersedes the earlier handoff. Read its guides and relevant component README/preview. Its tokens override conflicting older prose. The archive mentions a handoff pack and MIGRATION.md that it does not include.

## Stack

This app uses React/Vite, Tailwind CSS v4, shadcn/ui on Radix, lucide-react, next-themes and Sonner. Preserve the app runtime while applying the supplied Next.js-oriented reference.
The theme lives in `frontend/src/design-system/globals.css`. Source tokens are in `design-system/jlab/tokens.json`. Run `python3 scripts/design-system/sync-jlab.py` to synchronize CSS values and `design.tokens.json`.

## Principles

1. **Calm by weight, not by emptiness.** Dense information, unequal visual weight. The sidebar is dimmer than content, borders are soft, only problems carry colour.
2. **Same header everywhere.** Title or breadcrumb left; freshness, controls, primary action and agent toggle right.
3. **The agent diagnoses, you approve.** It reads freely and shows its steps. Every change is a proposal with Approve, Dismiss and Undo.
4. **Keyboard first.** ⌘K reaches every resource and action. Nothing opened from the keyboard animates.
5. **Every state has a name.** Loading, empty, error, offline and stale are designed, never improvised.

## Hard rules

- Use only theme tokens: `bg-background`, `bg-card`, `bg-raised`, `bg-hover`, `bg-popover`, `text-foreground`, `text-muted-foreground`, `text-subtle-foreground`, `border-border`, `border-border-strong`, `text-success|warning|destructive-foreground|info`, `bg-*-bg` tints, `chart-1..5`. No raw hex, no Tailwind palette colours (`gray-500`, `blue-600` and so on).
- Colour means status or data series. Never decorate with it.
- Status is always a dot plus a word: Running, Degraded, Down, Stopped, Stale (with its age), or a working verb (Snapshotting, Starting). Use `<Status>`.
- Primary button is inverted (`variant="default"`): one per view, last in the header or form footer.
- Mona Sans at 14/22, weight 450, for all text, never below 12 px. JetBrains Mono only for addresses, IDs, versions, ports, commands and aligned figures. Tabular numbers are on globally.
- Icons: lucide-react only, `size={16} strokeWidth={1.5}`, 14 in small buttons, 18 in the phone bar. No emoji, no other icon sets. Icons never carry status alone.
- Charts state unit, scale with its maximum, and time range; thresholds are labelled. Capacity uses the real limit as its scale. No pie or donut charts.
- Not allowed: KPI card strips, big hero numbers, eyebrow labels above headings, gradients, glass or blur as decoration, glows, hard offset shadows, coloured side borders on cards, nested cards, modals for non-destructive tasks.
- Radius: tags 5, controls 7, menus 10, panels 12, dialogs 14. Heights: controls 32, small 28, inputs 36, table rows 44, header 52.
- Only one shadow exists: `shadow-pop`, for menus, tooltips, toasts, the palette, dialogs and drawers.

## Layout

| Width | Sidebar | Agent panel | Content |
|---|---|---|---|
| 1600 px and up | 228 px, open | 360 px, can stay open | Centred, max per page type |
| 1280 to 1599 | Collapses to 52 px rail when agent opens | 360 px | Keeps at least 720 px |
| 1024 to 1279 | 52 px rail | Overlays content | Full panel |
| 768 to 1023 | 52 px rail | Full-height sheet | Single column, two-column layouts stack |
| Below 768 | Floating bottom bar | Full screen | Single column, tables become row lists, 44 px tap targets |

Content max widths: overview 960, detail 1200 (main plus 300 side column), list full width, settings and forms 640, docs 68 characters.
Spacing on a 4 px grid: 8 within a group, 16 to 20 inside panels and between fields, 32 between sections, headings 10 above their content.
Layers: background, panel (`bg-card`), raised, popover (`shadow-pop`), modal (35% black scrim).
Page templates: Overview, List, Detail, Phone. Start every new page from one.

## Component index

`shadcn` = add with `npx shadcn add <name>`, then apply the JLab classes listed. `jlab` = file in `frontend/src/design-system/jlab/`.

### Using this index in code

- Composed patterns live once in `frontend/src/design-system/jlab/` and screens import them. Do not re-create them with page CSS.
- Supplied shadcn files carry the JLab classes listed here; extend them with a variant, never with `!important` overrides.
- The app has no page stylesheets. Compose the type styles (`text-display`, `text-section`, `text-label`, `text-body`, `text-meta`, `text-prose`, `text-data`, `text-data-sm`) and theme tokens in Tailwind classes. `cn()` knows the type styles are font sizes.
- Where a status word would sit on `bg-background` or a hover or selected surface, keep the word `text-muted-foreground` and let the dot carry the colour. In light theme the status colours fall below 4.5:1 on those surfaces.

| Component | Base | Variants and sizes | JLab rules and states | Keyboard |
|---|---|---|---|---|
| Button | shadcn `button` (replaced by our file) | default (inverted primary), secondary, ghost, destructive, link; sizes sm 28, default 32, icon, icon-sm | Press scales 0.97 in 150 ms. Working state keeps width and swaps the verb ("Starting"). Labels name the action. | Enter, Space |
| Input | shadcn `input` | default | `h-9 rounded-md bg-card border-input`; 2 px focus ring with 2 px gap; error border `destructive/60` plus message below saying how to fix | Standard |
| Input with unit | composed | | Unit in a joined right segment, `text-subtle-foreground` | |
| Textarea | shadcn `textarea` | | Grows to 8 lines, optional character count bottom right in mono | |
| Select | shadcn `select`; jlab `SelectField` (`data-meta` on an option renders on its right) | | Options show status or capacity on the right; unavailable options stay visible with the reason | Arrows, type-ahead |
| Combobox | shadcn `popover` + `command` | single, multi (tags) | Match highlighted in bold; "Create …" row last; multi shows removable tags, collapses past 3 | Arrows, Enter, Backspace removes last tag |
| Checkbox | shadcn `checkbox` | off, on, indeterminate | Checked fill is `bg-primary` | Space |
| Switch | shadcn `switch` | | 28 × 16; acts immediately, never inside a form that needs Save | Space |
| Radio group | shadcn `radio-group` | | 2 to 5 options, each with a one-line description | Arrows |
| Slider | shadcn `slider` | | Real limits labelled; free-capacity marker in `warning` | Arrows, Shift+Arrows |
| Number stepper | composed | | Joined − value + segments, mono value | Arrows, Shift ×4 |
| Date range | shadcn `calendar` + `popover` | | Presets column first; 24-hour times with time zone | Arrows in grid |
| File upload | composed | | Dashed drop zone that is also a button; per-file progress, success, specific error with Retry | Enter opens picker |
| Tabs | shadcn `tabs`, `variant="line"`, `TabsCount` | underline (override the pill default) | Current: 2 px foreground underline; counts in mono; same tab set for every resource of a kind | Arrows |
| Segmented control | shadcn `toggle-group`, `variant="segmented"` | | Inset group on `bg-background`, selected item raised with ring | Arrows |
| Breadcrumb | shadcn `breadcrumb` | | Follows resource hierarchy; collapses middle to "…" | |
| Pagination | shadcn `pagination` | | Range and total on the left ("51 to 100 of 1,240"); paginate only above 500 rows | |
| Stepper | composed: jlab `Stepper`, `StepList` (`stepper.tsx`) | | 3 to 5 steps; completed steps show a check and stay editable | |
| Accordion | shadcn `accordion` | | Closed sections summarise their values on the right | Enter, Space |
| Sidebar | shadcn `sidebar` block | expanded 228, rail 52 | `bg-sidebar` equals the app background; items `text-muted-foreground`, hover and current `bg-hover text-foreground`; right slot is a mono count or a status dot with number | |
| Bottom bar (phone) | composed: jlab `BottomBar` | | Floating, 58 px, radius 18, `shadow-pop`, 4 items max | |
| Page header | jlab `PageHeader` | live, stale | Stale removes the time range and hollows the live dot | |
| App shell | jlab `AppShell` | | Inset rounded content panel; agent panel behaviour per breakpoint | |
| Status | jlab `Status` | running, degraded, down, stopped, stale, working | Dot plus word, always | |
| Tag | shadcn `badge`, restyled | identifier (mono, outline), status (tinted) | `rounded-sm px-[7px] text-[12px]`; tint only when it carries status | |
| Count badge | composed | neutral, warning, destructive | 18 px pill, mono | |
| Capacity bar | jlab `CapacityBar` | normal, ≥80%, ≥95%, stale | 4 px; value and limit above; dashed when stale | |
| Allocation bar | composed | | Stacked 10 px bar, scale = real capacity, series in fixed order, legend with values | |
| Line, bar, stacked area chart | shadcn `chart` (Recharts) | | `chart-1..5`; axis ticks 12 px mono `subtle-foreground`; gridlines `border`; thresholds dashed `warning` with legend label; crosshair tooltip on `popover`; drag to zoom | Arrows move crosshair |
| Table | shadcn `table`, `framed` for the 10 px enclosure | | Rows 44 px; header 13 px `muted-foreground`; numbers right-aligned mono; sort arrow on active column; selected row `info` at 7%; hover `bg-raised` and actions appear; stopped and stale rows dim; default sort puts problems first | Arrows, Space selects |
| Filter bar | composed: jlab `FilterBar`, `SearchField` | | Search field with `/` shortcut, dashed "+ Field" chips, view switch, Columns | `/` focuses |
| Key-value list | composed: jlab `KeyValueList` | | `dl`, 96 to 110 px label column in `subtle-foreground`, mono values where technical | |
| Log viewer | composed: jlab `LogViewer` | | Mono rows: time, level, message; only WARN and ERROR rows tint | |
| Code block | composed: jlab `CodeBlock` | | Language label and Copy button in a header row | |
| Terminal | xterm.js | | Own near-black surface in both themes, connection status in header | Full keyboard |
| Diff viewer | composed | unified, split | File path, +/− counts, two line-number columns | |
| Tree | shadcn `collapsible`, ARIA tree | | 16 px indent per level, chevrons only on parents, status at right edge | Arrows, Left/Right collapse |
| List item | composed | | 32 px icon tile, title, one meta line, status or one action on the right | |
| Card | shadcn `card`, restricted | | Only for items with a visual or a grid (templates, projects). Never nested. Never as page structure | |
| Banner | shadcn `alert`, restyled: `variant`, `AlertTitle` (fact), `AlertDescription` (consequence), `AlertAction` | info, success, warning, destructive | Tinted background, dot, one sentence of fact, one of consequence, one action button | |
| Toast | `sonner` | working, success with Undo, error | Bottom right, 5 s, errors persist, pause on hover and hidden tab | |
| Progress | shadcn `progress` | determinate, indeterminate | 4 px, label with time left | |
| Spinner | lucide `Loader` | 12, 16, 20 | Only inside buttons and small inline slots; 700 ms per turn | |
| Skeleton | shadcn `skeleton` | | `bg-raised`, final layout and height, no shimmer | |
| Avatar | shadcn `avatar` | you, agent, Codex, Claude | 24 px, overlapping with a 2 px background ring | |
| Tooltip | shadcn `tooltip` | | 400 ms first delay, then instant (`skipDelayDuration`); shows shortcut | |
| Hover card | shadcn `hover-card` | | Explains a number; label column plus mono values | |
| Dropdown menu | shadcn `dropdown-menu` | | `bg-popover rounded-lg shadow-pop p-1`; items 32 px, radius 6, shortcut right; disabled items keep their reason; destructive last, below a separator, in `destructive-foreground` | Arrows, letters |
| Context menu | shadcn `context-menu` | | Same as the row's action menu | |
| Popover form | shadcn `popover` | | One short form, Cancel and primary bottom right | Escape |
| Drawer | shadcn `sheet`, side right | | 320 px; header with close, body, footer with primary first | Escape |
| Dialog | shadcn `alert-dialog` | destructive confirm | Only for destroying data. Title asks the question with the name; body says what is lost and kept; type-the-name to enable the destructive button; Enter never confirms | Escape, Tab trapped |
| Command palette | shadcn `command` in dialog | | Opens with no animation; groups by kind; status inline; actions that change things say "Needs approval"; empty state offers "Ask agent instead" | ⌘K, arrows, Enter, ⌘Enter asks agent |
| Agent panel | composed | | Header with model chip; your messages in raised bubbles, agent text plain; composer with context chips; footer note "Every change needs your approval" | |
| Agent steps | jlab `AgentSteps` | running, done, failed | Timings in mono; failed step shows its reason | |
| Proposal card | jlab `ProposalCard` | proposed, applied, failed | Diff, file, side effect; Approve and Dismiss; applied shows what it watches plus Undo; failed shows reason plus Retry | |
| Empty state | composed: jlab `EmptyState` | none yet, filtered empty | Names what is missing and offers one next step; filtered empty offers Clear filter | |
| Long-form text | `prose` styles | | 16/26, weight 450, 68 characters, links underlined with 3 px offset, inline code on `bg-hover` | |

## Motion

| Moment | Motion |
|---|---|
| Press on any control | scale 0.97, 150 to 160 ms, `ease-[var(--ease-out)]` |
| Menus and popovers | scale 0.97 to 1 and fade from the trigger (`origin-[var(--radix-popover-content-transform-origin)]`), 150 ms |
| Agent panel, sidebar, drawer | 200 ms, `ease-[var(--ease-panel)]` |
| Agent steps appearing | fade and 4 px rise, 180 ms, 40 ms stagger |
| Command palette, keyboard actions | none |
| Hover effects | only inside `@media (hover: hover) and (pointer: fine)` |
| Reduced motion | opacity and colour only (handled globally in `globals.css`) |

## Writing

Sentence case everywhere. Buttons name the action ("Start machine", not "Submit"). Errors say what happened and how to fix it ("Port 54322 is used by supabase. Try 54330."). Times in 24-hour format; durations as "4 min 12 s"; sizes with units ("27.1 / 32 GiB").

## Reference

The visual source of truth is `design-system/jlab/`: component and template HTML previews, eight guides, logos, fonts and tokens. Do not reintroduce Geist, the previous palette, text below 12 px or smaller controls. Do not enable antialiased font smoothing. Mona Sans width stays at 100%, with 104% allowed only for page titles. Dark is the default.
