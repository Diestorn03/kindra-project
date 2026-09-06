# Kindra Project · sistema

Formulario de briefing, panel privado y portafolio. Next.js 16 + Tailwind 4 + Motion. Guarda en archivos locales hasta que se conecte Supabase.

## Correr en local

```bash
npm install
npm run dev
```

- Inicio: http://localhost:3000
- Panel: http://localhost:3000/panel (contraseña en `.env.local`, por defecto `kindra2026`; cámbiala)
- Portafolio público: http://localhost:3000/portafolio

## Cómo se usa

- **En la reunión:** en el panel, "Empezar briefing ahora" abre el formulario de inmediato. Tu novia lo llena con el cliente al lado.
- **A distancia:** "Crear enlace para enviar" genera el enlace y un botón para mandarlo por WhatsApp. El cliente lo llena solo, sin contraseña, y puede retomarlo cuando quiera.
- El formulario guarda solo mientras se escribe. Solo exige empresa, contacto y teléfono o correo; lo demás se puede dejar en blanco.
- Al enviarlo aparece como **Nuevo** en el panel. En la ficha se cambia el estado con un clic y el botón **Copiar para desarrollar** arma el briefing como texto para pegarlo al construir el sitio.
- **Portafolio:** con solo la dirección del sitio se genera la vista previa (captura automática del servicio image.thum.io). Cada proyecto tiene una página de presentación (`/portafolio/<id>`) con la captura, el sitio en vivo y el botón de abrir, para mostrar en reuniones.

## Estructura

```
app/
  page.tsx               inicio
  entrar/                acceso al panel
  panel/                 lista de briefings, ficha de cada uno, portafolio (privado)
  b/[token]/             formulario público de briefing
  portafolio/            portafolio público
  api/                   rutas: entrar, salir, briefings, subir, panel/estado, panel/proyectos
components/Wizard.tsx    asistente paso a paso (extracción de colores del logo, selector de redes)
lib/tipos.ts             campos, listas y validación mínima
lib/db.ts                capa de datos: local (data/) o Supabase según .env
lib/colores.ts           extracción de colores en el navegador
supabase/schema.sql      tablas y bucket para cuando se conecte Supabase
```

## Pasar a Supabase (cuando haya cuenta)

1. Crear proyecto en supabase.com y ejecutar `supabase/schema.sql` en el editor SQL.
2. Copiar `SUPABASE_URL` y la clave *service role* en `.env.local` (y en Vercel).
3. Listo: el código detecta las variables y deja de usar archivos locales.

## Publicar en Vercel (gratis)

1. Subir esta carpeta a un repositorio de GitHub.
2. En vercel.com, importar el repositorio y definir las variables de `.env.example`.
3. Cada `git push` publica solo. Sin Supabase, los archivos subidos no persisten en Vercel; para uso real conectar Supabase primero.
