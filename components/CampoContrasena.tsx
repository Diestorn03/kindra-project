'use client';
import { useState } from 'react';

/** Campo de contraseña con botón para verla mientras se escribe. */
export default function CampoContrasena({ id = 'password', name = 'password' }: { id?: string; name?: string }) {
  const [ver, setVer] = useState(false);
  return (
    <div className="relative mb-4">
      <input id={id} name={name} type={ver ? 'text' : 'password'} className="campo pr-12" autoFocus required autoComplete="current-password" />
      <button type="button" onClick={() => setVer((v) => !v)} aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={ver}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gris transition hover:bg-fondo hover:text-tinta">
        {ver ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
        )}
      </button>
    </div>
  );
}
