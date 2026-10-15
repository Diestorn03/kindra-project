import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Latido para que Supabase (plan gratis) no pause el proyecto. Supabase pausa por POCA actividad en la
 * semana, no solo por ninguna: con una lectura cada 3 días lo pausó igual (oct 2026). Por eso el cron de
 * Vercel (vercel.json) lo llama 6 veces al día y cada llamada lee las tablas reales y ESCRIBE en `latido`.
 * Abrirlo en el navegador muestra cuándo fue el latido anterior, así se ve si el cron está corriendo.
 * Cliente propio, sin pasar por lib/db: lib/db y lib/db-supabase se importan en ciclo.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, { auth: { persistSession: false } });
  try {
    const proyectos = await sb.from('proyectos').select('id', { count: 'exact', head: true });
    if (proyectos.error) throw proyectos.error;
    const briefings = await sb.from('briefings').select('id', { count: 'exact', head: true });
    if (briefings.error) throw briefings.error;
    const anterior = await sb.from('latido').select('en').eq('id', 1).maybeSingle();
    if (anterior.error) throw anterior.error;
    const escrito = await sb.from('latido').upsert({ id: 1, en: new Date().toISOString() });
    if (escrito.error) throw escrito.error;
    return NextResponse.json({ ok: true, anterior: anterior.data?.en ?? null });
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : (e as { message?: string }).message ?? JSON.stringify(e);
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}
