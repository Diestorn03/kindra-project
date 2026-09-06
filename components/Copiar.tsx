'use client';
import { useEffect, useState } from 'react';

/** Enlace del briefing con acciones: copiar, enviar por WhatsApp y abrir. */
export default function Copiar({ ruta, empresa }: { ruta: string; empresa?: string }) {
  const [copiado, setCopiado] = useState(false);
  const [url, setUrl] = useState(ruta);
  useEffect(() => setUrl(`${window.location.origin}${ruta}`), [ruta]);

  async function copiar() {
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  }
  const texto = `Hola${empresa ? ` ${empresa}` : ''}, aquí está el formulario para contarnos de su marca. Toma unos 5 minutos y se guarda solo: ${url}`;

  return (
    <div className="grid gap-3">
      <code className="block truncate rounded-lg border border-linea bg-fondo px-3 py-2.5 font-mono text-[13px]">{url}</code>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copiar} className="btn-suave">{copiado ? 'Copiado ✓' : 'Copiar enlace'}</button>
        <a href={`https://wa.me/?text=${encodeURIComponent(texto)}`} target="_blank" rel="noopener" className="btn-suave">Enviar por WhatsApp</a>
        <a href={ruta} className="btn">Abrir formulario</a>
      </div>
    </div>
  );
}
