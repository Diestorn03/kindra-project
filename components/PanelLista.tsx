'use client';
import { useState } from 'react';
import Link from 'next/link';
import { COLOR_ESTADO, ESTADOS, type Brief, type Estado } from '@/lib/tipos';

const fecha = (iso: string) => new Date(iso).toLocaleDateString('es-VE', { day: 'numeric', month: 'short' });

/**
 * Filtra en el navegador, sin navegar: los datos ya llegaron del servidor con la lista completa,
 * así que cambiar de chip no debería recargar nada ni mostrar el esqueleto de carga.
 */
export default function PanelLista({ todos }: { todos: Brief[] }) {
  const [estado, setEstado] = useState<Estado | null>(null);
  const lista = estado ? todos.filter((b) => b.estado === estado) : todos;
  const conteo = (e: Estado) => todos.filter((b) => b.estado === e).length;

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setEstado(null)} className={`chip ${!estado ? 'chip-activo' : ''}`}>Todos <b>{todos.length}</b></button>
        {(Object.keys(ESTADOS) as Estado[]).map((e) => (
          <button key={e} type="button" onClick={() => setEstado(e)} className={`chip ${estado === e ? 'chip-activo' : ''}`}>{ESTADOS[e]} <b>{conteo(e)}</b></button>
        ))}
      </div>
      {lista.length === 0 ? (
        <div className="tarjeta p-10 text-center text-gris">{todos.length === 0 ? 'Todavía no hay briefings. Empieza uno con los botones de arriba.' : 'Nada en este estado.'}</div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {lista.map((b) => (
            <li key={b.id} className="entrar">
              <Link href={`/panel/briefings/${b.id}`} className="tarjeta flex h-full flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:border-acento">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[17px] font-semibold">{b.datos.empresa || 'Sin nombre todavía'}</p>
                    <p className="truncate text-[13px] text-gris">{[b.datos.contacto, b.datos.sector].filter(Boolean).join(' · ') || 'Aún sin datos'}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${COLOR_ESTADO[b.estado]}`}>{ESTADOS[b.estado]}</span>
                </div>
                <div className="mt-auto flex items-center justify-between text-[12px] text-gris">
                  <span className="flex items-center gap-1.5">{b.datos.colores.slice(0, 4).map((c) => <span key={c} className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ background: c }} />)}{b.datos.tipoSitio && <span className="ml-1">{b.datos.tipoSitio.split(' (')[0]}</span>}</span>
                  <span className="font-mono">{fecha(b.actualizadoEn)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
