import Logo from '@/components/Logo';
import Esqueleto from '@/components/Esqueleto';

/** Pantalla de carga del sitio público: aparece al instante al navegar, con la marca ya visible. */
export default function Cargando() {
  return (
    <main className="min-h-dvh px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12"><Logo tam="sm" /></div>
        <Esqueleto tarjetas={3} />
      </div>
    </main>
  );
}
