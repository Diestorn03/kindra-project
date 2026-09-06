import type { CSSProperties } from 'react';

/**
 * Envuelve cualquier bloque para que entre con una animación de aparición, en CSS puro.
 * (No usa Framer Motion: en esta configuración las animaciones por JavaScript se quedaban
 * congeladas a mitad de camino de forma intermitente. CSS es más simple y siempre confiable.)
 */
export default function Aparecer({ children, retraso = 0, className = '', y = 18 }: { children: React.ReactNode; retraso?: number; className?: string; y?: number }) {
  const estilo = { '--retraso': `${retraso}s`, '--y': `${y}px` } as CSSProperties;
  return <div className={`aparecer ${className}`} style={estilo}>{children}</div>;
}
