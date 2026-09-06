import type { Brief, BriefDatos, Proyecto } from './tipos';
import { dbLocal } from './db-local';
import { dbSupabase } from './db-supabase';

export interface DB {
  listarBriefs(): Promise<Brief[]>;
  obtenerBrief(id: string): Promise<Brief | null>;
  obtenerBriefPorToken(token: string): Promise<Brief | null>;
  crearBrief(parcial: Partial<BriefDatos>): Promise<Brief>;
  guardarBrief(brief: Brief): Promise<void>;
  /** Cambia solo el estado (no toca datos/enviadoEn) — evita pisar una edición reciente con una lectura vieja. */
  cambiarEstado(id: string, estado: Brief['estado']): Promise<void>;
  listarProyectos(soloPublicados?: boolean): Promise<Proyecto[]>;
  obtenerProyecto(id: string): Promise<Proyecto | null>;
  guardarProyecto(p: Proyecto): Promise<void>;
  eliminarProyecto(id: string): Promise<void>;
  /** Guarda un archivo y devuelve su URL pública. */
  guardarArchivo(nombre: string, contenido: Buffer, tipo: string): Promise<string>;
}

/*
 * Caché de lecturas en memoria.
 * Cada viaje a Supabase cuesta cientos de milisegundos desde Venezuela; sin esto, cada clic
 * del panel o del portafolio repetía el viaje aunque nada hubiera cambiado. Las lecturas se
 * guardan unos segundos y cualquier escritura borra lo relacionado, así el panel siempre ve
 * sus propios cambios al instante. (El formulario público se lee siempre fresco: es la
 * versión que el cliente está editando.)
 */
const VIDA_MS = 5_000;
// En globalThis porque el empaquetador emite este módulo por separado para rutas API y páginas:
// con un Map por módulo, la escritura de la API no vaciaba la caché que usaban las páginas.
type Entrada = { valor: unknown; vence: number };
const memoria: Map<string, Entrada> = ((globalThis as { __kpCache?: Map<string, Entrada> }).__kpCache ??= new Map());

// Tope para que IDs inventados en /portafolio/[id] (público, sin sesión) no hagan crecer el mapa sin límite.
const MAX_ENTRADAS = 500;

async function cacheado<T>(clave: string, leer: () => Promise<T>): Promise<T> {
  const hit = memoria.get(clave);
  if (hit && hit.vence > Date.now()) return hit.valor as T;
  const valor = await leer();
  if (memoria.size >= MAX_ENTRADAS) memoria.clear();
  memoria.set(clave, { valor, vence: Date.now() + VIDA_MS });
  return valor;
}
function olvidar(prefijo: string) {
  for (const k of memoria.keys()) if (k.startsWith(prefijo)) memoria.delete(k);
}
/** Invalida SIEMPRE, incluso si la escritura falla — si no, un error deja en la caché un valor
 *  que ya no es lo que hay en la base de datos (por ejemplo, cuando la ruta muta el objeto leído
 *  antes de intentar guardarlo). */
async function escribir(base: () => Promise<void>, prefijo: string) {
  try { await base(); } finally { olvidar(prefijo); }
}

function conCache(base: DB): DB {
  return {
    listarBriefs: () => cacheado('briefings:lista', () => base.listarBriefs()),
    obtenerBrief: (id) => cacheado(`briefings:id:${id}`, () => base.obtenerBrief(id)),
    obtenerBriefPorToken: (token) => base.obtenerBriefPorToken(token),
    async crearBrief(parcial) { const b = await base.crearBrief(parcial); olvidar('briefings'); return b; },
    guardarBrief: (b) => escribir(() => base.guardarBrief(b), 'briefings'),
    cambiarEstado: (id, estado) => escribir(() => base.cambiarEstado(id, estado), 'briefings'),
    listarProyectos: (solo = false) => cacheado(`proyectos:lista:${solo}`, () => base.listarProyectos(solo)),
    obtenerProyecto: (id) => cacheado(`proyectos:id:${id}`, () => base.obtenerProyecto(id)),
    guardarProyecto: (p) => escribir(() => base.guardarProyecto(p), 'proyectos'),
    eliminarProyecto: (id) => escribir(() => base.eliminarProyecto(id), 'proyectos'),
    guardarArchivo: (n, c, t) => base.guardarArchivo(n, c, t),
  };
}

// Con SUPABASE_URL definido se usa Supabase; si no, archivos locales en data/ y public/uploads/.
export const db: DB = conCache(process.env.SUPABASE_URL ? dbSupabase : dbLocal);

export function nuevoId(): string {
  return crypto.randomUUID();
}
export function nuevoToken(): string {
  const abc = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (b) => abc[b % abc.length]).join('');
}
