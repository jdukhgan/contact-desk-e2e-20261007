# The agent pattern

The signature pattern of JLab. An agent panel sits to the right of the content and can read the whole lab. It never changes anything without your approval.

1. **Steps.** Each tool call shows as a row with a check, a spinner or a cross, and its duration in mono. Running steps never collapse; a failed step shows its reason underneath.
2. **Answer.** Short and specific, with values in mono. Your messages sit in raised bubbles; the agent's are plain text.
3. **Proposal.** A diff with the file name, the side effect stated before you act, then Approve and Dismiss.
4. **Applied.** A green check, what it is watching and for how long, and Undo.
5. **Failed.** The reason in plain words, Retry and View log.

The composer adds the current page as context automatically. The footer always reads "The agent can read the whole lab. Every change needs your approval."

See the **AgentPanel** component and the **OverviewTemplate**.
