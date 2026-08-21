// ═══════════════════════════════════════════════════════════════════
//  BRANDING dinámico según APP_CONFIG.
//  Sustituye el nombre de la empresa, título de pestaña, logo y links
//  hardcoded para que el demo se vea como "Bazar Don Pepe" y no como CPN.
//  En prod queda todo idéntico al estado histórico de CPN Sports.
// ═══════════════════════════════════════════════════════════════════
(function () {
  if (!window.APP_CONFIG) return;
  const cfg = window.APP_CONFIG;
  const emp = cfg.empresa || {};
  const esDemo = cfg.tipo === 'demo';

  function apply() {
    // Título de la pestaña
    if (emp.nombre) document.title = emp.nombre + (esDemo ? ' — Demo comercial' : ' — Control de Ingresos');

    // Pantalla de login
    const lt = document.getElementById('loginTitle');
    if (lt) lt.textContent = emp.nombre || lt.textContent;
    const ls = document.getElementById('loginSub');
    if (ls && esDemo) ls.textContent = 'Sistema demo · datos de ejemplo';

    // Header interior
    const hb = document.getElementById('headerBrand');
    if (hb) hb.textContent = emp.nombre || hb.textContent;

    // Link a "tienda pública" — solo tiene sentido en prod
    const tpLink = document.getElementById('tiendaPublicaLink');
    if (tpLink && esDemo) {
      // En demo, el logo no lleva a ningún lado — cursor default
      tpLink.href = 'javascript:void(0)';
      tpLink.title = emp.nombre || '';
      tpLink.style.cursor = 'default';
    }

    // Logo: si es demo, ocultarlo (evita "logo.jpg" que es de CPN) y dejar solo el texto
    const logos = ['loginLogo', 'headerLogo'];
    if (esDemo) {
      logos.forEach(id => {
        const img = document.getElementById(id);
        if (!img) return;
        img.style.display = 'none';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
