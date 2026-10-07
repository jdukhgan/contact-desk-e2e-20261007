# Table

40 px rows, soft dividers, numbers right-aligned in mono. Sortable headers show their direction. Selected rows tint; the actions column appears on hover.

## Table

- **Build with:** shadcn `table` (+ TanStack for data tables)
- **Rules:** Rows 40 px; header 12 px `subtle-foreground`; numbers right-aligned mono; sort arrow on active column; selected row `info` at 7%; hover `bg-raised` and actions appear; stopped and stale rows dim; default sort puts problems first
- **Keyboard:** Arrows, Space selects

## Filter bar

- **Build with:** composed
- **Rules:** Search field with `/` shortcut, dashed "+ Field" chips, view switch, Columns
- **Keyboard:** `/` focuses

## Tokens used

`degraded`, `line-heavy`, `line`, `primary-text`, `primary`, `raised`, `running`, `text-2`, `text-3`, `text`
