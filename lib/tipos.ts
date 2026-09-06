export type Estado = 'borrador' | 'nuevo' | 'en_progreso' | 'cerrado';
export type Red = 'instagram' | 'facebook' | 'tiktok' | 'whatsapp';

export interface BriefDatos {
  empresa: string;
  contacto: string;
  cargo: string;
  telefono: string;
  correo: string;
  sector: string;
  tieneWeb: '' | 'si' | 'no';
  webUrl: string;
  webGusta: string;
  webNoGusta: string;
  redes: { red: Red; usuario: string }[];
  logoUrl: string;
  colores: string[];
  tipografias: string;
  tipoSitio: string;
  referencias: { url: string; nota: string }[];
  secciones: string[];
  contenido: string;
  presupuesto: string;
  fechaLimite: string;
  notas: string;
  revisado: boolean;
}

export interface Brief {
  id: string;
  token: string;
  estado: Estado;
  creadoEn: string;
  actualizadoEn: string;
  enviadoEn?: string;
  datos: BriefDatos;
}

export interface Proyecto {
  id: string;
  titulo: string;
  cliente: string;
  url: string;
  descripcion: string;
  portadaUrl: string;
  etiquetas: string[];
  publicado: boolean;
  creadoEn: string;
}

export const DATOS_VACIOS: BriefDatos = {
  empresa: '', contacto: '', cargo: '', telefono: '', correo: '', sector: '',
  tieneWeb: '', webUrl: '', webGusta: '', webNoGusta: '',
  redes: [], logoUrl: '', colores: [], tipografias: '',
  tipoSitio: '', referencias: [], secciones: [], contenido: '',
  presupuesto: '', fechaLimite: '', notas: '', revisado: false,
};

export const ESTADOS: Record<Estado, string> = {
  borrador: 'Borrador', nuevo: 'Nuevo', en_progreso: 'En progreso', cerrado: 'Cerrado',
};
/** Clases de color de la etiqueta de cada estado (lista del panel y ficha). */
export const COLOR_ESTADO: Record<Estado, string> = {
  borrador: 'bg-fondo text-gris', nuevo: 'bg-acento text-blanco', en_progreso: 'bg-acento-suave text-acento-oscuro', cerrado: 'bg-tinta text-blanco',
};

export const SECTORES = ['Restaurante o cafetería', 'Tienda o comercio', 'Salud y bienestar', 'Belleza y moda', 'Servicios profesionales', 'Educación', 'Industria y técnico', 'Inmobiliaria', 'Turismo', 'Otro'];
export const TIPOS_SITIO = ['Landing page (una sola página)', 'Sitio corporativo (varias páginas)', 'Tienda en línea', 'Portafolio o catálogo', 'Otro'];
export const SECCIONES = ['Inicio', 'Nosotros', 'Servicios', 'Productos', 'Portafolio o galería', 'Testimonios', 'Blog o noticias', 'Preguntas frecuentes', 'Contacto', 'Reservas o citas'];
export const PRESUPUESTOS = ['Menos de 300 $', '300 a 600 $', '600 a 1.200 $', 'Más de 1.200 $', 'Aún no lo sé'];

export const REDES: Record<Red, { nombre: string; base: string }> = {
  instagram: { nombre: 'Instagram', base: 'https://instagram.com/' },
  facebook: { nombre: 'Facebook', base: 'https://facebook.com/' },
  tiktok: { nombre: 'TikTok', base: 'https://tiktok.com/@' },
  whatsapp: { nombre: 'WhatsApp Business', base: 'https://wa.me/' },
};

/** Convierte lo que pegue el cliente (enlace completo, @usuario, número) en solo el usuario. */
export function limpiarUsuario(red: Red, valor: string): string {
  let v = valor.trim();
  v = v.replace(/^https?:\/\/(www\.)?/i, '').replace(/^(instagram\.com|facebook\.com|tiktok\.com|wa\.me)\//i, '');
  v = v.replace(/[?#].*$/, '').replace(/\/+$/, '').replace(/^@/, '');
  if (red === 'whatsapp') v = v.replace(/[^\d]/g, '');
  return v;
}

export function urlRed(red: Red, usuario: string): string {
  return REDES[red].base + limpiarUsuario(red, usuario);
}

/** Vista previa automática de un sitio a partir de su dirección (servicio gratuito de capturas). */
export function capturaDe(url: string, ancho = 1200): string {
  const limpia = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return `https://image.thum.io/get/width/${ancho}/crop/${Math.round(ancho * 0.625)}/noanimate/${limpia}`;
}

/** Imagen a mostrar para un proyecto: la portada subida, o la captura automática del sitio. */
export function imagenProyecto(p: { portadaUrl: string; url: string }, ancho = 1200): string {
  return p.portadaUrl || (p.url ? capturaDe(p.url, ancho) : '');
}

/** Campos mínimos para poder enviar un briefing. */
export function validarMinimos(d: BriefDatos): string[] {
  const errores: string[] = [];
  if (d.empresa.trim().length < 2) errores.push('Nombre de la empresa');
  if (d.contacto.trim().length < 2) errores.push('Nombre de contacto');
  if (!d.telefono.trim() && !d.correo.trim()) errores.push('Teléfono o correo (al menos uno)');
  return errores;
}
