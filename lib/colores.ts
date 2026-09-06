/**
 * Extrae los colores dominantes de una imagen en el navegador (sin enviarla a ningún servidor).
 * Reduce la imagen, agrupa píxeles parecidos y descarta transparencias y blancos casi puros.
 */
export async function extraerColores(archivo: File, cantidad = 5): Promise<string[]> {
  const url = URL.createObjectURL(archivo);
  try {
    const img = await new Promise<HTMLImageElement>((ok, err) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => err(new Error('No se pudo leer la imagen'));
      i.src = url;
    });
    const lado = 80;
    const canvas = document.createElement('canvas');
    canvas.width = lado; canvas.height = lado;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0, lado, lado);
    const { data } = ctx.getImageData(0, 0, lado, lado);

    const cubos = new Map<string, { r: number; g: number; b: number; n: number }>();
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      if (a < 128) continue;
      if (r > 240 && g > 240 && b > 240) continue; // blanco de fondo
      const clave = `${r >> 4}-${g >> 4}-${b >> 4}`;
      const c = cubos.get(clave) ?? { r: 0, g: 0, b: 0, n: 0 };
      c.r += r; c.g += g; c.b += b; c.n += 1;
      cubos.set(clave, c);
    }
    const ordenados = [...cubos.values()].sort((a, b) => b.n - a.n).map((c) => ({ r: c.r / c.n, g: c.g / c.n, b: c.b / c.n, n: c.n }));

    // Une tonos demasiado parecidos para no repetir el mismo color
    const elegidos: { r: number; g: number; b: number }[] = [];
    for (const c of ordenados) {
      const parecido = elegidos.some((e) => Math.hypot(e.r - c.r, e.g - c.g, e.b - c.b) < 48);
      if (!parecido) elegidos.push(c);
      if (elegidos.length >= cantidad) break;
    }
    const hex = (v: number) => Math.round(v).toString(16).padStart(2, '0');
    return elegidos.map((c) => `#${hex(c.r)}${hex(c.g)}${hex(c.b)}`.toUpperCase());
  } finally {
    URL.revokeObjectURL(url);
  }
}
