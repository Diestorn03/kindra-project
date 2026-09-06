import { db } from '@/lib/db';
import { estaAutenticado } from '@/lib/auth';
import { redirigir } from '@/lib/http';

/**
 * Crea un briefing en borrador desde el panel.
 * modo=abrir → abre el formulario de inmediato (para la reunión).
 * modo=enlace → muestra la ficha con el enlace para enviar.
 */
export async function POST(req: Request) {
  if (!(await estaAutenticado())) return redirigir('/entrar');
  const form = await req.formData();
  const empresa = String(form.get('empresa') ?? '').trim().slice(0, 120);
  const brief = await db.crearBrief({ empresa });
  return redirigir(form.get('modo') === 'abrir' ? `/b/${brief.token}` : `/panel/briefings/${brief.id}?nuevo=1`);
}
