import Link from 'next/link';
import { notFound } from 'next/navigation';
import Logo from '@/components/Logo';
import Aparecer from '@/components/Aparecer';
import VistaEnVivo from '@/components/VistaEnVivo';
import { db } from '@/lib/db';
import { imagenProyecto } from '@/lib/tipos';
import { estaAutenticado } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/** Página de presentación de un proyecto: para mostrar en reunión o compartir. */
export default async function Proyecto({ params }: { params: Promise<{ id: string }> }) {
  const p = await db.obtenerProyecto((await params).id);
  if (!p || (!p.publicado && !(await estaAutenticado()))) notFound();
  const imagen = imagenProyecto(p, 1440);
  return (
    <main className="min-h-dvh px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between"><Logo tam="sm" /><Link href="/portafolio" className="text-[14px] font-semibold hover:text-acento">← Portafolio</Link></div>
        <Aparecer>
          <p className="etiqueta mb-3">{p.cliente}</p>
          <h1 className="titulo text-5xl sm:text-6xl">{p.titulo}</h1>
          {p.descripcion && <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-gris">{p.descripcion}</p>}
          <div className="mt-4 flex flex-wrap gap-1.5">{p.etiquetas.map((e) => <span key={e} className="rounded-full bg-blanco px-3 py-1 font-mono text-[11px]">{e}</span>)}</div>
        </Aparecer>
        <Aparecer retraso={0.15} className="mt-10">
          {p.url ? <VistaEnVivo url={p.url} imagen={imagen} titulo={p.titulo} /> : imagen ? <img src={imagen} alt={p.titulo} className="tarjeta w-full" /> : null}
        </Aparecer>
      </div>
    </main>
  );
}
