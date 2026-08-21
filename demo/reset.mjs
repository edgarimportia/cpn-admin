// ═══════════════════════════════════════════════════════════════════
//  RESET del demo:
//  1. Borra TODAS las colecciones dinámicas del proyecto demo
//  2. Vuelve a correr seed.mjs para dejar el estado limpio
//
//  Se ejecuta desde GitHub Action a las 4am Lima cada día.
//  Requiere env FIREBASE_REFRESH_TOKEN (ver .github/workflows/reset-demo.yml).
// ═══════════════════════════════════════════════════════════════════
import { promises as fs } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJ = 'cpn-demo-comercial';

async function tk() {
  const rt = (process.env.FIREBASE_REFRESH_TOKEN || '').trim();
  console.log('[diag] env token len:', rt.length, rt ? 'prefix:' + rt.slice(0,4) : 'AUSENTE');
  if (rt) {
    const p = new URLSearchParams({grant_type:'refresh_token', client_id:'563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com', client_secret:'j9iVZfS8kkCEFUPaAeJV0sAi', refresh_token: rt});
    const r = await fetch('https://oauth2.googleapis.com/token', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:p.toString()});
    return (await r.json()).access_token;
  }
  // Fallback: usar el CLI local (dev machine)
  const home = process.env.USERPROFILE || process.env.HOME;
  const cfg = JSON.parse(await fs.readFile(home + '/.config/configstore/firebase-tools.json', 'utf8'));
  const p = new URLSearchParams({grant_type:'refresh_token', client_id:'563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com', client_secret:'j9iVZfS8kkCEFUPaAeJV0sAi', refresh_token: cfg.tokens.refresh_token});
  const r = await fetch('https://oauth2.googleapis.com/token', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:p.toString()});
  return (await r.json()).access_token;
}

const TOKEN = await tk();
const H = { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' };

// Borrar todos los documentos de una colección
async function borrarColeccion(coleccion) {
  const nombres = [];
  let pt = null;
  do {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJ}/databases/(default)/documents/${coleccion}?pageSize=300` + (pt?'&pageToken='+pt:'');
    const r = await fetch(url, {headers:H});
    const j = await r.json();
    for (const doc of (j.documents||[])) nombres.push(doc.name);
    pt = j.nextPageToken || null;
  } while (pt);
  if (!nombres.length) { console.log('  ' + coleccion + ': ya vacía'); return; }
  const writes = nombres.map(n => ({ delete: n }));
  for (let i=0; i<writes.length; i+=400) {
    const chunk = writes.slice(i, i+400);
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJ}/databases/(default)/documents:batchWrite`, {
      method:'POST', headers:H, body: JSON.stringify({ writes: chunk })
    });
    if (!r.ok) console.error('  borrado falló:', await r.text());
  }
  console.log('  ' + coleccion + ': ' + nombres.length + ' docs borrados');
}

console.log('🧹 Limpiando Firestore de demo...');
const COLECCIONES = ['cpn_ventas', 'cpn_productos', 'cpn_config', 'cpn_cobros', 'cpn_compras', 'cpn_cotizaciones', 'cpn_snapshots'];
for (const c of COLECCIONES) await borrarColeccion(c);

console.log('');
console.log('🌱 Re-corriendo seed...');
const seedPath = join(__dirname, 'seed.mjs');
const proc = spawn('node', [seedPath], { stdio: 'inherit', env: { ...process.env, FIREBASE_REFRESH_TOKEN: process.env.FIREBASE_REFRESH_TOKEN || '' } });
await new Promise((resolve, reject) => {
  proc.on('exit', code => code === 0 ? resolve() : reject(new Error('seed exit ' + code)));
});

console.log('');
console.log('✅ Reset completo. Demo en estado limpio.');
