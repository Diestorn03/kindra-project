'use client';
import { motion } from 'motion/react';

/**
 * Envuelve cualquier bloque para que entre con una animación suave.
 * inmediato: anima al cargar (para lo que está arriba del pliegue); si no, anima al entrar en pantalla.
 */
export default function Aparecer({ children, retraso = 0, className = '', y = 18, inmediato = false }: { children: React.ReactNode; retraso?: number; className?: string; y?: number; inmediato?: boolean }) {
  const props = inmediato
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-40px' } };
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} transition={{ duration: 0.55, delay: retraso, ease: [0.2, 0.7, 0.2, 1] }} {...props}>
      {children}
    </motion.div>
  );
}
