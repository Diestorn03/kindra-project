import Link from 'next/link';
import { redirect } from 'next/navigation';
import Logo from '@/components/Logo';
import { estaAutenticado } from '@/lib/auth';

export const metadata = { title: 'Panel' };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await estaAutenticado())) redirect('/entrar');
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-linea bg-fondo/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <Logo tam="sm" href="/panel" />
          <nav className="flex items-center gap-0.5 text-[13px] font-semibold sm:gap-1 sm:text-[14px]">
            <Link href="/panel" className="whitespace-nowrap rounded-full px-2.5 py-2 hover:bg-blanco sm:px-3.5">Briefings</Link>
            <Link href="/panel/portafolio" className="whitespace-nowrap rounded-full px-2.5 py-2 hover:bg-blanco sm:px-3.5">Portafolio</Link>
            <Link href="/" target="_blank" className="whitespace-nowrap rounded-full px-2.5 py-2 text-gris hover:bg-blanco sm:px-3.5"><span className="hidden sm:inline">Sitio público </span>↗</Link>
            <form method="post" action="/api/salir"><button className="whitespace-nowrap rounded-full px-2.5 py-2 text-gris hover:bg-blanco sm:px-3.5" type="submit">Salir</button></form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
