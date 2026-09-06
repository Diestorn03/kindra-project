import { notFound } from 'next/navigation';
import Logo from '@/components/Logo';
import Wizard from '@/components/Wizard';
import { db } from '@/lib/db';

export const metadata = { title: 'Briefing' };

export default async function Briefing({ params }: { params: Promise<{ token: string }> }) {
  const brief = await db.obtenerBriefPorToken((await params).token);
  if (!brief) notFound();
  return (
    <main className="min-h-dvh px-5 py-6 sm:py-10">
      <div className="mx-auto mb-8 flex max-w-2xl items-center justify-between"><Logo tam="sm" /><span className="etiqueta">Briefing</span></div>
      <Wizard token={brief.token} inicial={brief.datos} yaEnviado={brief.estado !== 'borrador'} />
    </main>
  );
}
