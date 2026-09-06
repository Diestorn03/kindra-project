import { db } from '@/lib/db';
import { estaAutenticado } from '@/lib/auth';
import { redirigir } from '@/lib/http';
import { ESTADOS, type Estado } from '@/lib/tipos';

export async function POST(req: Request) {
  if (!(await estaAutenticado())) return redirigir('/entrar');
  const form = await req.formData();
  const id = String(form.get('id') ?? '');
  const estado = String(form.get('estado') ?? '') as Estado;
  const brief = await db.obtenerBrief(id);
  if (brief && estado in ESTADOS) {
    brief.estado = estado;
    brief.actualizadoEn = new Date().toISOString();
    await db.guardarBrief(brief);
  }
  return redirigir(`/panel/briefings/${id}`);
}
