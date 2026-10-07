# Independent code review — Changes required

Task: 3f11e79e-13dd-4352-a7bf-072dc2c64364. Reviewer session: 286f3df6-0f3d-4c36-a6b2-1d5ba2c7cc1a.
Source: f3af9c36d9832206c6b11d234c183e8b9117529b, branch feature/project-kickoff-cont-3f11e7.
Checkout: /home/kandev/.kandev/tasks/task-3f11e79e-13dd-4352-a7bf-072dc2c64364.

Read the project binding, Reviewer role, README requirements, native delivery plan, implementation handoff, integrated frontend, backend and tests. Reviewed validation, parameterized SQL and literal Unicode search, AND filters, seed transaction/marker, restart lifecycle, unrelated-contact preservation, controller generations/aborts, failed mutations and UI error handling. No production source was modified. No recursive review or extra task/session was created. Semble is not callable in this session's tool catalog; used direct file inspection as the recorded fallback.

## Findings

1. **Major — persistent Unicode corruption**, server/index.mjs:14. Each request Buffer is converted to a string independently. A valid UTF-8 character split across chunks becomes replacement characters. POST of `Zoë Review`, split inside `ë`, returned 201 and stored `Zo�� Review` on three independent attempts. This also affects PUT and every text field. Decode the bounded complete byte sequence or use a streaming decoder; add a split-multibyte regression.
2. **Minor — update/delete race violates 404 contract**, server/index.mjs:52–53. The contact existence check occurs before awaiting the request body. DELETE during that wait returns 204, then PUT dereferences an undefined contact and returns 500. Recheck existence after the await and cover the interleaving.

Both findings were published as native file-anchored comments. Finding 1 blocks Review approval; return to Implement for corrections and re-review the resulting exact revision.

## Independent checks

- Initial git status: clean; HEAD matched the required full revision.
- `npm ci --offline --prefix frontend`: exit 0, 88 installed packages, audit reported zero vulnerabilities.
- `npm run build`: exit 0; TypeScript and Vite passed, 1971 modules.
- Initial sandboxed `npm test`: exit 1. Direct `node tests/server.test.mjs` exposed `listen EPERM` on loopback. This was an execution restriction, not an application assertion failure.
- `npm test` with approved loopback execution: exit 0; one actual HTTP/SQLite/static/restart integration scenario plus eight frontend tests passed.
- `node artifacts/review/f3af9c36d9832206c6b11d234c183e8b9117529b/request-boundaries.mjs` with approved loopback execution: exit 0; diagnostic script completed and reproduced the defects below. Exit 0 is diagnostic execution success, not a product pass.

```json
{"case":"split-utf8","attempt":1,"expected":"Zoë Review","status":201,"returned":"Zo�� Review","persisted":"Zo�� Review"}
{"case":"split-utf8","attempt":2,"expected":"Zoë Review","status":201,"returned":"Zo�� Review","persisted":"Zo�� Review"}
{"case":"split-utf8","attempt":3,"expected":"Zoë Review","status":201,"returned":"Zo�� Review","persisted":"Zo�� Review"}
{"case":"delete-during-put-body","deletionStatus":204,"expectedUpdateStatus":404,"actualUpdateStatus":500,"error":"The server could not complete the request. Try again."}
```

The reproduction stopped and awaited its owned server and removed its disposable database directory. Existing integration tests also cleaned up their resources. No browser/server was retained. Evidence files are separate from production source and remain uncommitted for the next stage to preserve as appropriate.

Browser functional verification (D4), final Designer acceptance (D5), Lead acceptance (D6) remain unverified. No deployment or external merge was performed. Do not signal Review completion on this revision.
