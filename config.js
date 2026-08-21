// ═══════════════════════════════════════════════════════════════════
//  CONFIGURACIÓN POR ENTORNO
//  Detecta el hostname y decide qué Firestore usar.
//  - cpnsports.com               → producción (CPN Sports)
//  - demo.cpnsports.com          → demo (Bazar Don Pepe)
//  - localhost / *.vercel.app    → demo por defecto (para desarrollo)
// ═══════════════════════════════════════════════════════════════════
(function () {
  const host = (typeof location !== 'undefined' && location.hostname) || '';
  const esDemo =
    host.startsWith('demo.') ||
    host.includes('cpn-demo') ||
    host.includes('bazar-don-pepe') ||
    host === 'localhost' ||
    host === '127.0.0.1';

  const PROD = {
    tipo: 'prod',
    nombreNegocio: 'Caza · Pesca y Náutica',
    empresa: {
      nombre: 'CAZA · PESCA · NÁUTICA',
      razonSocial: 'CPN Sports',
      ruc: '',
      direccion: 'Av. Oscar R. Benavides 679 int. 602 - Lima',
      referencia: 'Ref. Vía Mix Colonial',
      distrito: 'Lima, Perú',
      telefono: '',
      whatsapp: '',
      email: 'caza.pescaynautica@gmail.com',
      web: 'cpnsports.com',
      horario: 'Lun-Vie 9:00-18:00 · Sáb 9:00-13:00',
    },
    firebase: {
      apiKey: 'AIzaSyBn8zqnipg18_Etn0qA7nBNf8OX5EgN6QA',
      authDomain: 'cazapescaynautica.firebaseapp.com',
      projectId: 'cazapescaynautica',
      storageBucket: 'cazapescaynautica.firebasestorage.app',
      messagingSenderId: '347078003696',
      appId: '1:347078003696:web:e6de3d58546ba89b202b35',
    },
  };

  const DEMO = {
    tipo: 'demo',
    nombreNegocio: 'Bazar Don Pepe',
    empresa: {
      nombre: 'BAZAR DON PEPE',
      razonSocial: 'Bazar Don Pepe S.A.C.',
      ruc: '20456789012',
      direccion: 'Av. Los Alisos 234 - Los Olivos',
      referencia: 'A media cuadra del mercado',
      distrito: 'Los Olivos, Lima',
      telefono: '',
      whatsapp: '51987654321',
      email: 'contacto@bazardonpepe.pe',
      web: 'bazar-don-pepe.vercel.app',
      horario: 'Lun-Sáb 8:00-22:00 · Dom 9:00-18:00',
    },
    firebase: {
      apiKey: 'AIzaSyBCfROnySXRc6j0HQfviwd_ODyQztr5uDg',
      authDomain: 'cpn-demo-comercial.firebaseapp.com',
      projectId: 'cpn-demo-comercial',
      storageBucket: 'cpn-demo-comercial.firebasestorage.app',
      messagingSenderId: '318978744834',
      appId: '1:318978744834:web:f5f7988f31acad7063fd1b',
    },
  };

  window.APP_CONFIG = esDemo ? DEMO : PROD;
})();
