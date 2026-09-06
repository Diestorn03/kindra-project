import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { estaAutenticado } from '@/lib/auth';

const MAX = 8 * 1024 * 1024;

/** Sube una imagen. La acepta si viene con el token de un briefing válido o desde el panel autenticado. */
export async function POST(req: Request) {
  const form = await req.formData();
  const archivo = form.get('archivo');
  const token = String(form.get('token') ?? '');
  if (!(archivo instanceof File)) return NextResponse.json({ error: 'Falta el archivo' }, { status: 400 });
  if (!archivo.type.startsWith('image/')) return NextResponse.json({ error: 'Solo imágenes' }, { status: 415 });
  if (archivo.size > MAX) return NextResponse.json({ error: 'Máximo 8 MB' }, { status: 413 });

  const autorizado = (token && (await db.obtenerBriefPorToken(token))) || (await estaAutenticado());
  if (!autorizado) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const url = await db.guardarArchivo(archivo.name, Buffer.from(await archivo.arrayBuffer()), archivo.type);
  return NextResponse.json({ url });
}
