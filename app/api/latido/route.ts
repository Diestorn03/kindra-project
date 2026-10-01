import { NextResponse } from 'next/server';
// Siempre desde lib/db, nunca lib/db-supabase: se importan en ciclo y cargar db-supabase primero
// rompe con "Cannot access before initialization".
import { db } from '@/lib/db';

/**
 * Latido para que Supabase (plan gratis) no pause el proyecto: lo pausa tras 7 días sin actividad.
 * Lo llama el cron de Vercel cada 3 días (vercel.json) y hace la misma lectura que /portafolio.
 * La caché de lib/db dura 5 s, así que con un cron cada 3 días la consulta siempre llega a la base.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await db.listarProyectos(true);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : JSON.stringify(e) }, { status: 500 });
  }
}
