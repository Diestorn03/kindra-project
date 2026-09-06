# Kindra Project · sistema

Formulario de briefing, panel privado y portafolio. Next.js 16 + Tailwind 4 + Supabase.

## Correr en local

```bash
npm install
npm run dev
```

- Inicio: http://localhost:3000
- Panel: http://localhost:3000/panel (contraseña `ADMIN_PASSWORD` de `.env.local`)
- Portafolio público: http://localhost:3000/portafolio

## Cómo se usa

- **En la reunión:** en el panel, "Empezar briefing ahora" abre el formulario de inmediato para llenarlo con el cliente al lado.
- **A distancia:** "Crear enlace para enviar" genera el enlace y un botón para mandarlo por WhatsApp. El cliente lo llena solo, sin contraseña, y puede retomarlo cuando quiera.
- El formulario guarda solo mientras se escribe. Solo exige empresa, contacto y teléfono o correo; lo demás se puede dejar en blanco.
- Al enviarlo aparece como **Nuevo** en el panel. En la ficha se cambia el estado con un clic (se pinta al instante y se guarda por detrás) y el botón **Copiar para desarrollar** arma el briefing como texto para pegarlo al construir el sitio.
- **Portafolio:** con solo la dirección del sitio se genera la vista previa (captura automática de image.thum.io). Cada proyecto tiene una página de presentación (`/portafolio/<id>`) con la captura, el sitio en vivo y el botón de abrir, para mostrar en reuniones.

## Rendimiento

- Las animaciones son CSS puro (sin librería de animación por JavaScript; Framer Motion se quedaba congelado a mitad de camino en algunas máquinas).
- `lib/db.ts` guarda en memoria las lecturas de Supabase unos segundos y las borra en cada escritura (usando una sola caché compartida entre rutas y páginas, con tope de tamaño). Sin esto, cada clic repetía un viaje de 300–1500 ms a la base de datos. El formulario público del cliente siempre se lee fresco.
- `app/(sitio)/loading.tsx` y `app/panel/loading.tsx` muestran un esqueleto al instante mientras llega el contenido; el grupo `(sitio)` mantiene ese esqueleto solo en las páginas públicas para que `/entrar` y el formulario de briefing no salten de layout.
- El cambio de estado de un briefing (`EstadoBotones`) se pinta al instante y se sincroniza tras guardar, para que el botón "Atrás" del navegador nunca muestre un estado viejo. El filtro de estados del panel corre en el navegador, sin recargar la página.
- `vercel.json` fija la región `gru1` (São Paulo), la misma de Supabase, para que servidor y base de datos estén a milisegundos.

## Seguridad

- La sesión del panel se firma con `AUTH_SECRET` (HMAC); sin esa variable (o con menos de 16 caracteres) el sistema no deja entrar a nadie, en vez de usar una firma fija y adivinable.

## Estructura

```
app/
  (sitio)/               inicio y portafolio público, con su propio esqueleto de carga
  entrar/                acceso al panel (campo de contraseña con botón para verla)
  panel/                 lista de briefings, ficha de cada uno, portafolio (privado)
  b/[token]/             formulario público de briefing
  api/                   rutas: entrar, salir, briefings, subir, panel/estado, panel/proyectos
components/Wizard.tsx    asistente paso a paso (extracción de colores del logo, selector de redes)
components/EstadoBotones.tsx  cambio de estado sin recargar
components/PanelLista.tsx     lista de briefings con filtro por estado en el navegador
lib/tipos.ts             campos, listas y validación mínima
lib/db.ts                capa de datos con caché: Supabase o archivos locales según .env
lib/auth.ts              sesión del panel (cookie firmada con AUTH_SECRET)
lib/colores.ts           extracción de colores en el navegador
supabase/schema.sql      tablas y bucket
```

## Supabase

Conectado (proyecto `kindra-project`, región São Paulo). Las claves están en `.env.local` (no se suben a GitHub). Briefings y proyectos van a las tablas `briefings`/`proyectos`; logos y portadas al bucket público `archivos`. Para reconectar en otra máquina o en Vercel: copiar `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` desde Project Settings → API en supabase.com.

## Publicar en Vercel (gratis) con despliegue automático desde GitHub

1. Entrar en vercel.com con la cuenta de GitHub → **Add New → Project** → importar `Diestorn03/kindra-project`.
2. Framework: Next.js (lo detecta solo). No cambiar comandos de build.
3. En **Environment Variables** pegar, una por una:
   - `ADMIN_PASSWORD` → una contraseña nueva (no usar la de local)
   - `AUTH_SECRET` → cadena larga aleatoria
   - `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` → de `.env.local`
   - `NEXT_PUBLIC_WHATSAPP` → opcional, número con código de país
4. **Deploy**. Vercel entrega una dirección `https://kindra-project-….vercel.app`.
5. Desde ese momento la conexión con GitHub queda hecha: **cada `git push` a `main` publica solo** en uno o dos minutos, y cada rama o pull request genera una dirección de prueba aparte. No hay que tocar Vercel de nuevo.
