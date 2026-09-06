import { COOKIE, contrasenaCorrecta, valorCookie } from '@/lib/auth';
import { redirigir } from '@/lib/http';

export async function POST(req: Request) {
  const form = await req.formData();
  const intento = String(form.get('password') ?? '');
  if (!contrasenaCorrecta(intento)) return redirigir('/entrar?error=1');
  const res = redirigir('/panel');
  res.cookies.set(COOKIE, valorCookie(), { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
  return res;
}
