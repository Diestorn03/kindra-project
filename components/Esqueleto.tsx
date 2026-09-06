/** Bloques grises animados que ocupan el lugar del contenido mientras llega del servidor. */
export default function Esqueleto({ tarjetas = 4 }: { tarjetas?: number }) {
  return (
    <div className="grid gap-6" role="status" aria-busy="true" aria-label="Cargando">
      <div className="hueso h-5 w-40" />
      <div className="hueso h-11 w-2/3 max-w-md" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: tarjetas }, (_, i) => <div key={i} className="hueso h-32" style={{ animationDelay: `${i * 0.08}s` }} />)}
      </div>
    </div>
  );
}
