import { spawn } from 'node:child_process';
import { request } from 'node:http';
import { once } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const dir = await mkdtemp(join(tmpdir(), 'contact-review-'));
const child = spawn(process.execPath, ['server/index.mjs'], {
  env: { ...process.env, HOST: '127.0.0.1', PORT: '0', DB_PATH: join(dir, 'review.db') },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let errors = '';
child.stderr.on('data', chunk => { errors += chunk; });
try {
  const base = await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error('Startup timed out')), 5000);
    child.once('exit', () => { clearTimeout(timer); reject(new Error(errors)); });
    child.stdout.on('data', chunk => {
      output += chunk;
      const match = output.match(/http:\/\/127\.0\.0\.1:\d+/);
      if (match) { clearTimeout(timer); resolve(match[0]); }
    });
  });
  const send = async (path, method, chunks, between = () => delay(80)) => {
    const req = request(base + path, { method, headers: { 'Content-Type': 'application/json' } });
    const result = new Promise((resolve, reject) => {
      req.on('error', reject);
      req.on('response', res => {
        let text = '';
        res.setEncoding('utf8');
        res.on('data', chunk => { text += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, body: text ? JSON.parse(text) : null }));
      });
    });
    req.write(chunks[0]);
    await between();
    req.end(chunks[1]);
    return result;
  };
  for (let attempt = 1; attempt <= 3; attempt++) {
    const bytes = Buffer.from(JSON.stringify({ name: 'Zoë Review', notes: 'Fictional request-boundary fixture.' }));
    const split = bytes.indexOf(Buffer.from('ë')) + 1;
    const result = await send('/api/contacts', 'POST', [bytes.subarray(0, split), bytes.subarray(split)]);
    const stored = await (await fetch(base + '/api/contacts/' + result.body.contact.id)).json();
    console.log(JSON.stringify({ case: 'split-utf8', attempt, expected: 'Zoë Review', status: result.status, returned: result.body.contact.name, persisted: stored.contact.name }));
  }
  const contact = await (await fetch(base + '/api/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Concurrent Review' }) })).json();
  const path = '/api/contacts/' + contact.contact.id;
  let deletion;
  const update = await send(path, 'PUT', [Buffer.from('{"name":"Edited'), Buffer.from(' Review"}')], async () => {
    await delay(80);
    deletion = (await fetch(base + path, { method: 'DELETE' })).status;
  });
  console.log(JSON.stringify({ case: 'delete-during-put-body', deletionStatus: deletion, expectedUpdateStatus: 404, actualUpdateStatus: update.status, error: update.body.error }));
} finally {
  if (child.exitCode === null) {
    const exited = once(child, 'exit');
    child.kill('SIGTERM');
    await exited;
  }
  await rm(dir, { recursive: true, force: true });
  console.log('Owned server stopped; disposable database directory removed.');
}
