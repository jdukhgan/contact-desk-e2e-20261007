# Building with shadcn/ui

JLab ships as a shadcn/ui theme for Next.js and Tailwind CSS v4. Agents restyle existing shadcn components rather than inventing new ones.

## Files in the handoff pack

| File | Purpose |
|---|---|
| `globals.css` | Maps every shadcn colour variable to JLab tokens, plus the JLab extras, fonts, radius scale, motion curves and global focus, selection and reduced-motion rules |
| `DESIGN.md` | The rulebook and the full component index |
| `MIGRATION.md` | Six phases for converting an existing app, with a replacement table and verification checks |
| `design.tokens.json` | The tokens in DTCG format |
| `components/ui/button.tsx` | Replaces shadcn's Button |
| `components/jlab/*` | Status, CapacityBar, PageHeader, AppShell, AgentSteps and ProposalCard |

## Token names in code

| This system | Tailwind class |
|---|---|
| `bg`, `panel`, `raised`, `hover` | `bg-background`, `bg-card`, `bg-raised`, `bg-hover` |
| `text`, `text-2`, `text-3` | `text-foreground`, `text-muted-foreground`, `text-subtle-foreground` |
| `line`, `line-strong`, `line-heavy` | `border-border`, `border-border-strong`, `border-border-heavy` |
| `primary`, `primary-text` | `bg-primary`, `text-primary-foreground` |
| `running`, `degraded`, `down`, `down-text` | `text-success`, `text-warning`, `bg-destructive`, `text-destructive-foreground` |
| `*-bg` tints | `bg-success-bg`, `bg-warning-bg`, `bg-destructive-bg` |
| `series-1` to `series-5` | `chart-1` to `chart-5` |
| `pop` | `shadow-pop` |

## Set-up

Next-themes with `attribute="class"` and `defaultTheme="dark"`. Mona Sans and JetBrains Mono from `next/font/google` (`Mona_Sans` with `axes: ["wdth"]`, and `JetBrains_Mono`). Icons from `lucide-react`. Toasts with Sonner at bottom right.
