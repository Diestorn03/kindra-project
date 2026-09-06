import Link from 'next/link';
import Logo from '@/components/Logo';
import Aparecer from '@/components/Aparecer';
import { db } from '@/lib/db';
import { imagenProyecto } from '@/lib/tipos';

export const metadata = { title: 'Portafolio' };
export const dynamic = 'force-dynamic';

export default async function Portafolio() {
  const proyectos = await db.listarProyectos(true);
  return (
    <main className="min-h-dvh px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center justify-between"><Logo tam="sm" /><nav className="flex gap-5 text-[14px] font-semibold"><Link href="/" className="hover:text-acento">Inicio</Link><Link href="/panel" className="hover:text-acento">Briefing</Link></nav></div>
        <Aparecer><p className="etiqueta mb-3">Portafolio</p><h1 className="titulo text-5xl sm:text-6xl">Lo que hemos construido</h1></Aparecer>
        {proyectos.length === 0 ? (
          <p className="mt-8 text-gris">Pronto habrá proyectos aquí.</p>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proyectos.map((p, i) => (
              <Aparecer key={p.id} retraso={i * 0.06}>
                <Link href={`/portafolio/${p.id}`} className="tarjeta group block overflow-hidden transition hover:-translate-y-1 hover:border-acento">
                  <div className="aspect-[16/10] overflow-hidden bg-acento-suave">{imagenProyecto(p, 800) && <img src={imagenProyecto(p, 800)} alt={p.titulo} className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" />}</div>
                  <div className="p-5">
                    <p className="etiqueta">{p.cliente}</p>
                    <h2 className="titulo mt-1 text-2xl">{p.titulo}</h2>
                    <div className="mt-3 flex flex-wrap gap-1.5">{p.etiquetas.map((e) => <span key={e} className="rounded-full bg-fondo px-2.5 py-1 font-mono text-[11px]">{e}</span>)}</div>
                  </div>
                </Link>
              </Aparecer>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
