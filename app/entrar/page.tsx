import Logo from '@/components/Logo';
import CampoContrasena from '@/components/CampoContrasena';

export const metadata = { title: 'Entrar' };

export default async function Entrar({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <form method="post" action="/api/entrar" className="tarjeta w-full max-w-sm p-8">
        <div className="mb-6"><Logo /></div>
        <h1 className="titulo mb-1 text-2xl">Panel privado</h1>
        <p className="mb-5 text-[14px] text-gris">Solo para el equipo de Kindra Project.</p>
        {error && <p className="mb-4 rounded-lg bg-acento-suave px-3 py-2 text-[13px]" role="alert">Contraseña incorrecta.</p>}
        <label className="mb-1.5 block text-[13px] font-semibold" htmlFor="password">Contraseña</label>
        <CampoContrasena />
        <button className="btn w-full" type="submit">Entrar</button>
      </form>
    </main>
  );
}
