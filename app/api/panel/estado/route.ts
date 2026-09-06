import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { estaAutenticado } from '@/lib/auth';
import { ESTADOS, type Estado } from '@/lib/tipos';

/** Cambia el estado de un briefing (lo llama EstadoBotones con JSON). */
export async function POST(req: Request) {
  if (!(await estaAutenticado())) return NextResponse.json({ error: 'Sin sesión' }, { status: 401 });
  let cuerpo: { id?: unknown; estado?: unknown } = {};
  try { cuerpo = (await req.json()) ?? {}; } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }); }
  const { id, estado } = cuerpo;
  if (typeof id !== 'string' || !id || typeof estado !== 'string' || !Object.hasOwn(ESTADOS, estado)) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  const brief = await db.obtenerBrief(id);
  if (!brief) return NextResponse.json({ error: 'No existe' }, { status: 404 });
  await db.cambiarEstado(id, estado as Estado);
  return NextResponse.json({ ok: true, estado });
}
