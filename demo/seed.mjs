// ═══════════════════════════════════════════════════════════════════
//  SEED del demo: puebla el Firestore "cpn-demo-comercial" con
//  datos ficticios verosímiles del "Bazar Don Pepe".
//  Se ejecuta on-demand (arranque) y también desde reset.mjs cada noche.
// ═══════════════════════════════════════════════════════════════════
import { promises as fs } from 'node:fs';

const PROJ = 'cpn-demo-comercial';
const HOY = new Date().toISOString().slice(0,10); // YYYY-MM-DD
const AYER = new Date(Date.now() - 86400000).toISOString().slice(0,10);
const ANTEAYER = new Date(Date.now() - 2*86400000).toISOString().slice(0,10);

async function tk() {
  let rt = process.env.FIREBASE_REFRESH_TOKEN;
  if (!rt) {
    const home = process.env.USERPROFILE || process.env.HOME;
    const cfg = JSON.parse(await fs.readFile(home + '/.config/configstore/firebase-tools.json', 'utf8'));
    rt = cfg.tokens.refresh_token;
  }
  const p = new URLSearchParams({grant_type:'refresh_token', client_id:'563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com', client_secret:'j9iVZfS8kkCEFUPaAeJV0sAi', refresh_token: rt});
  const r = await fetch('https://oauth2.googleapis.com/token', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:p.toString()});
  return (await r.json()).access_token;
}
function toFV(v){
  if(v===null||v===undefined) return { nullValue: null };
  if(typeof v==='string') return { stringValue: v };
  if(typeof v==='boolean') return { booleanValue: v };
  if(typeof v==='number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if(Array.isArray(v)) return { arrayValue: { values: v.map(toFV) } };
  if(typeof v==='object'){ const f={}; for(const[k,val] of Object.entries(v)) if(val!==undefined) f[k]=toFV(val); return { mapValue: { fields: f } }; }
  return { stringValue: String(v) };
}

const H = { Authorization: 'Bearer ' + (await tk()), 'Content-Type': 'application/json' };

// ── 1. PRODUCTOS (30 productos surtidos) ─────────────────────────
const CATEGORIAS_WEB = ['Abarrotes', 'Bebidas', 'Limpieza', 'Snacks', 'Aseo Personal', 'Bebé', 'Panadería', 'Congelados'];
const productos = [
  // Abarrotes
  { sku:'ABA-0001', nombre:'Arroz Costeño 5 kg',        categoria:'Abarrotes', precio:26.00, costoBase:22.00, stockUnidades:40, stockCajas:3, udsPorCaja:10, imagen:'https://i.imgur.com/xJt9gJd.jpeg' },
  { sku:'ABA-0002', nombre:'Azúcar Rubia 1 kg',         categoria:'Abarrotes', precio:5.50,  costoBase:4.20, stockUnidades:80, stockCajas:0, imagen:'' },
  { sku:'ABA-0003', nombre:'Aceite Primor 1 l',         categoria:'Abarrotes', precio:12.90, costoBase:10.50, stockUnidades:35, stockCajas:2, udsPorCaja:12, imagen:'' },
  { sku:'ABA-0004', nombre:'Fideos Don Vittorio 500 g', categoria:'Abarrotes', precio:4.20,  costoBase:3.10, stockUnidades:120, stockCajas:0, imagen:'' },
  { sku:'ABA-0005', nombre:'Atún Florida Lata 170 g',   categoria:'Abarrotes', precio:6.90,  costoBase:5.40, stockUnidades:60, stockCajas:0, imagen:'' },
  { sku:'ABA-0006', nombre:'Menestras Frejol 500 g',    categoria:'Abarrotes', precio:8.50,  costoBase:6.80, stockUnidades:25, stockCajas:0, imagen:'' },
  // Bebidas
  { sku:'BEB-0001', nombre:'Inca Kola 1.5 L',           categoria:'Bebidas',   precio:7.50,  costoBase:5.90, stockUnidades:90, stockCajas:5, udsPorCaja:6, imagen:'' },
  { sku:'BEB-0002', nombre:'Coca Cola 2 L',             categoria:'Bebidas',   precio:8.90,  costoBase:6.90, stockUnidades:70, stockCajas:4, udsPorCaja:6, imagen:'' },
  { sku:'BEB-0003', nombre:'Agua Cielo 625 ml',         categoria:'Bebidas',   precio:1.50,  costoBase:0.90, stockUnidades:200, stockCajas:0, imagen:'' },
  { sku:'BEB-0004', nombre:'Cerveza Pilsen Callao Lata 355 ml', categoria:'Bebidas', precio:6.50, costoBase:4.80, stockUnidades:0, stockCajas:8, udsPorCaja:24, imagen:'' },
  { sku:'BEB-0005', nombre:'Frugos Naranja 1 L',        categoria:'Bebidas',   precio:5.90,  costoBase:4.20, stockUnidades:45, stockCajas:0, imagen:'' },
  // Limpieza
  { sku:'LIM-0001', nombre:'Detergente Bolívar 4 kg',   categoria:'Limpieza',  precio:38.90, costoBase:32.00, stockUnidades:18, stockCajas:0, imagen:'' },
  { sku:'LIM-0002', nombre:'Lejía Sapolio 1 L',         categoria:'Limpieza',  precio:6.50,  costoBase:4.90, stockUnidades:50, stockCajas:0, imagen:'' },
  { sku:'LIM-0003', nombre:'Papel Higiénico Suave 4 rollos', categoria:'Limpieza', precio:8.90, costoBase:6.50, stockUnidades:65, stockCajas:0, imagen:'' },
  { sku:'LIM-0004', nombre:'Jabón Bolívar Barra 250 g', categoria:'Limpieza',  precio:3.20,  costoBase:2.30, stockUnidades:80, stockCajas:0, imagen:'' },
  // Snacks
  { sku:'SNA-0001', nombre:'Papas Lays Original 145 g', categoria:'Snacks',    precio:6.90,  costoBase:5.20, stockUnidades:40, stockCajas:0, imagen:'' },
  { sku:'SNA-0002', nombre:'Galletas Casino 43 g',      categoria:'Snacks',    precio:1.20,  costoBase:0.80, stockUnidades:150, stockCajas:2, udsPorCaja:36, imagen:'' },
  { sku:'SNA-0003', nombre:'Chocolate Sublime 30 g',    categoria:'Snacks',    precio:2.50,  costoBase:1.80, stockUnidades:100, stockCajas:0, imagen:'' },
  { sku:'SNA-0004', nombre:'Chizitos Bolsa 32 g',       categoria:'Snacks',    precio:1.80,  costoBase:1.20, stockUnidades:80, stockCajas:0, imagen:'' },
  // Aseo personal
  { sku:'ASE-0001', nombre:'Shampoo Pantene 400 ml',    categoria:'Aseo Personal', precio:22.90, costoBase:18.00, stockUnidades:30, stockCajas:0, imagen:'' },
  { sku:'ASE-0002', nombre:'Pasta Colgate Total 12 75 ml', categoria:'Aseo Personal', precio:9.90, costoBase:7.50, stockUnidades:55, stockCajas:0, imagen:'' },
  { sku:'ASE-0003', nombre:'Desodorante Rexona Barra 50 g', categoria:'Aseo Personal', precio:14.90, costoBase:11.00, stockUnidades:35, stockCajas:0, imagen:'' },
  // Bebé
  { sku:'BEB-1001', nombre:'Pañales Huggies M x 40',    categoria:'Bebé',      precio:59.90, costoBase:48.00, stockUnidades:15, stockCajas:0, imagen:'' },
  { sku:'BEB-1002', nombre:'Toallitas Húmedas Babysec 100 u', categoria:'Bebé', precio:14.50, costoBase:11.00, stockUnidades:22, stockCajas:0, imagen:'' },
  // Panadería
  { sku:'PAN-0001', nombre:'Pan Francés x 20',          categoria:'Panadería', precio:6.00,  costoBase:3.50, stockUnidades:0, stockCajas:0, imagen:'' },
  { sku:'PAN-0002', nombre:'Pan de Yema x 6',           categoria:'Panadería', precio:5.00,  costoBase:2.80, stockUnidades:0, stockCajas:0, imagen:'' },
  // Congelados
  { sku:'CON-0001', nombre:'Pollo Trozado San Fernando 1 kg', categoria:'Congelados', precio:15.90, costoBase:13.00, stockUnidades:20, stockCajas:0, imagen:'' },
  { sku:'CON-0002', nombre:'Salchicha Otto Kunz 1 kg',  categoria:'Congelados', precio:18.90, costoBase:15.50, stockUnidades:12, stockCajas:0, imagen:'' },
  { sku:'CON-0003', nombre:'Hielo Bolsa 3 kg',          categoria:'Congelados', precio:5.50,  costoBase:3.00, stockUnidades:25, stockCajas:0, imagen:'' },
  { sku:'CON-0004', nombre:'Helado D\'Onofrio Lt 1 L',  categoria:'Congelados', precio:24.90, costoBase:19.00, stockUnidades:8, stockCajas:0, imagen:'' },
];

productos.forEach((p, i) => {
  p.id = 'p' + String(i+1).padStart(4, '0');
  p.estado = 'activo';
  p.categoriaWeb = p.categoria;
  p.creado = HOY;
});

// ── 2. USUARIOS (esquema exacto del entrar.html: username + hashPassword) ─
import { webcrypto } from 'node:crypto';
function randomSalt(bytes = 16) {
  const arr = new Uint8Array(bytes);
  webcrypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}
async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(password + '::' + salt);
  const hash = await webcrypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
const _usuariosBase = [
  { username:'demo',    rol:'admin',    nombre:'Demo Admin',      pass:'demo123' },
  { username:'sandra',  rol:'admin',    nombre:'Sandra Torres',   pass:'demo123' },
  { username:'carlos',  rol:'vendedor', nombre:'Carlos Ramos',    pass:'demo123' },
  { username:'lucia',   rol:'vendedor', nombre:'Lucía Fernández', pass:'demo123' },
  { username:'jose',    rol:'vendedor', nombre:'José Mendoza',    pass:'demo123' },
  { username:'ana',     rol:'vendedor', nombre:'Ana Vega',        pass:'demo123' },
];
const usuarios = [];
for (const u of _usuariosBase) {
  const salt = randomSalt();
  const passwordHash = await hashPassword(u.pass, salt);
  usuarios.push({ username: u.username, rol: u.rol, nombre: u.nombre, salt, passwordHash });
}

// ── 3. CLIENTES (10) ──────────────────────────────────────────────
const clientes = [
  { nombre:'María Chávez',       telefono:'987654321', ubicacion:'Los Olivos' },
  { nombre:'Juan Pérez',         telefono:'987112233', ubicacion:'San Juan de Lurigancho' },
  { nombre:'Roberto Silva',      telefono:'999888777', ubicacion:'Comas' },
  { nombre:'Patricia Núñez',     telefono:'955443322', ubicacion:'Independencia' },
  { nombre:'Luis Quispe',        telefono:'944556677', ubicacion:'Puente Piedra' },
  { nombre:'Rosa Vargas',        telefono:'933221100', ubicacion:'Callao' },
  { nombre:'Miguel Torres',      telefono:'922334455', ubicacion:'San Martín de Porres' },
  { nombre:'Carmen Alarcón',     telefono:'911223344', ubicacion:'Los Olivos' },
  { nombre:'Diego Ramírez',      telefono:'977665544', ubicacion:'Rímac' },
  { nombre:'Sofía Castro',       telefono:'966554433', ubicacion:'Ate' },
];
clientes.forEach((c, i) => { c.id = 'c' + String(i+1).padStart(3,'0'); c.creado = HOY; });

// ── 4. VENTAS históricas (últimos 3 días, ~25 ventas) ─────────────
const ventas = [];
const METODOS = ['Efectivo', 'Yape', 'Plin', 'BCP Transferencia'];
function rndItem(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function rndInt(a,b){ return a + Math.floor(Math.random()*(b-a+1)); }
function ventaFake(fecha, hora, vendedor) {
  const n = rndInt(1,3);
  const items = [];
  for (let i=0; i<n; i++) {
    const p = rndItem(productos);
    const cant = rndInt(1, 3);
    items.push({
      productoId: p.id, nombre: p.nombre, categoria: p.categoria, sku: p.sku,
      precio: p.precio, cantidad: cant, tipoUnidad: 'unidad', imagen: p.imagen || ''
    });
  }
  const total = items.reduce((s, it) => s + it.precio * it.cantidad, 0);
  return {
    id: 'v' + Math.random().toString(36).slice(2, 10),
    fecha, hora, vendedor, metodo: rndItem(METODOS),
    cliente: rndItem(clientes),
    items, total, adelanto: total, pendiente: 0,
    creado: fecha + 'T' + hora + ':00-05:00',
  };
}
const vendNombres = usuarios.filter(u => u.rol === 'vendedor').map(u => u.usuario);
for (let i=0; i<10; i++) ventas.push(ventaFake(ANTEAYER, ['09:30','11:15','14:20','16:45','18:10'][i%5], rndItem(vendNombres)));
for (let i=0; i<10; i++) ventas.push(ventaFake(AYER,     ['10:00','12:30','15:10','17:30','19:00'][i%5], rndItem(vendNombres)));
for (let i=0; i<5; i++)  ventas.push(ventaFake(HOY,      ['08:45','10:30','12:00','14:15','16:30'][i], rndItem(vendNombres)));

// Una venta con pago parcial (deuda)
ventas.push({
  id: 'vDeuda01', fecha: AYER, hora: '11:30', vendedor: 'carlos',
  metodo: 'Yape', cliente: clientes[0],
  items: [{ productoId: productos[10].id, nombre: productos[10].nombre, categoria: productos[10].categoria, sku: productos[10].sku, precio: productos[10].precio, cantidad: 2, tipoUnidad: 'unidad', imagen: '' }],
  total: productos[10].precio * 2, adelanto: 30, pendiente: (productos[10].precio * 2) - 30,
  creado: AYER + 'T11:30:00-05:00',
});

// ── ESCRIBIR TODO EN BATCHES ─────────────────────────────────────
async function batchWrite(writes) {
  for (let i=0; i<writes.length; i+=400) {
    const chunk = writes.slice(i, i+400);
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJ}/databases/(default)/documents:batchWrite`, {
      method:'POST', headers:H, body: JSON.stringify({ writes: chunk })
    });
    if (!r.ok) console.error('batchWrite falló:', r.status, (await r.text()).slice(0,300));
  }
}

console.log('Escribiendo productos...');
await batchWrite(productos.map(p => {
  const clean = {};
  for (const [k,v] of Object.entries(p)) if (v !== undefined) clean[k] = v;
  const f = {};
  for (const [k,v] of Object.entries(clean)) f[k] = toFV(v);
  return { update: { name: `projects/${PROJ}/databases/(default)/documents/cpn_productos/${p.id}`, fields: f } };
}));

console.log('Escribiendo config (empresa, categorías, usuarios, clientes)...');
const configs = [
  { doc:'empresa', data: {
    nombre: 'Bazar Don Pepe', ruc: '10456789012',
    direccion: 'Av. Los Alisos 234 - Los Olivos',
    telefono: '987654321', whatsapp: '51987654321',
    email: 'contacto@bazardonpepe.pe', web: 'demo.cpnsports.com',
    horario: 'Lun-Sáb 8:00-22:00 · Dom 9:00-18:00',
    referencia: 'A media cuadra del mercado',
  }},
  { doc:'categorias', data: {
    lista: CATEGORIAS_WEB.map((c, i) => ({ slug: c.toLowerCase().replace(/\s/g,'-'), nombre: c, imagen:'', descripcion:'', orden: i })),
    lastEdit: new Date().toISOString(),
  }},
  { doc:'usuarios', data: { lista: usuarios, lastEdit: new Date().toISOString() }},
  { doc:'clientes', data: { lista: clientes, lastEdit: new Date().toISOString() }},
];
await batchWrite(configs.map(c => {
  const f = {};
  for (const [k,v] of Object.entries(c.data)) f[k] = toFV(v);
  return { update: { name: `projects/${PROJ}/databases/(default)/documents/cpn_config/${c.doc}`, fields: f } };
}));

console.log('Escribiendo ventas...');
await batchWrite(ventas.map(v => {
  const clean = {};
  for (const [k,val] of Object.entries(v)) if (val !== undefined) clean[k] = val;
  const f = {};
  for (const [k,val] of Object.entries(clean)) f[k] = toFV(val);
  return { update: { name: `projects/${PROJ}/databases/(default)/documents/cpn_ventas/${v.id}`, fields: f } };
}));

console.log('');
console.log('✅ SEED completo:');
console.log('   ' + productos.length + ' productos');
console.log('   ' + usuarios.length + ' usuarios');
console.log('   ' + clientes.length + ' clientes');
console.log('   ' + ventas.length + ' ventas');
console.log('');
console.log('Login demo: usuario "demo" / pass "demo123"');
