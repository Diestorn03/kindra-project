import Link from 'next/link';
import { db } from '@/lib/db';
import { ESTADOS, type Estado } from '@/lib/tipos';

const COLOR: Record<Estado, string> = {
  borrador: 'bg-fondo text-gris',
  nuevo: 'bg-acento text-blanco',
  en_progreso: 'bg-acento-suave text-acento-oscuro',
  cerrado: 'bg-tinta text-blanco',
};
const fecha = (iso: string) => new Date(iso).toLocaleDateString('es-VE', { day: 'numeric', month: 'short' });

export default async function Panel({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const todos = await db.listarBriefs();
  const lista = estado && estado in ESTADOS ? todos.filter((b) => b.estado === estado) : todos;
  const conteo = (e: Estado) => todos.filter((b) => b.estado === e).length;

  return (
    <div className="grid gap-10">
      {/* Acciones principales */}
      <section className="grid gap-4 md:grid-cols-2">
        <form method="post" action="/api/briefings" className="tarjeta entrar flex flex-col gap-4 p-7">
          <input type="hidden" name="modo" value="abrir" />
          <div><p className="etiqueta">En la reunión</p><h2 className="titulo mt-1 text-2xl">Empezar briefing ahora</h2><p className="mt-1 text-[14px] text-gris">Se abre el formulario aquí mismo para llenarlo con el cliente.</p></div>
          <div className="mt-auto flex flex-col gap-2 sm:flex-row"><input name="empresa" className="campo" placeholder="Nombre del cliente (opcional)" /><button className="btn whitespace-nowrap" type="submit">Empezar →</button></div>
        </form>
        <form method="post" action="/api/briefings" className="tarjeta entrar flex flex-col gap-4 p-7">
          <input type="hidden" name="modo" value="enlace" />
          <div><p className="etiqueta">A distancia</p><h2 className="titulo mt-1 text-2xl">Crear enlace para enviar</h2><p className="mt-1 text-[14px] text-gris">Genera el enlace y mándalo por WhatsApp para que el cliente lo llene solo.</p></div>
          <div className="mt-auto flex flex-col gap-2 sm:flex-row"><input name="empresa" className="campo" placeholder="Nombre del cliente (opcional)" /><button className="btn-suave whitespace-nowrap" type="submit">Crear enlace</button></div>
        </form>
      </section>

      {/* Lista */}
      <section className="grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/panel" className={`chip ${!estado ? 'chip-activo' : ''}`}>Todos <b>{todos.length}</b></Link>
          {(Object.keys(ESTADOS) as Estado[]).map((e) => (
            <Link key={e} href={`/panel?estado=${e}`} className={`chip ${estado === e ? 'chip-activo' : ''}`}>{ESTADOS[e]} <b>{conteo(e)}</b></Link>
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
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${COLOR[b.estado]}`}>{ESTADOS[b.estado]}</span>
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
    </div>
  );
}
