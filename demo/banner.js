// ═══════════════════════════════════════════════════════════════════
//  BANNER MODO DEMO
//  Se muestra solo cuando APP_CONFIG.tipo === 'demo'.
//  Deja claro que los datos se reinician cada noche.
// ═══════════════════════════════════════════════════════════════════
(function () {
  if (!window.APP_CONFIG || window.APP_CONFIG.tipo !== 'demo') return;
  const CSS = `
    #demoBanner{position:fixed;top:0;left:0;right:0;z-index:99999;background:linear-gradient(90deg,#F59E0B,#D97706);color:#0F172A;padding:8px 14px;font-family:system-ui,-apple-system,sans-serif;font-size:0.82rem;font-weight:600;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;box-shadow:0 2px 8px rgba(0,0,0,0.15);letter-spacing:0.01em}
    #demoBanner b{font-weight:800;letter-spacing:0.05em;text-transform:uppercase;font-size:0.78rem;background:#0F172A;color:#FCD34D;padding:2px 8px;border-radius:4px}
    #demoBanner .sep{opacity:0.6}
    #demoBanner .creds{background:rgba(15,23,42,0.12);padding:3px 10px;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:0.75rem}
    #demoBanner .close{background:transparent;border:none;color:#0F172A;font-size:1.1rem;cursor:pointer;font-weight:800;padding:0 6px;line-height:1}
    body{padding-top:38px !important}
    @media (max-width:600px){#demoBanner{font-size:0.72rem;padding:6px 8px} #demoBanner .hidem{display:none}}
  `;
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.id = 'demoBanner';
  bar.innerHTML = `
    <b>Demo Comercial</b>
    <span>Bazar Don Pepe · datos ficticios</span>
    <span class="sep hidem">·</span>
    <span class="hidem">Se reinicia cada noche</span>
    <span class="creds">demo / demo123</span>
    <button class="close" title="Ocultar" onclick="this.parentElement.remove();document.body.style.paddingTop='0'">✕</button>
  `;
  document.body.prepend(bar);
})();
