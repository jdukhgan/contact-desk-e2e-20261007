# AgentPanel

The signature pattern, broken into parts. The agent reads freely and shows its work. Every change is a proposal you approve, and every applied change can be undone.

## Agent panel

- **Build with:** composed
- **Rules:** Header with model chip; your messages in raised bubbles, agent text plain; composer with context chips; footer note "Every change needs your approval"

## Agent steps

- **Build with:** jlab `AgentSteps`
- **Variants:** running, done, failed
- **Rules:** Timings in mono; failed step shows its reason

## Proposal card

- **Build with:** jlab `ProposalCard`
- **Variants:** proposed, applied, failed
- **Rules:** Diff, file, side effect; Approve and Dismiss; applied shows what it watches plus Undo; failed shows reason plus Retry

## Tokens used

`bg`, `down-bg`, `down-text`, `down`, `line-strong`, `line`, `panel`, `primary-text`, `primary`, `raised`, `running-bg`, `running`, `text-2`, `text-3`
