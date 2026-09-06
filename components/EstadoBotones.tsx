'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { COLOR_ESTADO, ESTADOS, type Estado } from '@/lib/tipos';

/**
 * Cambia el estado de un briefing sin recargar la página: el botón se pinta al instante
 * y el guardado va por detrás. Si falla, vuelve al estado anterior y avisa.
 */
export default function EstadoBotones({ id, inicial }: { id: string; inicial: Estado }) {
  const [estado, setEstado] = useState(inicial);
  const [error, setError] = useState(false);
  const router = useRouter();
  // Ignora respuestas de clics viejos si el usuario cambió de opinión rápido (evita que un
  // fallo tardío del primer clic revierta un cambio posterior que sí se guardó bien).
  const ultimo = useRef(0);

  // Si el navegador restaura esta página desde su caché (botón "Atrás"), React no vuelve a
  // montar el componente con el valor recién guardado — hay que resincronizar a mano.
  useEffect(() => setEstado(inicial), [inicial]);

  async function cambiar(nuevo: Estado) {
    if (nuevo === estado) return;
    const previo = estado;
    const propio = ++ultimo.current;
    setEstado(nuevo);
    setError(false);
    const r = await fetch('/api/panel/estado', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id, estado: nuevo }) }).catch(() => null);
    if (propio !== ultimo.current) return; // ya hay un clic más nuevo en curso; no pisar su resultado
    if (r?.status === 401) { router.push('/entrar'); return; }
    if (!r?.ok) { setEstado(previo); setError(true); return; }
    router.refresh(); // para que "Atrás" no muestre esta ficha con el estado de antes
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {(Object.keys(ESTADOS) as Estado[]).map((e) => (
        <button key={e} type="button" onClick={() => cambiar(e)} aria-pressed={estado === e}
          className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wide transition ${estado === e ? COLOR_ESTADO[e] + ' border-transparent' : 'border-linea bg-blanco text-gris hover:border-acento'}`}>
          {ESTADOS[e]}
        </button>
      ))}
      {error && <span className="text-[12px] text-acento-oscuro" role="alert">No se pudo guardar. Intenta de nuevo.</span>}
    </div>
  );
}
