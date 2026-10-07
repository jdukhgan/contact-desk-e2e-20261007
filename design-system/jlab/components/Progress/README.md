# Progress

Spinners only inside buttons and small inline slots. Long tasks get a determinate bar with time left. Avatars identify who acted: you, the agent, or Codex and Claude sessions.

## Progress

- **Build with:** shadcn `progress`
- **Variants:** determinate, indeterminate
- **Rules:** 4 px, label with time left

## Spinner

- **Build with:** lucide `Loader`
- **Variants:** 12, 16, 20
- **Rules:** Only inside buttons and small inline slots; 700 ms per turn

## Count badge

- **Build with:** composed
- **Variants:** neutral, warning, destructive
- **Rules:** 18 px pill, mono

## Avatar

- **Build with:** shadcn `avatar`
- **Variants:** you, agent, Codex, Claude
- **Rules:** 24 px, overlapping with a 2 px background ring

## Tokens used

`bg`, `degraded`, `down`, `hover`, `info`, `text-2`, `text-3`
