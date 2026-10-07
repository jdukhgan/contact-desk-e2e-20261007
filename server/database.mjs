import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export function openDatabase(path) {
  mkdirSync(dirname(path), {recursive:true});
  const db = new DatabaseSync(path);
  db.function('search_fold', {deterministic:true}, value=>String(value).toLowerCase());
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS owners(id INTEGER PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS contacts(
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL CHECK(length(trim(name))>0),
      email TEXT NOT NULL DEFAULT '', company TEXT NOT NULL DEFAULT '',
      ownerId INTEGER REFERENCES owners(id), status TEXT NOT NULL DEFAULT 'New' CHECK(status IN ('New','Active','Archived')),
      notes TEXT NOT NULL DEFAULT '', createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS metadata(key TEXT PRIMARY KEY, value TEXT NOT NULL);`);
  if (!db.prepare("SELECT value FROM metadata WHERE key='seed-v1'").get()) {
    db.exec('BEGIN IMMEDIATE');
    try {
      db.prepare('INSERT INTO owners(id,name) VALUES (?,?)').run(1,'Mara Okafor');
      db.prepare('INSERT INTO owners(id,name) VALUES (?,?)').run(2,'Jonas Weber');
      const insert=db.prepare('INSERT INTO contacts(name,email,company,ownerId,status,notes,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?)');
      const names=['Priya Raman','Tomás Herrera','Linnea Åkesson','Ibrahim Nasser','Chloe Bergmann','Dev Patel'];
      const companies=['Harbor Lane Studio','Copper Kettle Roasters','North Fjord Logistics','Saltmarsh Books','Lumen Works','Quarry & Stone Architects'];
      const owners=[1,2,1,2,null,1], statuses=['Active','New','Active','Archived','New','Active'];
      const timestamp=new Date().toISOString();
      names.forEach((name,i)=>insert.run(name,`contact${i+1}@example.invalid`,companies[i],owners[i],statuses[i],'Fictional demonstration contact.',timestamp,timestamp));
      db.prepare("INSERT INTO metadata VALUES ('seed-v1','complete')").run();
      db.exec('COMMIT');
    } catch(error) {db.exec('ROLLBACK'); db.close(); throw error;}
  }
  return db;
}

export function validateInput(body, db) {
  if(!body || typeof body!=='object' || Array.isArray(body)) return {error:'Expected a contact object.'};
  const fields={}, input={};
  for(const field of ['name','email','company','notes']) {
    const value=body[field]===undefined && field!=='name'?'':body[field];
    if(typeof value!=='string') fields[field]='Enter text for this field.';
    else input[field]=value.trim();
  }
  if(typeof input.name==='string' && !input.name) fields.name='Enter a name for this contact.';
  if(input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) fields.email='Enter an email like name@example.com, or leave it empty.';
  input.status=body.status===undefined?'New':body.status;
  if(!['New','Active','Archived'].includes(input.status)) fields.status='Choose New, Active or Archived.';
  input.ownerId=body.ownerId===undefined?null:body.ownerId;
  if(input.ownerId!==null && (!Number.isSafeInteger(input.ownerId) || !db.prepare('SELECT id FROM owners WHERE id=?').get(input.ownerId))) fields.ownerId='Choose an existing owner or Unassigned.';
  return Object.keys(fields).length?{error:'Check the highlighted fields.',fields}:{input};
}
