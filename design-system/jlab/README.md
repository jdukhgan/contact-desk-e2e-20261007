# JLab

JLab is the design system for every interface in Janty's development and AI lab: two Proxmox hosts, the machines and services on them, the projects under test, and an agent that helps run it all. It is built to the standard of the best developer tools shipping in 2026, with Linear's calm consistency, Vercel's sidebar navigation and Railway's built-in agent, and applied to a homelab.

Start here, then read the sections in order. Components are under **Components**, grouped by job, each with a live preview, its shadcn/ui base, variants, rules and keyboard behaviour.

## Principles

1. **Calm by weight, not by emptiness.** Dense information with unequal visual weight. The sidebar is dimmer than content, borders are soft (`line`), and only problems carry colour.
2. **Same header everywhere.** Title or breadcrumb on the left; freshness, view controls, the one primary action and the agent toggle on the right.
3. **The agent diagnoses, you approve.** It reads freely and shows its steps. Every change arrives as a proposal with Approve, Dismiss and Undo.
4. **Keyboard first.** ⌘K reaches every host, machine, database, endpoint and action. Nothing opened from the keyboard animates.
5. **Every state has a name.** Loading, empty, error, offline and stale are designed, never improvised.

## The ten rules

1. Use tokens only. No raw hex, no Tailwind palette colours.
2. Colour means status or a data series, nothing else.
3. Status is a dot plus a word: Running, Degraded, Down, Stopped, Stale with its age, or a working verb.
4. One primary button per view, inverted (`primary` on `primary-text`), placed last.
5. Mona Sans for text at 14 px and weight 450, never below 12 px; JetBrains Mono only for addresses, IDs, versions, ports, commands and figures.
6. Lucide icons only, 16 px, 1.5 px stroke.
7. Charts state unit, scale with its maximum, and time range. No pie or donut charts.
8. One shadow exists (`pop`), for floating layers only.
9. Not allowed: KPI card strips, hero numbers, eyebrow labels, gradients, glass, glows, offset shadows, coloured side borders, nested cards.
10. Modals only for destroying data. Everything else uses a drawer, a popover or Undo.

## Themes

Dark is the default and the first theme; Light mirrors every token. Switch with the theme control at the top of this page. Every text token's note gives its contrast on `panel`.

## What is in this system

| Where | What |
|---|---|
| Colors, Typography, Spacing | Tokens with a usage note on each |
| Components | 39 component cards in 10 groups, plus 4 page templates |
| Assets, Logos | The JLab mark for dark and light grounds |
| Sections | Colour, Typography, Layout, Motion, Iconography, Writing, The agent pattern, Building with shadcn/ui |

## For coding agents

Build on Next.js, Tailwind CSS v4 and shadcn/ui. The handoff pack (`globals.css`, `DESIGN.md`, `MIGRATION.md`, `design.tokens.json` and the `components/jlab` files) implements exactly what this system shows. Read the section **Building with shadcn/ui** before writing UI, and follow `MIGRATION.md` to convert an existing app.
