# Motion

Fast, purposeful, and absent where it would slow daily use. Based on Emil Kowalski's design engineering rules.

| Moment | Motion |
|---|---|
| Press on any button, chip or nav item | scale 0.97, 150 to 160 ms, `cubic-bezier(.23,1,.32,1)` |
| Menus and popovers | fade and scale from 0.97, from their trigger, 150 ms |
| Agent panel, sidebar, drawer | 200 ms, `cubic-bezier(.32,.72,0,1)` |
| Agent steps appearing | fade and 4 px rise, 180 ms, 40 ms stagger |
| Tooltips | 400 ms first delay, then instant on neighbours |
| Command palette, keyboard actions | none |
| Reduced motion | opacity and colour only |

Rules: never animate from `scale(0)`; never use ease-in for interface motion; hover effects only on devices with a fine pointer; exits faster than entrances.
