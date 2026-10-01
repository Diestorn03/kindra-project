import { NextResponse } from 'next/server';
import { sb } from '@/lib/db-supabase';

/**
 * Latido para que Supabase (plan gratis) no pause el proyecto: lo pausa tras 7 días sin actividad.
 * Lo llama el cron de Vercel cada 3 días (vercel.json). Hace una consulta real a la base, sin pasar
 * por la caché de lib/db.ts. Queda abierto a propósito: es la misma lectura que hace /portafolio.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  const { error } = await sb().from('proyectos').select('id', { count: 'exact', head: true });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
