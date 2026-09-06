import PanelLista from '@/components/PanelLista';
import { db } from '@/lib/db';

export default async function Panel() {
  const todos = await db.listarBriefs();

  return (
    <div className="grid gap-10">
      {/* Acciones principales */}
      <section className="grid gap-4 md:grid-cols-2">
        <form method="post" action="/api/briefings" className="tarjeta entrar flex flex-col gap-4 p-7">
          <input type="hidden" name="modo" value="abrir" />
          <div><p className="etiqueta">En la reunión</p><h2 className="titulo mt-1 text-2xl">Empezar briefing ahora</h2><p className="mt-1 text-[14px] text-gris">Se abre el formulario aquí mismo para llenarlo con el cliente.</p></div>
          <div className="mt-auto flex flex-col gap-2 sm:flex-row"><input name="empresa" className="campo" placeholder="Nombre del cliente (opcional)" /><button className="btn whitespace-nowrap" type="submit">Empezar →</button></div>
        </form>
        <form method="post" action="/api/briefings" className="tarjeta entrar flex flex-col gap-4 p-7">
          <input type="hidden" name="modo" value="enlace" />
          <div><p className="etiqueta">A distancia</p><h2 className="titulo mt-1 text-2xl">Crear enlace para enviar</h2><p className="mt-1 text-[14px] text-gris">Genera el enlace y mándalo por WhatsApp para que el cliente lo llene solo.</p></div>
          <div className="mt-auto flex flex-col gap-2 sm:flex-row"><input name="empresa" className="campo" placeholder="Nombre del cliente (opcional)" /><button className="btn-suave whitespace-nowrap" type="submit">Crear enlace</button></div>
        </form>
      </section>

      <PanelLista todos={todos} />
    </div>
  );
}
