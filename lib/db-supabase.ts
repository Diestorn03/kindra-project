import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { DB } from './db';
import { nuevoToken } from './db';
import { DATOS_VACIOS, type Brief, type Proyecto } from './tipos';

let cliente: SupabaseClient | null = null;
function sb() {
  if (!cliente) cliente = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, { auth: { persistSession: false } });
  return cliente;
}

// Filas de la tabla: { id, token, estado, datos (jsonb), creado_en, actualizado_en, enviado_en }
type FilaBrief = { id: string; token: string; estado: Brief['estado']; datos: Brief['datos']; creado_en: string; actualizado_en: string; enviado_en: string | null };
type FilaProyecto = { id: string; publicado: boolean; datos: Omit<Proyecto, 'id' | 'publicado' | 'creadoEn'>; creado_en: string };

const aBrief = (f: FilaBrief): Brief => ({ id: f.id, token: f.token, estado: f.estado, datos: { ...DATOS_VACIOS, ...f.datos }, creadoEn: f.creado_en, actualizadoEn: f.actualizado_en, enviadoEn: f.enviado_en ?? undefined });
const aProyecto = (f: FilaProyecto): Proyecto => ({ id: f.id, publicado: f.publicado, creadoEn: f.creado_en, ...f.datos });

export const dbSupabase: DB = {
  async listarBriefs() {
    const { data, error } = await sb().from('briefings').select('*').order('actualizado_en', { ascending: false });
    if (error) throw error;
    return (data as FilaBrief[]).map(aBrief);
  },
  async obtenerBrief(id) {
    const { data } = await sb().from('briefings').select('*').eq('id', id).maybeSingle();
    return data ? aBrief(data as FilaBrief) : null;
  },
  async obtenerBriefPorToken(token) {
    const { data } = await sb().from('briefings').select('*').eq('token', token).maybeSingle();
    return data ? aBrief(data as FilaBrief) : null;
  },
  async crearBrief(parcial) {
    const { data, error } = await sb().from('briefings').insert({ token: nuevoToken(), estado: 'borrador', datos: { ...DATOS_VACIOS, ...parcial } }).select().single();
    if (error) throw error;
    return aBrief(data as FilaBrief);
  },
  async guardarBrief(b) {
    const { error } = await sb().from('briefings').update({ estado: b.estado, datos: b.datos, actualizado_en: new Date().toISOString(), enviado_en: b.enviadoEn ?? null }).eq('id', b.id);
    if (error) throw error;
  },
  async listarProyectos(soloPublicados = false) {
    let q = sb().from('proyectos').select('*').order('creado_en', { ascending: false });
    if (soloPublicados) q = q.eq('publicado', true);
    const { data, error } = await q;
    if (error) throw error;
    return (data as FilaProyecto[]).map(aProyecto);
  },
  async obtenerProyecto(id) {
    const { data } = await sb().from('proyectos').select('*').eq('id', id).maybeSingle();
    return data ? aProyecto(data as FilaProyecto) : null;
  },
  async guardarProyecto(p) {
    const { id, publicado, creadoEn, ...datos } = p;
    const { error } = await sb().from('proyectos').upsert({ id, publicado, datos, creado_en: creadoEn });
    if (error) throw error;
  },
  async eliminarProyecto(id) {
    const { error } = await sb().from('proyectos').delete().eq('id', id);
    if (error) throw error;
  },
  async guardarArchivo(nombre, contenido, tipo) {
    const ruta = `${Date.now()}-${nombre.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const { error } = await sb().storage.from('archivos').upload(ruta, contenido, { contentType: tipo, upsert: true });
    if (error) throw error;
    return sb().storage.from('archivos').getPublicUrl(ruta).data.publicUrl;
  },
};
