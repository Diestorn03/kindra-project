-- Ejecutar una sola vez en el editor SQL de Supabase (supabase.com → SQL Editor).
create extension if not exists pgcrypto;

create table if not exists briefings (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  estado text not null default 'borrador',
  datos jsonb not null default '{}'::jsonb,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  enviado_en timestamptz
);

create table if not exists proyectos (
  id uuid primary key default gen_random_uuid(),
  publicado boolean not null default false,
  datos jsonb not null default '{}'::jsonb,
  creado_en timestamptz not null default now()
);

-- Bucket público para logos, referencias y portadas del portafolio
insert into storage.buckets (id, name, public) values ('archivos', 'archivos', true)
on conflict (id) do nothing;

-- El sistema usa la clave de servicio desde el servidor, así que RLS queda activo y sin políticas públicas.
alter table briefings enable row level security;
alter table proyectos enable row level security;
