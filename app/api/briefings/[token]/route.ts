import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DATOS_VACIOS, validarMinimos, type BriefDatos } from '@/lib/tipos';

type Ctx = { params: Promise<{ token: string }> };

export async function GET(_: Request, { params }: Ctx) {
  const brief = await db.obtenerBriefPorToken((await params).token);
  return brief ? NextResponse.json(brief) : NextResponse.json({ error: 'No existe' }, { status: 404 });
}

/** Guarda el progreso del formulario público. Con { enviar: true } lo marca como recibido. */
export async function PATCH(req: Request, { params }: Ctx) {
  const brief = await db.obtenerBriefPorToken((await params).token);
  if (!brief) return NextResponse.json({ error: 'No existe' }, { status: 404 });

  let cuerpo: { datos?: Partial<BriefDatos>; enviar?: boolean } = {};
  try { cuerpo = await req.json(); } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }); }

  // Solo se aceptan las claves conocidas, para que nadie meta campos extraños.
  const limpio: Partial<BriefDatos> = {};
  for (const k of Object.keys(DATOS_VACIOS) as (keyof BriefDatos)[]) {
    if (cuerpo.datos && k in cuerpo.datos) (limpio as Record<string, unknown>)[k] = cuerpo.datos[k];
  }
  brief.datos = { ...brief.datos, ...limpio };
  brief.actualizadoEn = new Date().toISOString();

  if (cuerpo.enviar) {
    const faltan = validarMinimos(brief.datos);
    if (faltan.length) return NextResponse.json({ error: 'Faltan datos', faltan }, { status: 422 });
    if (brief.estado === 'borrador') brief.estado = 'nuevo';
    brief.enviadoEn = new Date().toISOString();
  }
  await db.guardarBrief(brief);
  return NextResponse.json({ ok: true, estado: brief.estado });
}
