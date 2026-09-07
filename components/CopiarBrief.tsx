'use client';
import { useState } from 'react';
import { REDES, urlRed, formatoSecciones, type BriefDatos } from '@/lib/tipos';

/** Arma el briefing como texto listo para pegar en Claude Code al empezar a construir el sitio. */
export default function CopiarBrief({ d, logoAbsoluta }: { d: BriefDatos; logoAbsoluta: string }) {
  const [ok, setOk] = useState(false);
  const linea = (k: string, v?: string) => (v ? `- **${k}:** ${v}\n` : '');
  const md =
    `# Briefing · ${d.empresa || 'Sin nombre'}\n\n` +
    linea('Contacto', [d.contacto, d.cargo].filter(Boolean).join(', ')) + linea('Teléfono', d.telefono) + linea('Correo', d.correo) + linea('Sector', d.sector) +
    linea('Web actual', d.tieneWeb === 'no' ? 'No tiene' : d.webUrl) + linea('Le gusta de su web', d.webGusta) + linea('No le gusta', d.webNoGusta) +
    (d.redes.length ? `- **Redes:** ${d.redes.map((r) => `${REDES[r.red].nombre} ${urlRed(r.red, r.usuario)}`).join(' · ')}\n` : '') +
    linea('Logo', logoAbsoluta) + (d.colores.length ? `- **Colores:** ${d.colores.join(', ')}\n` : '') + linea('Tipografías', d.tipografias) +
    linea('Tipo de sitio', d.tipoSitio) +
    (d.referencias.some((r) => r.url) ? `- **Referencias:**\n${d.referencias.filter((r) => r.url).map((r) => `  - ${r.url}${r.nota ? ` — ${r.nota}` : ''}`).join('\n')}\n` : '') +
    (d.secciones.length ? `- **Secciones:** ${formatoSecciones(d)}\n` : '') + linea('Contenido disponible', d.contenido) +
    linea('Presupuesto', d.presupuesto) + linea('Fecha límite', d.fechaLimite) + linea('Notas', d.notas);

  async function copiar() {
    await navigator.clipboard.writeText(md);
    setOk(true);
    setTimeout(() => setOk(false), 1800);
  }
  return <button type="button" onClick={copiar} className="btn">{ok ? 'Copiado ✓' : 'Copiar para desarrollar'}</button>;
}
