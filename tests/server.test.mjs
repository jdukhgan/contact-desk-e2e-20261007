import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { request as httpRequest } from 'node:http';
import { setTimeout as delay } from 'node:timers/promises';

async function start(db) {
  const child = spawn(process.execPath, ['server/index.mjs'], {env:{...process.env, PORT:'0', DB_PATH:db}, stdio:['ignore','pipe','pipe']});
  let output = '', errors = '';
  child.stderr.on('data', chunk => errors += chunk);
  const url = await new Promise((resolve,reject) => {
    const timer = setTimeout(() => {child.kill(); reject(new Error(`Startup timeout: ${errors}`));}, 5000);
    child.once('exit', code => {clearTimeout(timer); reject(new Error(`Startup exit ${code}: ${errors}`));});
    child.stdout.on('data', chunk => {output += chunk; const match = output.match(/http:\/\/127\.0\.0\.1:\d+/); if(match){clearTimeout(timer); resolve(match[0]);}});
  });
  return {url, stop:async()=>{const done=once(child,'exit'); child.kill('SIGTERM'); await done;}};
}

test('HTTP CRUD, validation, AND filters, literal search and restart persistence', async () => {
  const dir = await mkdtemp(join(tmpdir(),'contact-desk-'));
  let app;
  try {
    app = await start(join(dir,'contacts.db'));
    const request = async(path, method='GET', body) => {
      const res = await fetch(app.url+path,{method,headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
      return {status:res.status, data:res.status===204?null:await res.json()};
    };
    assert.deepEqual((await request('/health')).data,{status:'ok'});
    const page=await fetch(app.url);
    assert.equal(page.status,200);
    const html=await page.text();
    assert.ok(html.includes('id="root"'));
    const asset=html.match(/src="([^"]+\.js)"/)[1];
    const script=await fetch(app.url+asset);
    assert.equal(script.status,200);
    assert.match(script.headers.get('content-type'),/javascript/);
    const owners=(await request('/api/owners')).data.owners;
    assert.equal(owners.length,2);
    const baseline=(await request('/api/contacts')).data.contacts;
    assert.equal(baseline.length,6);
    assert.deepEqual((await request('/api/contacts?q='+encodeURIComponent('ÅKESSON'))).data.contacts.map(c=>c.name),['Linnea Åkesson']);
    assert.ok(baseline.every(c=>c.email.endsWith('@example.invalid')));
    for(const input of [{name:' '},{name:2},{name:'Test',email:'invalid'},{name:'Test',email:null},{name:'Test',status:'Bad'},{name:'Test',ownerId:99},{name:'Test',company:[]},{name:'Test',notes:{}},null,[]]) {
      assert.equal((await request('/api/contacts','POST',input)).status,400);
    }
    const malformed = await fetch(app.url+'/api/contacts',{method:'POST',body:'{'});
    assert.equal(malformed.status,400);
    const created=await request('/api/contacts','POST',{name:' Literal %_ Test ',email:'test@example.invalid',company:'Distinct Company',ownerId:owners[0].id,status:'Active',notes:'persist me'});
    assert.equal(created.status,201);
    const contact=created.data.contact;
    assert.equal(contact.name,'Literal %_ Test');
    assert.equal((await request(`/api/contacts/${contact.id}`)).data.contact.id,contact.id);
    for(const query of ['literal','distinct company','TEST@EXAMPLE.INVALID','%_']) {
      assert.deepEqual((await request(`/api/contacts?q=${encodeURIComponent(query)}&ownerId=${owners[0].id}&status=Active`)).data.contacts.map(c=>c.id),[contact.id]);
    }
    assert.equal((await request('/api/contacts?q='+encodeURIComponent("' OR 1=1 --"))).data.contacts.length,0);
    assert.equal((await request('/api/contacts?status=bad')).status,400);
    assert.equal((await request('/api/contacts?ownerId=wat')).status,400);
    assert.equal((await request('/api/contacts?ownerId=none')).data.contacts.every(c=>c.ownerId===null),true);
    assert.equal((await request(`/api/contacts?q=Literal&ownerId=${owners[1].id}&status=Active`)).data.contacts.length,0);
    const edited=await request(`/api/contacts/${contact.id}`,'PUT',{...contact,name:'Edited contact',notes:'saved notes'});
    assert.equal(edited.status,200);
    assert.equal(edited.data.contact.createdAt,contact.createdAt);
    assert.ok(edited.data.contact.updatedAt>contact.updatedAt);
    assert.equal((await request(`/api/contacts/${contact.id}`,'PUT',{name:'',email:'bad'})).status,400);
    const deleteId=baseline[0].id;
    assert.equal((await request(`/api/contacts/${deleteId}`,'DELETE')).status,204);
    for(const method of ['GET','PUT','DELETE']) assert.equal((await request('/api/contacts/999999',method,method==='PUT'?{name:'Missing'}:undefined)).status,404);
    await app.stop(); app=await start(join(dir,'contacts.db'));
    const persisted=(await request('/api/contacts')).data.contacts;
    assert.equal(persisted.length,6);
    assert.ok(!persisted.some(c=>c.id===deleteId));
    assert.deepEqual(persisted.find(c=>c.id===contact.id),edited.data.contact);
    for(const original of baseline.slice(1)) assert.deepEqual(persisted.find(c=>c.id===original.id),original);
    for(const c of persisted) assert.equal((await request(`/api/contacts/${c.id}`,'DELETE')).status,204);
    await app.stop(); app=await start(join(dir,'contacts.db'));
    assert.deepEqual((await request('/api/contacts')).data.contacts,[]);
    assert.equal((await request('/api/owners')).data.owners.length,2);
  } finally {if(app) await app.stop(); await rm(dir,{recursive:true,force:true});}
});

test('chunked mutation bodies preserve Unicode, enforce byte limits and handle concurrent deletion', async () => {
  const dir = await mkdtemp(join(tmpdir(),'contact-boundaries-'));
  let app;
  try {
    app = await start(join(dir,'contacts.db'));
    const send = async (path, method, chunks, between = () => delay(80)) => {
      const req = httpRequest(app.url+path, {method, headers:{'Content-Type':'application/json'}});
      const result = new Promise((resolve,reject) => {
        req.on('error',reject);
        req.on('response',res => {
          let body='';
          res.setEncoding('utf8');
          res.on('data',chunk => body+=chunk);
          res.on('error',reject);
          res.on('end',() => resolve({status:res.statusCode, data:body?JSON.parse(body):null}));
        });
      });
      try {
        req.write(chunks[0]);
        await between();
        req.end(chunks[1]);
        return await result;
      } catch(error) {req.destroy(); await result.catch(()=>{}); throw error;}
    };
    const input={name:'Zoë Boundary',company:'東京',notes:'Fictional 🌍 fixture'};
    const bytes=Buffer.from(JSON.stringify(input));
    for(const character of ['ë','東','🌍']) {
      const offset=bytes.indexOf(Buffer.from(character));
      for(let split=offset+1;split<offset+Buffer.byteLength(character);split++) {
        const created=await send('/api/contacts','POST',[bytes.subarray(0,split),bytes.subarray(split)]);
        assert.equal(created.status,201);
        const path='/api/contacts/'+created.data.contact.id;
        for(const method of ['GET','PUT']) {
          const saved=method==='GET'
            ? {status:200,data:await (await fetch(app.url+path)).json()}
            : await send(path,method,[bytes.subarray(0,split),bytes.subarray(split)]);
          assert.equal(saved.status,200);
          for(const field of ['name','company','notes']) assert.equal(saved.data.contact[field],input[field]);
        }
        const persisted=await (await fetch(app.url+path)).json();
        for(const field of ['name','company','notes']) assert.equal(persisted.contact[field],input[field]);
      }
    }
    const oversized=Buffer.from(JSON.stringify({name:'Too large',notes:'ë'.repeat(33000)}));
    const rejected=await send('/api/contacts','POST',[oversized.subarray(0,40000),oversized.subarray(40000)]);
    assert.equal(rejected.status,400);
    assert.equal(rejected.data.error,'Request body is too large.');
    const baseline=(await (await fetch(app.url+'/api/contacts')).json()).contacts;
    const target=baseline[0];
    const path='/api/contacts/'+target.id;
    const update=await send(path,'PUT',[Buffer.from('{"name":"Edited'),Buffer.from(' Boundary"}')],async()=>{
      // Leave the PUT body incomplete while DELETE completes on another connection.
      await delay(80);
      assert.equal((await fetch(app.url+path,{method:'DELETE'})).status,204);
    });
    assert.equal(update.status,404);
    assert.equal(update.data.error,'This contact no longer exists.');
    assert.equal((await fetch(app.url+path)).status,404);
    assert.deepEqual((await (await fetch(app.url+'/api/contacts')).json()).contacts,baseline.slice(1));
  } finally {if(app) await app.stop(); await rm(dir,{recursive:true,force:true});}
});
