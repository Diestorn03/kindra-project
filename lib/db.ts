import type { Brief, BriefDatos, Proyecto } from './tipos';
import { dbLocal } from './db-local';
import { dbSupabase } from './db-supabase';

export interface DB {
  listarBriefs(): Promise<Brief[]>;
  obtenerBrief(id: string): Promise<Brief | null>;
  obtenerBriefPorToken(token: string): Promise<Brief | null>;
  crearBrief(parcial: Partial<BriefDatos>): Promise<Brief>;
  guardarBrief(brief: Brief): Promise<void>;
  listarProyectos(soloPublicados?: boolean): Promise<Proyecto[]>;
  obtenerProyecto(id: string): Promise<Proyecto | null>;
  guardarProyecto(p: Proyecto): Promise<void>;
  eliminarProyecto(id: string): Promise<void>;
  /** Guarda un archivo y devuelve su URL pública. */
  guardarArchivo(nombre: string, contenido: Buffer, tipo: string): Promise<string>;
}

// Con SUPABASE_URL definido se usa Supabase; si no, archivos locales en data/ y public/uploads/.
export const db: DB = process.env.SUPABASE_URL ? dbSupabase : dbLocal;

export function nuevoId(): string {
  return crypto.randomUUID();
}
export function nuevoToken(): string {
  const abc = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (b) => abc[b % abc.length]).join('');
}
