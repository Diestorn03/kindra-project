import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const COOKIE = 'kp_sesion';

function firma(): string {
  return createHmac('sha256', process.env.AUTH_SECRET || 'sin-secreto').update('kindra-panel').digest('hex');
}

export function contrasenaCorrecta(intento: string): boolean {
  const real = process.env.ADMIN_PASSWORD || '';
  if (!real || intento.length !== real.length) return false;
  return timingSafeEqual(Buffer.from(intento), Buffer.from(real));
}

export function valorCookie(): string {
  return firma();
}

export async function estaAutenticado(): Promise<boolean> {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return false;
  const f = firma();
  return c.length === f.length && timingSafeEqual(Buffer.from(c), Buffer.from(f));
}
