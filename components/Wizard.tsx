'use client';
import { useEffect, useRef, useState } from 'react';
import { extraerColores } from '@/lib/colores';
import { type BriefDatos, type Red, REDES, SECTORES, TIPOS_SITIO, SECCIONES, PRESUPUESTOS, limpiarUsuario, urlRed, validarMinimos } from '@/lib/tipos';

const PASOS = [
  { nombre: 'Tu empresa', titulo: 'Empecemos por lo básico', ayuda: 'Solo necesitamos saber quién eres y cómo contactarte.' },
  { nombre: 'Presencia', titulo: '¿Cómo están hoy en internet?', ayuda: 'Página web y redes actuales, si las tienen.' },
  { nombre: 'Marca', titulo: 'Tu identidad de marca', ayuda: 'Sube el logo y detectamos sus colores automáticamente.' },
  { nombre: 'Proyecto', titulo: 'Qué vamos a construir', ayuda: 'El tipo de sitio y ejemplos que te gusten.' },
  { nombre: 'Condiciones', titulo: 'Presupuesto y tiempos', ayuda: 'Un rango aproximado nos basta.' },
  { nombre: 'Resumen', titulo: 'Revisa y envía', ayuda: 'Puedes volver a cualquier paso antes de enviar.' },
];

const ICONOS: Record<Red, React.ReactNode> = {
  instagram: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
  facebook: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8h3.3z" /></svg>,
  tiktok: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2.3 1.7 3.8 4 4v3.1c-1.5 0-2.9-.5-4-1.3v6.4a5.7 5.7 0 1 1-5.7-5.7c.3 0 .7 0 1 .1v3.2a2.6 2.6 0 1 0 1.6 2.4V3h3.1z" /></svg>,
  whatsapp: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-13.3 7.9L3 21l1.1-4.7A9 9 0 1 1 21 12z" /></svg>,
};

export default function Wizard({ token, inicial, yaEnviado }: { token: string; inicial: BriefDatos; yaEnviado: boolean }) {
  const [d, setD] = useState<BriefDatos>(inicial);
  const [pantalla, setPantalla] = useState<'intro' | 'pasos' | 'listo'>(yaEnviado ? 'pasos' : 'intro');
  const [paso, setPaso] = useState(0);
  const [dir, setDir] = useState(1);
  const [estado, setEstado] = useState<'' | 'guardando' | 'guardado' | 'error'>('');
  const [faltan, setFaltan] = useState<string[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const primera = useRef(true);
  const set = (p: Partial<BriefDatos>) => setD((x) => ({ ...x, ...p }));

  async function guardar(datos: BriefDatos, extra: Record<string, unknown> = {}) {
    setEstado('guardando');
    const r = await fetch(`/api/briefings/${token}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ datos, ...extra }) });
    setEstado(r.ok ? 'guardado' : 'error');
    return r;
  }
  // Guardado automático mientras se escribe
  useEffect(() => {
    if (primera.current) { primera.current = false; return; }
    const t = setTimeout(() => guardar(d), 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d]);

  function ir(n: number) {
    setDir(n > paso ? 1 : -1);
    setPaso(Math.max(0, Math.min(PASOS.length - 1, n)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // La pestaña del paso activo siempre queda a la vista (en el teléfono la fila se desplaza)
  useEffect(() => {
    document.querySelector<HTMLElement>('[data-paso-activo]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [paso]);
  async function enviar() {
    const f = validarMinimos(d);
    if (f.length) { setFaltan(f); ir(0); return; }
    const r = await guardar(d, { enviar: true });
    if (r.ok) setPantalla('listo');
  }
  async function subirLogo(archivo: File) {
    setSubiendo(true);
    try {
      const fd = new FormData();
      fd.append('archivo', archivo); fd.append('token', token);
      const { url } = await (await fetch('/api/subir', { method: 'POST', body: fd })).json();
      const colores = await extraerColores(archivo).catch(() => [] as string[]);
      set({ logoUrl: url, colores: colores.length ? colores : d.colores });
    } finally { setSubiendo(false); }
  }
  const toggleRed = (red: Red) => set({ redes: d.redes.some((r) => r.red === red) ? d.redes.filter((r) => r.red !== red) : [...d.redes, { red, usuario: '' }] });
  const setUsuario = (red: Red, usuario: string) => set({ redes: d.redes.map((r) => (r.red === red ? { ...r, usuario } : r)) });
  const alternar = (lista: string[], v: string) => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]);

  if (pantalla === 'intro') {
    return (
      <div className="aparecer tarjeta mx-auto max-w-xl p-8 sm:p-12">
        <p className="etiqueta mb-4">Briefing</p>
        <h1 className="titulo text-4xl sm:text-5xl">{d.empresa ? `Hola, ${d.empresa}.` : 'Cuéntanos de tu marca.'}</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-gris">Con esto entendemos qué necesitas para diseñar tu página. Son seis pasos cortos.</p>
        <ul className="mt-6 grid gap-3 text-[15px]">
          {['Toma unos 5 minutos.', 'Puedes dejar en blanco lo que no sepas.', 'Se guarda solo: cierra y vuelve cuando quieras.'].map((t, i) => (
            <li key={t} className="aparecer flex items-center gap-3" style={{ '--retraso': `${0.15 + i * 0.08}s`, '--y': '0px' } as React.CSSProperties}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-acento-suave text-[12px] font-bold text-acento-oscuro">{i + 1}</span>{t}
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => setPantalla('pasos')} className="btn mt-8 w-full py-4 text-[16px]">Empezar</button>
      </div>
    );
  }

  if (pantalla === 'listo') {
    return (
      <div className="aparecer tarjeta mx-auto max-w-xl p-10 text-center sm:p-14">
        <div className="check-pop mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-acento text-4xl text-blanco">✓</div>
        <h2 className="titulo text-4xl">¡Listo, {d.contacto || 'gracias'}!</h2>
        <p className="mt-4 text-[16px] text-gris">Ya tenemos lo que necesitamos para empezar con {d.empresa || 'tu proyecto'}. Te escribimos pronto con la propuesta.</p>
        <button type="button" onClick={() => setPantalla('pasos')} className="btn-suave mt-8">Revisar mis respuestas</button>
      </div>
    );
  }

  const p = PASOS[paso];
  const Campo = ({ etiqueta, opcional, children }: { etiqueta: string; opcional?: boolean; children: React.ReactNode }) => (
    <div><label className="mb-2 block text-[14px] font-semibold">{etiqueta}{opcional && <span className="ml-1.5 text-[12px] font-normal text-gris">opcional</span>}</label>{children}</div>
  );
  const Chip = ({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" onClick={onClick} className={`chip ${activo ? 'chip-activo' : ''}`}>{children}</button>
  );

  return (
    <div className="mx-auto max-w-2xl pb-28">
      {/* Pasos */}
      <ol className="mb-6 flex items-center gap-1 overflow-x-auto" aria-label="Pasos">
        {PASOS.map((s, i) => (
          <li key={s.nombre} className="flex items-center">
            <button type="button" onClick={() => ir(i)} data-paso-activo={i === paso ? '' : undefined} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${i === paso ? 'bg-tinta text-blanco' : i < paso ? 'text-acento-oscuro hover:bg-acento-suave' : 'text-gris hover:bg-blanco'}`}>
              {i < paso ? '✓ ' : ''}{s.nombre}
            </button>
            {i < PASOS.length - 1 && <span className="mx-0.5 h-px w-3 bg-linea" />}
          </li>
        ))}
      </ol>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-acento-suave">
        <div className="progreso-barra h-full rounded-full bg-acento" style={{ width: `${((paso + 1) / PASOS.length) * 100}%` }} />
      </div>

      {faltan.length > 0 && paso === 0 && (
        <p className="aparecer mb-4 rounded-xl border border-acento bg-acento-suave px-4 py-3 text-[14px]" style={{ '--y': '0px' } as React.CSSProperties} role="alert">
          Para enviar solo falta: <b>{faltan.join(', ')}</b>.
        </p>
      )}

      <section key={paso} className={`tarjeta p-6 sm:p-9 ${dir >= 0 ? 'paso-der' : 'paso-izq'}`}>
        <h2 className="titulo text-3xl sm:text-4xl">{p.titulo}</h2>
        <p className="mb-7 mt-2 text-[15px] text-gris">{p.ayuda}</p>

        {paso === 0 && (
          <div className="grid gap-5">
            <Campo etiqueta="Nombre de la empresa o marca"><input className="campo" value={d.empresa} onChange={(e) => set({ empresa: e.target.value })} placeholder="Ej.: Café Andrade" autoFocus /></Campo>
            <div className="grid gap-5 sm:grid-cols-2">
              <Campo etiqueta="Persona de contacto"><input className="campo" value={d.contacto} onChange={(e) => set({ contacto: e.target.value })} placeholder="Nombre" /></Campo>
              <Campo etiqueta="Cargo" opcional><input className="campo" value={d.cargo} onChange={(e) => set({ cargo: e.target.value })} placeholder="Dueño, gerente…" /></Campo>
              <Campo etiqueta="Teléfono"><input className="campo" type="tel" value={d.telefono} onChange={(e) => set({ telefono: e.target.value })} placeholder="+58…" /></Campo>
              <Campo etiqueta="Correo"><input className="campo" type="email" value={d.correo} onChange={(e) => set({ correo: e.target.value })} placeholder="nombre@empresa.com" /></Campo>
            </div>
            <p className="-mt-2 text-[13px] text-gris">Con teléfono o correo basta.</p>
            <Campo etiqueta="Sector" opcional><div className="flex flex-wrap gap-2">{SECTORES.map((s) => <Chip key={s} activo={d.sector === s} onClick={() => set({ sector: d.sector === s ? '' : s })}>{s}</Chip>)}</div></Campo>
          </div>
        )}

        {paso === 1 && (
          <div className="grid gap-6">
            <Campo etiqueta="¿Ya tienen página web?" opcional>
              <div className="flex gap-2">
                <Chip activo={d.tieneWeb === 'si'} onClick={() => set({ tieneWeb: 'si' })}>Sí</Chip>
                <Chip activo={d.tieneWeb === 'no'} onClick={() => set({ tieneWeb: 'no', webUrl: '', webGusta: '', webNoGusta: '' })}>No</Chip>
              </div>
            </Campo>
            {d.tieneWeb === 'si' && (
              <div className="aparecer grid gap-4" style={{ '--y': '0px' } as React.CSSProperties}>
                <Campo etiqueta="Dirección"><input className="campo" value={d.webUrl} onChange={(e) => set({ webUrl: e.target.value })} placeholder="www.miempresa.com" /></Campo>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Campo etiqueta="Qué les gusta de ella"><textarea className="campo" rows={3} value={d.webGusta} onChange={(e) => set({ webGusta: e.target.value })} /></Campo>
                  <Campo etiqueta="Qué no les gusta"><textarea className="campo" rows={3} value={d.webNoGusta} onChange={(e) => set({ webNoGusta: e.target.value })} /></Campo>
                </div>
              </div>
            )}
            <Campo etiqueta="Redes sociales" opcional>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(REDES) as Red[]).map((red) => <Chip key={red} activo={d.redes.some((r) => r.red === red)} onClick={() => toggleRed(red)}>{ICONOS[red]} {REDES[red].nombre}</Chip>)}
              </div>
              <div className="mt-4 grid gap-3">
                {d.redes.map((r) => (
                  <div key={r.red} className="aparecer flex items-center gap-2" style={{ '--y': '0px' } as React.CSSProperties}>
                    <span className="text-acento">{ICONOS[r.red]}</span>
                    <input className="campo" value={r.usuario} onChange={(e) => setUsuario(r.red, e.target.value)} onBlur={(e) => setUsuario(r.red, limpiarUsuario(r.red, e.target.value))} placeholder={r.red === 'whatsapp' ? 'Número con código de país' : 'usuario o enlace del perfil'} />
                    {r.usuario && <a href={urlRed(r.red, r.usuario)} target="_blank" rel="noopener" className="btn-suave whitespace-nowrap px-4 py-3">Abrir</a>}
                  </div>
                ))}
              </div>
            </Campo>
          </div>
        )}

        {paso === 2 && (
          <div className="grid gap-6">
            <Campo etiqueta="Logo" opcional>
              <label className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition ${d.logoUrl ? 'border-acento bg-acento-suave/40' : 'border-linea bg-blanco hover:border-acento hover:bg-acento-suave/30'}`}>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && subirLogo(e.target.files[0])} />
                {d.logoUrl ? <img key={d.logoUrl} className="pop-in max-h-32 object-contain" src={d.logoUrl} alt="Logo" /> : <span className="flex h-12 w-12 items-center justify-center rounded-full bg-acento-suave text-2xl text-acento-oscuro">＋</span>}
                <span className="text-[14px] text-gris">{subiendo ? 'Subiendo y leyendo colores…' : d.logoUrl ? 'Toca para cambiar el logo' : 'Toca aquí o arrastra la imagen del logo'}</span>
              </label>
            </Campo>
            <Campo etiqueta="Colores de la marca" opcional>
              {d.colores.length > 0 && <p className="mb-3 text-[13px] text-gris">Los detectamos en el logo. Quita los que no sean de la marca o agrega otros.</p>}
              <div className="flex flex-wrap items-center gap-2">
                {d.colores.map((c) => (
                  <span key={c} className="pop-in inline-flex items-center gap-2 rounded-full border border-linea bg-blanco py-1.5 pl-1.5 pr-3 font-mono text-[13px]">
                    <span className="h-7 w-7 rounded-full border border-black/10" style={{ background: c }} />{c}
                    <button type="button" aria-label={`Quitar ${c}`} onClick={() => set({ colores: d.colores.filter((x) => x !== c) })} className="ml-1 text-gris hover:text-acento">×</button>
                  </span>
                ))}
                <label className="chip border-dashed">＋ Agregar color<input type="color" className="h-0 w-0 opacity-0" onChange={(e) => { const c = e.target.value.toUpperCase(); if (!d.colores.includes(c)) set({ colores: [...d.colores, c] }); }} /></label>
              </div>
            </Campo>
            <Campo etiqueta="Tipografías que ya usan" opcional><input className="campo" value={d.tipografias} onChange={(e) => set({ tipografias: e.target.value })} placeholder="Si no saben, las proponemos nosotros" /></Campo>
          </div>
        )}

        {paso === 3 && (
          <div className="grid gap-6">
            <Campo etiqueta="Tipo de sitio" opcional><div className="flex flex-wrap gap-2">{TIPOS_SITIO.map((t) => <Chip key={t} activo={d.tipoSitio === t} onClick={() => set({ tipoSitio: d.tipoSitio === t ? '' : t })}>{t}</Chip>)}</div></Campo>
            <Campo etiqueta="Sitios que les gustan" opcional>
              <div className="grid gap-2">
                {d.referencias.map((ref, i) => (
                  <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <input className="campo" value={ref.url} onChange={(e) => set({ referencias: d.referencias.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)) })} placeholder="Dirección del sitio" />
                    <input className="campo" value={ref.nota} onChange={(e) => set({ referencias: d.referencias.map((x, j) => (j === i ? { ...x, nota: e.target.value } : x)) })} placeholder="Qué les gusta de él" />
                    <button type="button" className="btn-suave px-4" onClick={() => set({ referencias: d.referencias.filter((_, j) => j !== i) })} aria-label="Quitar">×</button>
                  </div>
                ))}
                {d.referencias.length < 3 && <button type="button" className="btn-suave justify-self-start" onClick={() => set({ referencias: [...d.referencias, { url: '', nota: '' }] })}>＋ Agregar referencia</button>}
              </div>
            </Campo>
            <Campo etiqueta="Secciones que necesita" opcional><div className="flex flex-wrap gap-2">{SECCIONES.map((s) => <Chip key={s} activo={d.secciones.includes(s)} onClick={() => set({ secciones: alternar(d.secciones, s) })}>{s}</Chip>)}</div></Campo>
            <Campo etiqueta="Contenido disponible" opcional><textarea className="campo" rows={3} value={d.contenido} onChange={(e) => set({ contenido: e.target.value })} placeholder="¿Tienen textos y fotos propias, o hay que crearlos?" /></Campo>
          </div>
        )}

        {paso === 4 && (
          <div className="grid gap-6">
            <Campo etiqueta="Rango de presupuesto" opcional><div className="flex flex-wrap gap-2">{PRESUPUESTOS.map((x) => <Chip key={x} activo={d.presupuesto === x} onClick={() => set({ presupuesto: d.presupuesto === x ? '' : x })}>{x}</Chip>)}</div></Campo>
            <Campo etiqueta="Fecha límite" opcional><input className="campo max-w-xs" type="date" value={d.fechaLimite} onChange={(e) => set({ fechaLimite: e.target.value })} /></Campo>
            <Campo etiqueta="Notas" opcional><textarea className="campo" rows={4} value={d.notas} onChange={(e) => set({ notas: e.target.value })} placeholder="Cualquier cosa que quieran que sepamos" /></Campo>
          </div>
        )}

        {paso === 5 && (
          <div className="grid gap-5">
            <dl className="grid gap-3 rounded-2xl bg-fondo p-5 text-[15px] sm:grid-cols-2">
              <Dato k="Empresa" v={d.empresa} /><Dato k="Contacto" v={[d.contacto, d.cargo].filter(Boolean).join(', ')} />
              <Dato k="Teléfono" v={d.telefono} /><Dato k="Correo" v={d.correo} /><Dato k="Sector" v={d.sector} />
              <Dato k="Web actual" v={d.tieneWeb === 'no' ? 'No tiene' : d.webUrl} />
              <Dato k="Redes" v={d.redes.map((r) => `${REDES[r.red].nombre}: ${r.usuario || '—'}`).join(' · ')} />
              <Dato k="Colores" v={d.colores.join(', ')} /><Dato k="Tipo de sitio" v={d.tipoSitio} />
              <Dato k="Secciones" v={d.secciones.join(', ')} /><Dato k="Presupuesto" v={d.presupuesto} /><Dato k="Fecha límite" v={d.fechaLimite} />
            </dl>
            {d.logoUrl && <img src={d.logoUrl} alt="Logo" className="max-h-20 self-start object-contain" />}
            <label className="flex items-center gap-3 text-[15px]"><input type="checkbox" checked={d.revisado} onChange={(e) => set({ revisado: e.target.checked })} className="h-5 w-5 accent-acento" /> Revisé el resumen y está correcto</label>
          </div>
        )}
      </section>

      {/* Barra fija */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-linea bg-fondo/85 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-5 py-3">
          <button type="button" className="btn-suave" onClick={() => ir(paso - 1)} disabled={paso === 0}>Atrás</button>
          <span className="font-mono text-[11px] text-gris">{estado === 'guardando' ? 'Guardando…' : estado === 'guardado' ? 'Guardado ✓' : estado === 'error' ? 'Sin conexión' : ''}</span>
          {paso < PASOS.length - 1
            ? <button type="button" className="btn" onClick={() => ir(paso + 1)}>Siguiente</button>
            : <button type="button" className="btn" onClick={enviar}>Enviar briefing</button>}
        </div>
      </div>
    </div>
  );
}

function Dato({ k, v }: { k: string; v: string }) {
  if (!v) return null;
  return <div><dt className="text-[12px] font-semibold uppercase tracking-wide text-gris">{k}</dt><dd className="mt-0.5">{v}</dd></div>;
}
