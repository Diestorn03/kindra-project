import Link from 'next/link';
import Logo from '@/components/Logo';
import Aparecer from '@/components/Aparecer';
import { db } from '@/lib/db';
import { imagenProyecto } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

export default async function Inicio() {
  const proyectos = (await db.listarProyectos(true)).slice(0, 3);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || '';
  return (
    <main>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo tam="sm" />
        <nav className="flex items-center gap-5 text-[14px] font-semibold">
          <Link href="/portafolio" className="hover:text-acento">Portafolio</Link>
          <Link href="/panel" className="hover:text-acento">Briefing</Link>
          {whatsapp && <a href={`https://wa.me/${whatsapp}`} className="btn px-5 py-2.5 text-[13px]">Escríbenos</a>}
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
        <Aparecer inmediato><p className="etiqueta mb-5">Agencia de diseño web y redes sociales</p></Aparecer>
        <Aparecer inmediato retraso={0.08}><h1 className="titulo max-w-4xl text-5xl sm:text-7xl">Marcas que se ven tan bien como trabajan.</h1></Aparecer>
        <Aparecer inmediato retraso={0.16}><p className="mt-6 max-w-xl text-[18px] leading-relaxed text-gris">Diseñamos tu página y llevamos tus redes con un solo equipo: la misma voz, la misma calidad, sin intermediarios.</p></Aparecer>
        <Aparecer inmediato retraso={0.24} className="mt-8 flex flex-wrap gap-3">
          <Link href="/portafolio" className="btn">Ver portafolio</Link>
          {whatsapp && <a href={`https://wa.me/${whatsapp}`} className="btn-suave">Hablemos por WhatsApp</a>}
        </Aparecer>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 sm:grid-cols-2">
        <Aparecer className="tarjeta p-8">
          <span className="etiqueta">Páginas web</span>
          <h2 className="titulo mt-3 text-3xl">Diseñadas a medida, rápidas y con vida.</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-gris">Nada de plantillas: cada sitio parte de tu marca, carga en segundos y tiene animaciones que se sienten, no que estorban.</p>
        </Aparecer>
        <Aparecer retraso={0.1} className="tarjeta p-8">
          <span className="etiqueta">Redes sociales</span>
          <h2 className="titulo mt-3 text-3xl">Contenido con estrategia, todos los meses.</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-gris">Planificamos, creamos y publicamos. Tú atiendes tu negocio; nosotros lo mantenemos presente.</p>
        </Aparecer>
      </section>

      {proyectos.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <Aparecer className="mb-8 flex items-end justify-between gap-4">
            <h2 className="titulo text-4xl">Trabajos recientes</h2>
            <Link href="/portafolio" className="text-[14px] font-semibold text-acento hover:underline">Ver todos →</Link>
          </Aparecer>
          <div className="grid gap-5 sm:grid-cols-3">
            {proyectos.map((p, i) => (
              <Aparecer key={p.id} retraso={i * 0.08}>
                <Link href={`/portafolio/${p.id}`} className="tarjeta group block overflow-hidden">
                  <div className="aspect-[16/10] overflow-hidden bg-acento-suave">{imagenProyecto(p, 800) && <img src={imagenProyecto(p, 800)} alt={p.titulo} className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" />}</div>
                  <div className="p-5"><p className="etiqueta">{p.cliente}</p><h3 className="titulo mt-1 text-xl">{p.titulo}</h3></div>
                </Link>
              </Aparecer>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-linea">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-[13px] text-gris">
          <Logo tam="sm" />
          <span>© {new Date().getFullYear()} Kindra Project</span>
          <Link href="/entrar" className="hover:text-acento">Acceso del equipo</Link>
        </div>
      </footer>
    </main>
  );
}
