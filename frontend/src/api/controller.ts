import type { Contact, ContactInput, Owner, SaveResult, DeleteResult, ApiError } from '../lib/contacts';
type Snapshot = {contacts: Contact[]; owners: Owner[]; loadState: 'loading'|'ready'|'error'; loadError?: string};
type Request = (path: string, init?: RequestInit) => Promise<Response>;

/** The list is loaded once and filtered locally, so filter/selection changes never race fetches. */
export class ContactController {
  private snapshot: Snapshot = {contacts:[],owners:[],loadState:'loading'};
  private listeners = new Set<()=>void>();
  private generation=0;
  private abort?: AbortController;
  constructor(public request: Request = (path, init)=>fetch(path,init)) {}
  getSnapshot=()=>this.snapshot;
  subscribe=(listener:()=>void)=>{this.listeners.add(listener);return ()=>{this.listeners.delete(listener);};};
  private publish(next: Snapshot) {this.snapshot=next;this.listeners.forEach(listener=>listener());}
  dispose=()=>{this.generation++;this.abort?.abort();};
  load=async()=>{
    const generation=++this.generation;
    this.abort?.abort();const abort=new AbortController();this.abort=abort;
    this.publish({...this.snapshot,loadState:'loading',loadError:undefined});
    try {
      const [contactsRes,ownersRes]=await Promise.all([this.request('/api/contacts',{signal:abort.signal}),this.request('/api/owners',{signal:abort.signal})]);
      if(!contactsRes.ok || !ownersRes.ok) throw new Error('Could not load contacts. Try again.');
      const [contacts,owners]=await Promise.all([contactsRes.json(),ownersRes.json()]);
      if(generation!==this.generation) return;
      this.publish({contacts:contacts.contacts,owners:owners.owners,loadState:'ready'});
    } catch {
      if(generation===this.generation) this.publish({...this.snapshot,loadState:'error',loadError:'Could not load contacts. Check the server and retry.'});
    } finally {if(generation===this.generation) this.abort=undefined;}
  };
  private async error(res: Response): Promise<ApiError> {
    try {const body=await res.json();if(typeof body.error==='string') return {error:body.error,fields:body.fields};}catch { /* Non-JSON server/proxy error. */ }
    return {error:'The server could not complete the request. Try again.'};
  }
  save=async(id: number|null,input: ContactInput):Promise<SaveResult>=>{
    const res=await this.request(id===null?'/api/contacts':`/api/contacts/${id}`,{method:id===null?'POST':'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
    if(!res.ok) return {ok:false,...await this.error(res)};
    const {contact}=await res.json() as {contact:Contact};
    const pending=!!this.abort;this.dispose();
    this.publish({...this.snapshot,contacts:id===null?[contact,...this.snapshot.contacts]:this.snapshot.contacts.map(c=>c.id===id?contact:c)});
    if(pending) void this.load();
    return {ok:true,contact};
  };
  remove=async(id:number):Promise<DeleteResult>=>{
    const res=await this.request(`/api/contacts/${id}`,{method:'DELETE'});
    if(!res.ok) return {ok:false,...await this.error(res)};
    const pending=!!this.abort;this.dispose();
    this.publish({...this.snapshot,contacts:this.snapshot.contacts.filter(c=>c.id!==id)});
    if(pending) void this.load();
    return {ok:true};
  };
}
