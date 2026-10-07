# Menu

Menus float on the raised layer with one soft shadow and scale in from their trigger in 150 ms. Tooltips wait 400 ms the first time, then open instantly.

## Dropdown menu

- **Build with:** shadcn `dropdown-menu`
- **Rules:** `bg-popover rounded-lg shadow-pop p-1`; items 30 px, radius 6, shortcut right; disabled items keep their reason; destructive last, below a separator, in `destructive-foreground`
- **Keyboard:** Arrows, letters

## Context menu

- **Build with:** shadcn `context-menu`
- **Rules:** Same as the row's action menu

## Tooltip

- **Build with:** shadcn `tooltip`
- **Rules:** 400 ms first delay, then instant (`skipDelayDuration`); shows shortcut

## Hover card

- **Build with:** shadcn `hover-card`
- **Rules:** Explains a number; label column plus mono values

## Tokens used

`down-text`, `hover`, `line-strong`, `line`, `pop`, `raised`, `text-2`, `text-3`, `text`
