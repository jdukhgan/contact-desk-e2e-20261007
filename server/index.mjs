import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDatabase, validateInput } from './database.mjs';

const db=openDatabase(resolve(process.env.DB_PATH || 'data/contact-desk.db'));
const staticRoot=fileURLToPath(new URL('../frontend/dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.woff2':'font/woff2','.png':'image/png','.svg':'image/svg+xml'};
const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(data===undefined?undefined:JSON.stringify(data));};
const getContact=id=>db.prepare('SELECT * FROM contacts WHERE id=?').get(id);
async function readBody(req) {
  const chunks=[];
  let size=0;
  for await(const chunk of req) {size+=chunk.length; if(size>65536) throw new Error('Request body is too large.'); chunks.push(chunk);}
  try{return JSON.parse(Buffer.concat(chunks,size).toString('utf8'));}catch{throw new Error('Invalid JSON body.');}
}
const server=createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    const path=url.pathname;
    if(path==='/health' && req.method==='GET') return json(res,200,{status:'ok'});
    if(path==='/api/owners' && req.method==='GET') return json(res,200,{owners:db.prepare('SELECT * FROM owners ORDER BY id').all()});
    if(path==='/api/contacts' && req.method==='GET') {
      const where=[],values=[];
      const q=(url.searchParams.get('q')||'').trim().toLowerCase();
      if(q) {where.push('(instr(search_fold(name),?)>0 OR instr(search_fold(company),?)>0 OR instr(search_fold(email),?)>0)');values.push(q,q,q);}
      const owner=url.searchParams.get('ownerId'), status=url.searchParams.get('status');
      if(owner) {
        if(owner==='none') where.push('ownerId IS NULL');
        else if(!/^[1-9]\d*$/.test(owner) || !Number.isSafeInteger(Number(owner))) return json(res,400,{error:'Invalid owner filter.'});
        else {where.push('ownerId=?');values.push(Number(owner));}
      }
      if(status) {if(!['New','Active','Archived'].includes(status)) return json(res,400,{error:'Invalid status filter.'});where.push('status=?');values.push(status);}
      return json(res,200,{contacts:db.prepare(`SELECT * FROM contacts ${where.length?'WHERE '+where.join(' AND '):''} ORDER BY id DESC`).all(...values)});
    }
    const match=path.match(/^\/api\/contacts\/([1-9]\d*)$/);
    const id=match?Number(match[1]):null;
    if(match && Number.isSafeInteger(id)) {
      if(!getContact(id)) return json(res,404,{error:'This contact no longer exists.'});
      if(req.method==='GET') return json(res,200,{contact:getContact(id)});
      if(req.method==='DELETE') {db.prepare('DELETE FROM contacts WHERE id=?').run(id);return json(res,204);}
    }
    if((path==='/api/contacts' && req.method==='POST') || (match && Number.isSafeInteger(id) && req.method==='PUT')) {
      let body;try{body=await readBody(req);}catch(error){return json(res,400,{error:error.message});}
      const result=validateInput(body,db);
      if(result.error) return json(res,400,result);
      const c=result.input, now=new Date().toISOString();
      if(req.method==='POST') {
        const saved=db.prepare('INSERT INTO contacts(name,email,company,ownerId,status,notes,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?)').run(c.name,c.email,c.company,c.ownerId,c.status,c.notes,now,now);
        return json(res,201,{contact:getContact(Number(saved.lastInsertRowid))});
      }
      const previous=getContact(id);
      if(!previous) return json(res,404,{error:'This contact no longer exists.'});
      const updated=new Date(Math.max(Date.now(),Date.parse(previous.updatedAt)+1)).toISOString();
      db.prepare('UPDATE contacts SET name=?,email=?,company=?,ownerId=?,status=?,notes=?,updatedAt=? WHERE id=?').run(c.name,c.email,c.company,c.ownerId,c.status,c.notes,updated,id);
      return json(res,200,{contact:getContact(id)});
    }
    if(path.startsWith('/api/') || path==='/health') return json(res,404,{error:'Endpoint not found.'});
    if(!['GET','HEAD'].includes(req.method)) return json(res,405,{error:'Method not allowed.'});
    let file=path==='/'?resolve(staticRoot,'index.html'):resolve(staticRoot,'.'+decodeURIComponent(path));
    if(!file.startsWith(staticRoot.endsWith(sep)?staticRoot:staticRoot+sep)) return json(res,404,{error:'Not found.'});
    let data;
    try {data=await readFile(file);} catch {if(extname(path)) return json(res,404,{error:'Not found.'});file=resolve(staticRoot,'index.html');try{data=await readFile(file);}catch{return json(res,503,{error:'Frontend is not built. Run npm run build.'});}}
    res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:data);
  } catch(error) {console.error('Request failed:',error.message);if(!res.headersSent) json(res,500,{error:'The server could not complete the request. Try again.'});else res.end();}
});
server.listen(Number(process.env.PORT||3000),process.env.HOST||'127.0.0.1',()=>console.log(`Contact Desk: http://127.0.0.1:${server.address().port}`));
for(const signal of ['SIGTERM','SIGINT']) process.on(signal,()=>server.close(()=>{db.close();process.exit(0);}));
