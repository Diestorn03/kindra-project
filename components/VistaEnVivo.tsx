'use client';
import { useState } from 'react';

/** Vista previa grande del sitio con opción de verlo en vivo dentro de la página. */
export default function VistaEnVivo({ url, imagen, titulo }: { url: string; imagen: string; titulo: string }) {
  const [vivo, setVivo] = useState(false);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setVivo(false)} className={vivo ? 'btn-suave' : 'btn'}>Captura</button>
        <button type="button" onClick={() => setVivo(true)} className={vivo ? 'btn' : 'btn-suave'}>Ver en vivo</button>
        <a href={url} target="_blank" rel="noopener" className="btn-suave ml-auto">Abrir en pestaña nueva ↗</a>
      </div>
      <div className="tarjeta overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
        {vivo ? (
          <iframe src={url} title={titulo} className="h-full w-full" loading="lazy" />
        ) : (
          <img src={imagen} alt={`Vista previa de ${titulo}`} className="h-full w-full object-cover object-top" />
        )}
      </div>
      {vivo && <p className="text-[12px] text-gris">Si el sitio no aparece aquí, es porque bloquea mostrarse dentro de otras páginas. Usa "Abrir en pestaña nueva".</p>}
    </div>
  );
}
