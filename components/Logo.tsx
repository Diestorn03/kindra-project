import Link from 'next/link';

export default function Logo({ tam = 'md', href = '/' }: { tam?: 'sm' | 'md' | 'lg'; href?: string }) {
  const fs = tam === 'lg' ? 'text-5xl' : tam === 'sm' ? 'text-xl' : 'text-2xl';
  const sub = tam === 'lg' ? 'text-[12px]' : 'text-[9px]';
  return (
    <Link href={href} className="inline-flex flex-col items-start leading-none" aria-label="Kindra Project, inicio">
      <span className={`titulo ${fs}`}>
        <span className="text-acento">[</span>Kindra<span className="text-acento">]</span>
      </span>
      <span className={`mt-1 font-sans font-semibold uppercase tracking-[0.18em] text-acento ${sub}`}>Project</span>
    </Link>
  );
}
