import { db, nuevoId } from '@/lib/db';
import { estaAutenticado } from '@/lib/auth';
import { redirigir } from '@/lib/http';

/** Crea, actualiza o elimina un proyecto del portafolio (formulario del panel). */
export async function POST(req: Request) {
  if (!(await estaAutenticado())) return redirigir('/entrar');
  const form = await req.formData();
  const accion = String(form.get('_accion') ?? 'guardar');
  const id = String(form.get('id') ?? '');
  const volver = redirigir('/panel/portafolio');

  if (accion === 'eliminar') {
    if (id) await db.eliminarProyecto(id);
    return volver;
  }

  const existente = id ? await db.obtenerProyecto(id) : null;
  let portadaUrl = form.get('quitar_portada') === 'on' ? '' : (existente?.portadaUrl ?? '');
  const portada = form.get('portada');
  if (portada instanceof File && portada.size > 0 && portada.type.startsWith('image/')) {
    portadaUrl = await db.guardarArchivo(portada.name, Buffer.from(await portada.arrayBuffer()), portada.type);
  }
  const texto = (k: string, max = 300) => String(form.get(k) ?? '').trim().slice(0, max);

  await db.guardarProyecto({
    id: existente?.id ?? nuevoId(),
    titulo: texto('titulo', 120),
    cliente: texto('cliente', 120),
    url: texto('url', 300),
    descripcion: texto('descripcion', 1000),
    etiquetas: texto('etiquetas', 300).split(',').map((s) => s.trim()).filter(Boolean),
    publicado: form.get('publicado') === 'on',
    portadaUrl,
    creadoEn: existente?.creadoEn ?? new Date().toISOString(),
  });
  return volver;
}
