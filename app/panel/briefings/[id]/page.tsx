import Link from 'next/link';
import { notFound } from 'next/navigation';
import Copiar from '@/components/Copiar';
import CopiarBrief from '@/components/CopiarBrief';
import { db } from '@/lib/db';
import { ESTADOS, REDES, urlRed, type Estado } from '@/lib/tipos';

const COLOR: Record<Estado, string> = { borrador: 'bg-fondo text-gris', nuevo: 'bg-acento text-blanco', en_progreso: 'bg-acento-suave text-acento-oscuro', cerrado: 'bg-tinta text-blanco' };

export default async function Ficha({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ nuevo?: string }> }) {
  const [{ id }, { nuevo }] = await Promise.all([params, searchParams]);
  const brief = await db.obtenerBrief(id);
  if (!brief) notFound();
  const d = brief.datos;
  const base = process.env.NEXT_PUBLIC_URL_BASE || '';
  const Dato = ({ k, v }: { k: string; v?: string }) => v ? <div><dt className="text-[12px] font-semibold uppercase tracking-wide text-gris">{k}</dt><dd className="mt-0.5 text-[15px]">{v}</dd></div> : null;
  const Bloque = ({ titulo, children }: { titulo: string; children: React.ReactNode }) => <section className="tarjeta entrar p-6"><p className="etiqueta mb-4">{titulo}</p><dl className="grid gap-4 sm:grid-cols-2">{children}</dl></section>;

  return (
    <div className="grid gap-6">
      <div>
        <Link href="/panel" className="text-[13px] text-gris hover:text-acento">← Briefings</Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <h1 className="titulo text-4xl">{d.empresa || 'Sin nombre todavía'}</h1>
          <form method="post" action="/api/panel/estado" className="flex flex-wrap gap-1.5">
            <input type="hidden" name="id" value={brief.id} />
            {(Object.keys(ESTADOS) as Estado[]).map((e) => (
              <button key={e} name="estado" value={e} type="submit" className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wide transition ${brief.estado === e ? COLOR[e] + ' border-transparent' : 'border-linea bg-blanco text-gris hover:border-acento'}`}>{ESTADOS[e]}</button>
            ))}
          </form>
        </div>
      </div>

      <section className={`tarjeta entrar p-6 ${nuevo ? 'border-acento' : ''}`}>
        <p className="etiqueta mb-1">{nuevo ? 'Enlace creado' : 'Enlace del briefing'}</p>
        <p className="mb-4 text-[14px] text-gris">Ábrelo en la reunión o envíaselo al cliente. No pide contraseña y se puede retomar cuando sea.</p>
        <Copiar ruta={`/b/${brief.token}`} empresa={d.empresa} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <Bloque titulo="Cliente">
            <Dato k="Contacto" v={[d.contacto, d.cargo].filter(Boolean).join(', ')} /><Dato k="Sector" v={d.sector} />
            <Dato k="Teléfono" v={d.telefono} /><Dato k="Correo" v={d.correo} />
          </Bloque>
          <Bloque titulo="Presencia actual">
            <Dato k="Web actual" v={d.tieneWeb === 'no' ? 'No tiene' : d.webUrl} />
            {d.redes.length > 0 && <div><dt className="text-[12px] font-semibold uppercase tracking-wide text-gris">Redes</dt><dd className="mt-1.5 flex flex-wrap gap-2">{d.redes.map((r) => <a key={r.red} href={urlRed(r.red, r.usuario)} target="_blank" rel="noopener" className="chip px-3 py-1.5 text-[13px]">{REDES[r.red].nombre} · {r.usuario || '—'}</a>)}</dd></div>}
            <Dato k="Le gusta de su web" v={d.webGusta} /><Dato k="No le gusta" v={d.webNoGusta} />
          </Bloque>
          <Bloque titulo="Proyecto">
            <Dato k="Tipo de sitio" v={d.tipoSitio} /><Dato k="Secciones" v={d.secciones.join(', ')} />
            {d.referencias.some((r) => r.url) && <div className="sm:col-span-2"><dt className="text-[12px] font-semibold uppercase tracking-wide text-gris">Referencias</dt><dd className="mt-1.5 grid gap-1 text-[15px]">{d.referencias.filter((r) => r.url).map((r, i) => <span key={i}><a href={/^https?:/.test(r.url) ? r.url : `https://${r.url}`} target="_blank" rel="noopener" className="text-acento hover:underline">{r.url}</a>{r.nota && <span className="text-gris"> — {r.nota}</span>}</span>)}</dd></div>}
            <Dato k="Contenido disponible" v={d.contenido} /><Dato k="Tipografías" v={d.tipografias} />
          </Bloque>
          <Bloque titulo="Condiciones">
            <Dato k="Presupuesto" v={d.presupuesto} /><Dato k="Fecha límite" v={d.fechaLimite} />
            <div className="sm:col-span-2"><Dato k="Notas" v={d.notas} /></div>
            <Dato k="Revisado por el cliente" v={d.revisado ? 'Sí' : ''} /><Dato k="Enviado" v={brief.enviadoEn ? new Date(brief.enviadoEn).toLocaleString('es-VE') : ''} />
          </Bloque>
        </div>

        <aside className="grid content-start gap-4">
          <div className="tarjeta entrar p-5">
            <p className="etiqueta mb-3">Logo</p>
            {d.logoUrl ? <div className="flex items-center justify-center rounded-xl bg-fondo p-4"><img src={d.logoUrl} alt="Logo del cliente" className="max-h-28 object-contain" /></div> : <p className="text-[13px] text-gris">Sin logo todavía</p>}
          </div>
          <div className="tarjeta entrar p-5">
            <p className="etiqueta mb-3">Colores</p>
            {d.colores.length ? <div className="grid gap-2">{d.colores.map((c) => <div key={c} className="flex items-center gap-3"><span className="h-9 w-9 rounded-lg border border-black/10" style={{ background: c }} /><span className="font-mono text-[13px]">{c}</span></div>)}</div> : <p className="text-[13px] text-gris">Sin colores todavía</p>}
          </div>
          <div className="tarjeta entrar p-5">
            <p className="etiqueta mb-2">Para desarrollar</p>
            <p className="mb-3 text-[13px] text-gris">Copia el briefing como texto y pégalo al empezar a construir el sitio.</p>
            <CopiarBrief d={d} logoAbsoluta={d.logoUrl ? (d.logoUrl.startsWith('http') ? d.logoUrl : `${base}${d.logoUrl}`) : ''} />
          </div>
        </aside>
      </div>
    </div>
  );
}
