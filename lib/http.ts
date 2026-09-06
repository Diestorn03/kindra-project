import { NextResponse } from 'next/server';

/** Redirección 303 con ruta relativa: funciona con localhost, 127.0.0.1, la IP de la red local o el dominio final. */
export function redirigir(ruta: string): NextResponse {
  return new NextResponse(null, { status: 303, headers: { Location: ruta } });
}
