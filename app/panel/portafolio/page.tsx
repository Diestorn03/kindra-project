import Link from 'next/link';
import { db } from '@/lib/db';
import { imagenProyecto } from '@/lib/tipos';

export default async function PortafolioPanel({ searchParams }: { searchParams: Promise<{ editar?: string; nuevo?: string }> }) {
  const { editar, nuevo } = await searchParams;
  const proyectos = await db.listarProyectos();
  const p = editar ? proyectos.find((x) => x.id === editar) : undefined;
  const mostrarForm = Boolean(p || nuevo || proyectos.length === 0);

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="etiqueta mb-1">Portafolio</p><h1 className="titulo text-4xl">{proyectos.length} proyecto{proyectos.length === 1 ? '' : 's'}</h1></div>
        <div className="flex gap-2">
          <Link href="/portafolio" target="_blank" className="btn-suave">Ver como cliente ↗</Link>
          {!mostrarForm && <Link href="/panel/portafolio?nuevo=1" className="btn">＋ Agregar proyecto</Link>}
        </div>
      </div>

      {mostrarForm && (
        <form method="post" action="/api/panel/proyectos" encType="multipart/form-data" className="tarjeta entrar grid gap-4 p-6 sm:grid-cols-2" key={p?.id ?? 'nuevo'}>
          <h2 className="titulo text-2xl sm:col-span-2">{p ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
          {p && <input type="hidden" name="id" value={p.id} />}
          <div><label className="mb-1.5 block text-[14px] font-semibold">Título</label><input name="titulo" className="campo" defaultValue={p?.titulo} required placeholder="Sitio web de GEMPRO" /></div>
          <div><label className="mb-1.5 block text-[14px] font-semibold">Cliente</label><input name="cliente" className="campo" defaultValue={p?.cliente} placeholder="GEMPRO S.A." /></div>
          <div className="sm:col-span-2"><label className="mb-1.5 block text-[14px] font-semibold">Dirección del sitio</label><input name="url" className="campo" defaultValue={p?.url} placeholder="https://…" /><p className="mt-1.5 text-[12px] text-gris">Con la dirección se genera la vista previa sola. Sube una portada solo si quieres otra imagen.</p></div>
          <div className="sm:col-span-2"><label className="mb-1.5 block text-[14px] font-semibold">Descripción</label><textarea name="descripcion" className="campo" rows={3} defaultValue={p?.descripcion} placeholder="Qué se hizo y qué logró" /></div>
          <div><label className="mb-1.5 block text-[14px] font-semibold">Etiquetas (separadas por coma)</label><input name="etiquetas" className="campo" defaultValue={p?.etiquetas.join(', ')} placeholder="Web, Redes, Marca" /></div>
          <div>
            <label className="mb-1.5 block text-[14px] font-semibold">Portada {p?.portadaUrl && '(sube otra para cambiarla)'}</label>
            <input name="portada" type="file" accept="image/*" className="campo text-[14px]" />
            {p?.portadaUrl && <label className="mt-2 flex items-center gap-2 text-[13px]"><input type="checkbox" name="quitar_portada" className="h-4 w-4 accent-acento" /> Quitar la portada y usar la captura automática del sitio</label>}
          </div>
          <label className="flex items-center gap-2 text-[14px] sm:col-span-2"><input type="checkbox" name="publicado" defaultChecked={p?.publicado ?? true} className="h-4 w-4 accent-acento" /> Visible en el portafolio público</label>
          <div className="flex gap-2 sm:col-span-2"><button className="btn" type="submit">Guardar</button><Link href="/panel/portafolio" className="btn-suave">Cancelar</Link></div>
        </form>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {proyectos.map((x) => (
          <li key={x.id} className="tarjeta entrar overflow-hidden">
            <Link href={`/portafolio/${x.id}`} target="_blank" className="block aspect-[16/10] overflow-hidden bg-acento-suave">
              {imagenProyecto(x, 800) && <img src={imagenProyecto(x, 800)} alt="" className="h-full w-full object-cover object-top" />}
            </Link>
            <div className="p-4">
              <p className="font-semibold">{x.titulo}</p>
              <p className="text-[13px] text-gris">{x.cliente}{x.publicado ? '' : ' · oculto'}</p>
              <div className="mt-3 flex gap-2 text-[13px]">
                <Link href={`/portafolio/${x.id}`} target="_blank" className="btn-suave px-3 py-1.5">Presentar</Link>
                <Link href={`/panel/portafolio?editar=${x.id}`} className="btn-suave px-3 py-1.5">Editar</Link>
                <form method="post" action="/api/panel/proyectos"><input type="hidden" name="_accion" value="eliminar" /><input type="hidden" name="id" value={x.id} /><button className="btn-suave px-3 py-1.5 text-acento-oscuro" type="submit">Eliminar</button></form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
