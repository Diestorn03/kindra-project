import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { DB } from './db';
import { nuevoId, nuevoToken } from './db';
import { DATOS_VACIOS, type Brief, type Proyecto } from './tipos';

const DIR = path.join(process.cwd(), 'data');
const UPLOADS = path.join(process.cwd(), 'public', 'uploads');

async function leer<T>(archivo: string): Promise<T[]> {
  try {
    return JSON.parse(await fs.readFile(path.join(DIR, archivo), 'utf8')) as T[];
  } catch {
    return [];
  }
}
async function escribir<T>(archivo: string, lista: T[]) {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(path.join(DIR, archivo), JSON.stringify(lista, null, 2), 'utf8');
}

export const dbLocal: DB = {
  async listarBriefs() {
    const lista = await leer<Brief>('briefings.json');
    return lista.sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn));
  },
  async obtenerBrief(id) {
    return (await leer<Brief>('briefings.json')).find((b) => b.id === id) ?? null;
  },
  async obtenerBriefPorToken(token) {
    return (await leer<Brief>('briefings.json')).find((b) => b.token === token) ?? null;
  },
  async crearBrief(parcial) {
    const ahora = new Date().toISOString();
    const brief: Brief = { id: nuevoId(), token: nuevoToken(), estado: 'borrador', creadoEn: ahora, actualizadoEn: ahora, datos: { ...DATOS_VACIOS, ...parcial } };
    const lista = await leer<Brief>('briefings.json');
    lista.push(brief);
    await escribir('briefings.json', lista);
    return brief;
  },
  async guardarBrief(brief) {
    const lista = await leer<Brief>('briefings.json');
    const i = lista.findIndex((b) => b.id === brief.id);
    if (i >= 0) lista[i] = brief; else lista.push(brief);
    await escribir('briefings.json', lista);
  },
  async cambiarEstado(id, estado) {
    const lista = await leer<Brief>('briefings.json');
    const b = lista.find((x) => x.id === id);
    if (!b) return;
    b.estado = estado;
    b.actualizadoEn = new Date().toISOString();
    await escribir('briefings.json', lista);
  },
  async listarProyectos(soloPublicados = false) {
    const lista = (await leer<Proyecto>('proyectos.json')).sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
    return soloPublicados ? lista.filter((p) => p.publicado) : lista;
  },
  async obtenerProyecto(id) {
    return (await leer<Proyecto>('proyectos.json')).find((p) => p.id === id) ?? null;
  },
  async guardarProyecto(p) {
    const lista = await leer<Proyecto>('proyectos.json');
    const i = lista.findIndex((x) => x.id === p.id);
    if (i >= 0) lista[i] = p; else lista.push(p);
    await escribir('proyectos.json', lista);
  },
  async eliminarProyecto(id) {
    await escribir('proyectos.json', (await leer<Proyecto>('proyectos.json')).filter((p) => p.id !== id));
  },
  async guardarArchivo(nombre, contenido) {
    await fs.mkdir(UPLOADS, { recursive: true });
    const seguro = `${Date.now()}-${nombre.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    await fs.writeFile(path.join(UPLOADS, seguro), contenido);
    return `/uploads/${seguro}`;
  },
};
