import { describe, it, expect } from 'vitest';
import { ContactController } from './controller';
import { EMPTY_INPUT, type Contact } from '../lib/contacts';
const contact: Contact = {...EMPTY_INPUT,id:7,name:'Saved',createdAt:'2026-10-07T00:00:00Z',updatedAt:'2026-10-07T00:00:00Z'};
const deferred = () => {let resolve!: (value: Response)=>void; const promise=new Promise<Response>(r=>{resolve=r});return {promise,resolve};};
const response=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
describe('API controller',()=>{
  it('ignores an older load completing after retry',async()=>{
    const pending=[deferred(),deferred(),deferred(),deferred()];let calls=0;
    const store=new ContactController(()=>pending[calls++].promise);
    const first=store.load(), second=store.load();
    pending[2].resolve(response({contacts:[contact]}));pending[3].resolve(response({owners:[{id:1,name:'Owner'}]}));await second;
    pending[0].resolve(response({contacts:[]}));pending[1].resolve(response({owners:[]}));await first;
    expect(store.getSnapshot().contacts).toEqual([contact]);expect(store.getSnapshot().owners).toHaveLength(1);
  });
  it('retains contacts on save/delete failure and maps server field errors',async()=>{
    const store=new ContactController(async(path)=>path==='/api/owners'?response({owners:[]}):response({contacts:[contact]}));
    await store.load();
    store.request=async()=>response({error:'Invalid',fields:{name:'Required'}},400);
    expect(await store.save(7,EMPTY_INPUT)).toEqual({ok:false,error:'Invalid',fields:{name:'Required'}});
    expect((await store.remove(7)).ok).toBe(false);expect(store.getSnapshot().contacts).toEqual([contact]);
  });
  it('updates state from the saved response and deletes only the named contact',async()=>{
    const store=new ContactController(async(path)=>path==='/api/owners'?response({owners:[]}):response({contacts:[contact,{...contact,id:8}]}));await store.load();
    const updated={...contact,name:'Changed'};
    store.request=async()=>response({contact:updated});expect((await store.save(7,{...EMPTY_INPUT,name:'Changed'})).ok).toBe(true);
    expect(store.getSnapshot().contacts[0].name).toBe('Changed');
    store.request=async()=>new Response(null,{status:204});await store.remove(7);
    expect(store.getSnapshot().contacts.map(c=>c.id)).toEqual([8]);
  });
  it('shows load failure and recovers on retry',async()=>{
    const store=new ContactController(async()=>{throw new Error('offline');});await store.load();expect(store.getSnapshot().loadState).toBe('error');
    store.request=async(path)=>response(path==='/api/owners'?{owners:[]}:{contacts:[]});await store.load();expect(store.getSnapshot().loadState).toBe('ready');
  });
});
