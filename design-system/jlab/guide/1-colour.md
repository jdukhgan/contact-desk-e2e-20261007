# Colour

JLab is neutral first. Four surface layers do the structure; colour is reserved for status and data, so an amber dot is impossible to miss.

## Surfaces

| Layer | Token | Holds |
|---|---|---|
| 0 | `bg` | App background, sidebar, status line |
| 1 | `panel` | Content panel, agent panel, boxes, tables |
| 2 | `raised` | Buttons, menus, toasts, hovered rows |
| 2 | `hover` | Hover and current state on nav and menu items |

Borders use `line` for dividers, `line-strong` for controls and `line-heavy` for unchecked checkboxes and input hover.

## Text

`text` for primary content, `text-2` for secondary content and table headers, `text-3` only for genuine metadata such as timestamps and axis ticks. `text-2` is about 8:1 and `text-3` about 6:1 on `panel`. When in doubt use `text-2`: grey text at small sizes reads fainter than its ratio suggests. Never use a status colour for ordinary text.

## Status

| Status | Dot | Word colour | Tint |
|---|---|---|---|
| Running | `running` | `text-2` (healthy stays quiet) | `running-bg` |
| Degraded | `degraded` | `degraded` | `degraded-bg` |
| Down | `down` | `down-text` | `down-bg` |
| Stopped, Stale | hollow `stopped` ring | `text-3` | none |
| Working | dashed `info` ring | `info` | none |

Capacity follows the same scale: neutral fill below 80%, `degraded` from 80%, `down` from 95%.

## Data series

`series-1` to `series-5`, always in that order, distinct from status colours and from each other in both themes. Five at most; group the rest as Other.

## Primary and focus

The primary button is inverted: `primary` fill with `primary-text`. Focus is a 2 px `focus` ring with a 2 px gap. Selected table rows use `info` at 7%.
