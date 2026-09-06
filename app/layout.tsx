import type { Metadata } from 'next';
import { Bricolage_Grotesque, Work_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], weight: ['500', '600', '800'], variable: '--font-bricolage', display: 'swap' });
const work = Work_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-work', display: 'swap' });
const jet = JetBrains_Mono({ subsets: ['latin'], weight: ['500'], variable: '--font-jet', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Kindra Project', template: '%s · Kindra Project' },
  description: 'Briefings y portafolio de Kindra Project.',
  icons: { icon: '/icono.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${bricolage.variable} ${work.variable} ${jet.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
