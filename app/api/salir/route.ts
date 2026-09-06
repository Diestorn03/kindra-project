import { COOKIE } from '@/lib/auth';
import { redirigir } from '@/lib/http';

export async function POST() {
  const res = redirigir('/entrar');
  res.cookies.set(COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
