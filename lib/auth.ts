import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const COOKIE = 'kp_sesion';

/** Sin AUTH_SECRET (o con uno muy corto) no se firma nada: nadie entra hasta configurarlo. */
function secreto(): string {
  const s = process.env.AUTH_SECRET || '';
  return s.length >= 16 ? s : '';
}

function firma(): string {
  return createHmac('sha256', secreto()).update('kindra-panel').digest('hex');
}

/** Compara con hash de tamaño fijo: timingSafeEqual con largos distintos lanza una excepción
 *  (500 en vez de "incorrecto"), y eso deja adivinar el largo real probando intentos. */
function igual(a: string, b: string): boolean {
  const h = (s: string) => createHash('sha256').update(s).digest();
  return timingSafeEqual(h(a), h(b));
}

export function contrasenaCorrecta(intento: string): boolean {
  const real = process.env.ADMIN_PASSWORD || '';
  if (!secreto() || !real) return false;
  return igual(intento, real);
}

export function valorCookie(): string {
  return firma();
}

export async function estaAutenticado(): Promise<boolean> {
  if (!secreto()) return false;
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return false;
  return igual(c, firma());
}
