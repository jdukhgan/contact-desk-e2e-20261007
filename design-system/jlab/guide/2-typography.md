# Typography

One family, Mona Sans, carries the interface. It is GitHub's open-source grotesque, with a weight axis (200 to 900) and a width axis (75 to 125). JetBrains Mono appears only where fixed width helps: addresses, IDs, ports, versions, commands and aligned figures. Tabular numbers are on everywhere (`font-feature-settings: 'tnum'`).

## Scale

| Style | Size / line | Weight | Use |
|---|---|---|---|
| display | 24 / 32 | 600, −0.02em | Page title, one per page |
| section | 16 / 24 | 600 | Section headings |
| body | 14 / 22 | 450 | Default text, table cells, buttons |
| label | 14 / 22 | 550 | Row titles, attention items |
| meta | 13 / 18 | 400 | Timestamps, captions, axis ticks |
| prose | 16 / 26 | 450 | Docs and runbooks, 68 characters wide |
| data | 13 / 22 mono | 400 | Technical values |

The scale is tight (about 1.2) because product screens carry many text elements. Nothing is ever set below 12 px. Body uses weight 450 so text holds its shape on dark backgrounds; do not turn on `-webkit-font-smoothing: antialiased`, which thins light-on-dark text.

## Width

Keep Mona Sans at 100% width everywhere in the interface. Width 104% is allowed for page titles only. Do not condense tables: give them room instead.

## Do

- `10.0.10.24:8080` in mono; "Hermes gateway" in Mona Sans.
- Units next to numbers: "27.1 / 32 GiB", "1.8 s".

## Don't

- Mono for headings, labels or decoration.
- Uppercase tracked labels above headings.
