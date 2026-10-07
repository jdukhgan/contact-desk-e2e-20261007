# Layout

## Shell

Six regions: a dim sidebar on `bg` (228 px, or a 52 px rail), one inset content panel (`panel`, radius 12, soft border), tabs and a 52 px header inside it, an optional 360 px agent panel to the right, and a 28 px status line at the bottom.

## Breakpoints

| Width | Sidebar | Agent panel | Content |
|---|---|---|---|
| 1600 px and up | 228 px open | Can stay open | Centred at its max width |
| 1280 to 1599 | Collapses to rail when agent opens | 360 px | At least 720 px |
| 1024 to 1279 | 52 px rail | Overlays content | Full panel |
| 768 to 1023 | 52 px rail | Full-height sheet | Single column |
| Below 768 | Floating bottom bar | Full screen | Row lists, 40 px tap targets |

## Content widths

Overview 960 px. Detail 1200 px (main column plus a 300 px facts column). Lists full width. Settings and forms 640 px. Docs 68 characters.

## Spacing

A 4 px grid. 8 px within a group, 16 to 20 px inside panels and between fields, 32 px between sections, 10 px from a section heading to its content.

## Layers

`bg`, `panel`, `raised`, then floating layers with the `pop` shadow (menus, tooltips, toasts, palette), then modals over a 35% black scrim.

## Templates

Every new page starts from one of four templates under **Components, Templates**: Overview, List, Detail and Phone.
