# ESTADO — PeptiBrain

## ✅ 2 artículos SEO/GEO nuevos + dateModified en el blog (2026-07-29)

El dueño pidió una recomendación concreta de contenido y dio luz verde con "haz lo que tú
consideres". Antes de escribir se investigó si había duplicación con lo ya publicado (mismo
criterio que con el artículo de GLP-1: nunca escribir sin chequear solapamiento primero):

1. **"Cómo calcular la dosis de un péptido"** (es/en, categoría Guía práctica): hueco real
   confirmado — todo el contenido de cálculo de dosis existente estaba enfocado 100% en GLP-1.
   Cubre la fórmula genérica (concentración = mg÷mL, unidades = dosis÷concentración×100) con un
   ejemplo numérico real, explica por qué cambia según el tipo de péptido (reconstituido en polvo
   vs. TRT ya disuelto en aceite), y enlaza a `/calculadora` (la herramienta agnóstica de
   compuesto) en vez de duplicarla — con cruce honesto a las guías específicas de GLP-1 y TRT.
2. **"Mejores herramientas para registrar péptidos"** (es/en, categoría Comparativa): el
   artículo existente (`mejores-apps-de-peptidos`) compara apps específicas entre sí; este
   nuevo compara categorías de herramientas (notas sueltas, hoja de cálculo, app dedicada) —
   ángulo distinto, con cross-link explícito entre ambos para que no compitan por el mismo
   posicionamiento.

**Mejora estructural de paso** (de la auditoría general del blog pedida por el dueño): se agregó
`reviewedAt` opcional al tipo `BlogPost` y `dateModified` al JSON-LD de cada artículo (cae a
`publishedAt` si no se especifica) — señal de frescura real para Google en contenido de salud
(YMYL), sin inventar una fecha de revisión que no ocurrió. Quedan pendientes, identificados pero
no ejecutados aún (para no sumar contenido apurado sin revisar bien): un artículo "TRT 101"
(hoy solo hay guía de registro de dosis, no explicación básica) y ampliar la cobertura de
péptidos de recuperación/piel-antiedad (hoy 1 artículo cada uno, están más delgados que GLP-1).

Verificado: tsc ✓ · npm test (82/82) ✓ · npm run build ✓ · confirmado en navegador (es, ambos
artículos, enlaces cruzados probados incluyendo el link real a `/blog/mejores-apps-de-peptidos`)
· preview real de Vercel (staging) verificado antes de fusionar · staging→main desplegado, CI en
verde.

## ✅ Portada del artículo GLP-1 + orden de categorías del blog (2026-07-29)

1. **Portada real activada**: el dueño generó la imagen del artículo `calculadora-de-dosis-de-glp1`
   con el prompt dado (1424x752, mismo estilo de marca) y la subió a `public/blog/` — llegó con
   doble extensión (`....png.png`), se corrigió el nombre y se agregó el slug a
   `SLUGS_WITH_IMAGE` en `lib/blog/posts.ts` para activarla.
2. **Orden de categorías del blog**: pedido explícito de que "Calculadoras" fuera la primera
   categoría y "Guía práctica" la segunda (las de más tráfico/conversión), en vez del orden de
   aparición en el array de posts. Nueva función `orderCategories()` en `lib/blog/posts.ts` con
   una lista de prioridad manual por locale; el resto de categorías conserva su orden original.

Verificado: tsc ✓ · npm test (82/82) ✓ · npm run build ✓ · confirmado en navegador (imagen
1424x752 renderizando en la tarjeta, chips en el orden pedido) · preview real de Vercel
(staging) verificado antes de fusionar · staging→main desplegado, CI en verde.

## ✅ Artículo SEO/GEO "Calculadora de dosis de GLP-1" (2026-07-29)

El dueño pidió (como estrategia de adquisición) una calculadora de dosis de GLP-1 + artículo
SEO/GEO — "si no la tenemos, hay que crearla". Antes de construir nada se investigó si ya
existía: **sí existía**, con matemática real (no tabla estática) en `/calculadora-semaglutida`
(`components/app/calculator/GlpDoseCalculator.tsx` + `lib/dose-math.ts`, conversión mg→mL→
unidades U100 + tabla de titulación completa para semaglutida y tirzepatida), ya enlazada en
sitemap/menú/footer, con 2 artículos de blog previos. Lo que faltaba: ningún contenido apuntaba
a la frase de búsqueda genérica **"calculadora de dosis de GLP-1"** — todo estaba enmarcado como
"semaglutida y tirzepatida" de marca, no como categoría GLP-1.

- **Nuevo artículo** `calculadora-de-dosis-de-glp1` (es/en, categoría "Calculadoras", el más
  reciente del blog): explica qué es GLP-1 en general (incluye nombres comerciales Ozempic/
  Wegovy/Mounjaro/Zepbound — dato público, ya usado en otras partes del código), por qué la
  dosis sube por fases (titulación), la conversión mg→unidades de jeringa, una tabla comparativa
  (calculadora vs a mano) y un FAQ con schema `FAQPage` — y enlaza directo a la calculadora ya
  existente en vez de duplicarla (evita fragmentar autoridad de SEO entre dos herramientas
  iguales). Fuentes reales reutilizadas de artículos previos (SURMOUNT-1, STEP 5) — nada
  inventado.
- **No se construyó ninguna calculadora nueva** — habría sido redundante y peor para SEO que
  reforzar la que ya existe con el contenido que le faltaba.

Verificado: tsc ✓ · npm test (82/82) ✓ · npm run build ✓ · confirmado en navegador (es/en,
tarjeta en la categoría "Calculadoras", enlace real a `/calculadora-semaglutida` probado con
clic, tabla comparativa y FAQ renderizando) · preview real de Vercel (staging) verificado antes
de fusionar · staging→main desplegado, CI en verde.

## ✅ Logo del blog más grande + IndexNow para Bing/Yandex (2026-07-29)

Dos pedidos cortos del dueño tras ver la sesión anterior en vivo:

1. **Logo aún chico**: pese al fix anterior (badge blanco a juego con los íconos), el
   isotipo seguía viéndose menos protagonista que un ícono Lucide normal. En
   `ArticleHero.tsx`, se agrandó el badge de `useLogo` (`size-11/16` → `size-16/24`) y el
   logo dentro (`size-8/12` → `size-13/20`) — ahora tiene la misma prominencia visual que
   los demás posts, confirmado comparándolos lado a lado en el índice del blog.
2. **Ping automático a buscadores tras publicar un artículo** (pendiente de la sesión
   anterior): antes de construirlo se investigó el estado real — el "ping" de sitemap de
   Google Y de Bing están **apagados desde 2023/2022** (ambos responden 404/410 hoy), así
   que implementar la llamada tal cual se pidió habría sido una función hueca. Se le avisó
   esto al dueño en simple antes de programar nada, y se le ofreció la alternativa real:
   **IndexNow** (protocolo que sí soportan Bing/Yandex/Naver hoy; Google no lo soporta —
   para Google no existe ningún aviso activo posible, el sitemap.xml ya enlazado en
   robots.txt es lo único que hay). El dueño confirmó construir IndexNow.
   - `lib/indexnow.ts`: llama a `api.indexnow.org` con la clave pública del protocolo.
   - `public/<clave>.txt`: archivo de verificación que exige el protocolo (la clave es
     pública por diseño, no es un secreto).
   - Conectado al cron diario ya existente (`/api/cron/daily`, corre solo, sin tocar
     Vercel/CI): cada día avisa las URLs (es/en) de artículos publicados en los últimos 3
     días — no reenvía las 20+ URLs viejas cada vez, solo lo nuevo.

Verificado: tsc ✓ · npm test (82/82) ✓ · npm run build ✓ · confirmado en navegador: logo
más grande lado a lado con un ícono normal, archivo `<clave>.txt` sirviendo el contenido
correcto en el preview real de Vercel · staging→main desplegado (2 tandas), CI en verde.

## ✅ "Quiénes somos" v3: rediseño visual completo, sin duplicar el artículo (2026-07-29)

El dueño vio la v2 (párrafo corto + 2 secciones nuevas) y pidió ir más lejos: "que sea más visual,
con tabla y con todo", con comparación honesta ventajas/desventajas y enlaces a todo lo demás del
sitio. Se abandonó por completo el `LegalPage` genérico (solo prosa) para esta página — sigue
usándose sin cambios en Términos/Privacidad/Aviso legal/Reembolsos, donde sí encaja.

- **Nuevo layout propio** en `app/[locale]/quienes-somos/page.tsx`: hero con ícono, breadcrumb de
  2 niveles, y el cuerpo delegado a `components/app/quienes-somos/ContentEs.tsx`/`ContentEn.tsx`
  (mismo patrón que los artículos del blog: componente TSX por idioma, no JSON de traducciones).
- **Tabla comparativa real** (`AppComparisonTable`, 8 filas): PeptiBrain vs. notas del móvil vs.
  hoja de cálculo — honesta, incluye filas donde la hoja de cálculo también gana (historial
  buscable) o queda en "no especificado" (depende de cómo el usuario la arme).
- **Pros/contras en dos columnas** ("Te conviene si..." / "Quizás no es para ti si...") — la columna
  negativa es real: no diagnostica, no es para quien no sigue un protocolo, no vende péptidos.
- **Sección "Explora PeptiBrain"**: enlaces a `/herramientas` (calculadoras gratis), `/protocolos`
  (galería de péptidos), el artículo de péptidos populares, la guía "¿Qué es PeptiBrain?" y el
  índice del blog — pedido explícito del dueño de que la página recomendara "todo".
  Se conservan intactas las secciones honestas ya existentes (principios, cómo se escribe el
  contenido, seguridad/privacidad, identidad legal real) y se agrega Organization + BreadcrumbList
  JSON-LD (antes la página no tenía structured data propia).
- El namespace `QuienesSomos` en `messages/es.json`/`en.json` se redujo a solo
  `metaTitle`/`metaDescription`/`title`/`updated`/`intro`/`backHome` — el contenido de secciones ya
  no vive en JSON, igual que el resto del blog.

Verificado: tsc ✓ · npm test (82/82) ✓ · npm run build ✓ (ambos locales de `/quienes-somos`
prerenderizados) · confirmado en navegador a 375px y 1280px, es/en, incluyendo clic real en el
enlace al artículo "¿Qué es PeptiBrain?" · preview real de Vercel (staging) verificado antes de
fusionar a main · staging→main desplegado, CI en verde.

## ✅ Ajustes de feedback: logo, categorías, tabla GEO, Quiénes somos v2 (2026-07-29)

Feedback directo del dueño tras ver el artículo insignia en vivo:

1. **Logo del blog muy chico**: en `ArticleHero.tsx`, el logo real (`useLogo`) se mezclaba con el
   fondo verde porque no tenía el mismo badge blanco que los demás íconos — parecía más pequeño sin
   serlo en píxeles. Ahora usa el mismo `bg-white/95` que los íconos Lucide, con el logo dentro a
   escala proporcional (antes ocupaba el 100% del badge sin contraste).
2. **Categorías**: se quitó "Sobre PeptiBrain" (el artículo pasa a "Guía básica") y se agregó
   "Calculadoras", aplicada a los 6 artículos-guía de herramientas que antes vivían sueltos dentro
   de "Guía práctica" (reconstitución, semaglutida, comparador, eliminación, costo por mg,
   compatibilidad de stacks).
3. **Tabla comparativa GEO** en el artículo "¿Qué es PeptiBrain?": PeptiBrain vs. notas/papel en 7
   criterios reales (calculadora automática, recordatorio, caducidad de vial, historial, informe
   médico, compartir en familia, todo en un lugar) — reutiliza `AppComparisonTable` ya construido
   para el artículo de comparativa de apps. Se ajustó el componente para que oculte la leyenda de
   "no especificado" cuando ninguna fila la usa (antes aparecía siempre, aunque no hubiera celdas
   con guion).
4. **"Quiénes somos" v2**: el dueño notó que duplicaba contenido ya cubierto en el artículo
   insignia. Se redujo la sección de avatar/antes-después a un párrafo corto que remite al
   artículo, y se sumó contenido genuinamente distinto: "Nuestros principios" (las 3 reglas: la app
   no decide dosis, el contenido nunca inventa datos, tus datos son tuyos) y "Seguridad y privacidad
   de tus datos" (RLS, no venta de datos a terceros) — sin tocar las secciones honestas que ya
   existían (cómo se escribe el contenido, qué NO es, identidad legal real).

Verificado: tsc ✓ · npm test (82/82 — el fallo preexistente por hora del día ya no aplica pasada la
medianoche) ✓ · npm run build ✓ · confirmado en navegador: logo con badge correcto, categoría
"Calculadoras" en los chips, tabla renderizando con 7 filas, Quiénes somos sin duplicación ·
staging→main desplegado.

## ✅ Artículo insignia "¿Qué es PeptiBrain?" + Quiénes somos enfocada al cliente (2026-07-29)

El dueño pidió el artículo más amplio del blog hasta ahora (~1000+ palabras), pensado para posicionar
en Google las búsquedas "qué es PeptiBrain" y "PeptiBrain", cubriendo: qué es, el avatar (a quién va
dirigido), beneficios, un antes/después de usarla, y absolutamente todo lo que incluye. Antes de
escribir se confirmaron 2 decisiones con el dueño: (1) fecha del artículo — el más **antiguo**
cronológicamente (2026-07-20, antes que los otros 20), no el más reciente; (2) sin capturas de
pantalla de la app por ahora — portada con el logo real de la marca en su lugar.

- **Nuevo artículo** `que-es-peptibrain` (es/en): qué es, para quién es (5 perfiles reales), antes/
  después (enfocado en la experiencia de seguimiento — nunca resultados clínicos fabricados, eso
  violaría la línea D2), todo lo que incluye (calculadoras, herramientas gratis, salud, familia,
  informe médico), qué NO es, planes, y FAQ con schema.org `FAQPage`.
- **Portada con logo real**: `ArticleHero.tsx` ahora soporta `useLogo`/`coverIsLogo` — muestra el
  isotipo real de la marca (`/peptibrain-isotipo.svg`) dentro del mismo badge blanco+degradado que
  ya usan los demás posts, sin depender de un ícono genérico ni de generar una imagen nueva.
- **"Quiénes somos" reescrita** con enfoque al cliente: ahora abre con "¿A quién ayuda PeptiBrain?"
  (el avatar) y "Qué cambia cuando la usas" (antes/después), manteniendo intactas las secciones
  honestas ya construidas (cómo se escribe el contenido, qué NO es, identidad legal real) — nada
  inventado ni credenciales falsas.

Verificado: tsc ✓ · npm test (81/82, mismo fallo preexistente no relacionado) ✓ · npm run build ✓ ·
confirmado en navegador (portada con logo real, breadcrumb de 3 niveles, tags, resumen; página
Quiénes somos con el nuevo orden) · staging→main desplegado.

## ✅ Portal editorial del blog: breadcrumbs, tags, newsletter, Quiénes somos, fuentes (2026-07-29)

El dueño compartió una lista de ChatGPT sobre "cómo construir un blog profesional tipo WebMD" (20
puntos). Se evaluó cada uno antes de tocar código: mucho ya existía (Biblioteca=/protocolos,
calculadoras, buscador+categorías, artículos relacionados, CTA a la app, schema.org). Se rechazó
explícitamente lo que hubiera requerido fabricar confianza (bios/fotos de autor falsas, "revisión
médica" que no existe, comentarios). De lo real y verificable, se construyó:

1. **Breadcrumbs visibles** (Inicio > Blog > Artículo) en cada post y en el índice — reutilizando
   el `BreadcrumbList` schema.org que ya existía solo como dato, nunca visible en pantalla.
2. **Autodescubrimiento RSS**: `<link rel="alternate" type="application/rss+xml">` en el `<head>`
   global — Feedly/Inoreader/Flipboard/NewsBlur detectan el feed con solo pegar la URL del sitio.
3. **Etiquetas (tags)** por artículo (es/en, los 20 posts) — chips clicables que enlazan a
   `/blog?q=<tag>`; `BlogGrid` ahora lee `?q=` de la URL para sembrar su buscador.
4. **Newsletter** (Resend Audience): formulario visible en el índice del blog y al final de cada
   artículo, `POST /api/newsletter/subscribe` — no-op si falta `RESEND_AUDIENCE_ID` (mismo patrón
   que el resto de integraciones opcionales de Resend).
5. **Página `/quienes-somos`** (es/en): qué es PeptiBrain, cómo se escribe el contenido (fuentes
   verificables o se dice explícitamente que no las hay), qué NO es (no consejo médico), identidad
   legal real (Digital Dreams World LLC) — sin bios ni asesores inventados.
6. **Fuentes científicas reales** (componente `Sources` nuevo): 8 citas verificadas por
   WebSearch antes de escribir (STEP-1/STEP-5 de semaglutida, SURMOUNT-1 de tirzepatida, revisión
   preclínica + estudio en modelo animal de BPC-157, revisión + ensayo clínico registrado de
   GHK-Cu), añadidas solo a los 4 artículos donde hay evidencia sólida y verificable — el resto se
   deja sin esta sección a propósito.

De paso, dos fixes reportados por el dueño:
- **429 en `/compatibilidad`**: el límite de peticiones por IP estaba en 60/min — demasiado
  ajustado porque Next.js precarga en segundo plano los enlaces visibles en pantalla. Subido a
  180/min (`lib/rate-limit.ts`).
- **Pregunta sobre indexación automática en GSC**: se explicó que la Indexing API de Google solo
  está permitida para ofertas de empleo/eventos en vivo (no se recomendó usarla) — la vía legítima
  ya existe (`sitemap.xml` se regenera solo); pendiente si el dueño quiere el ping automático a
  Google tras cada deploy.

**Pendiente del dueño**: las 7 imágenes de portada con los prompts dados en la tanda anterior.

Verificado en cada fase: tsc ✓ · npm test (81/82 — 1 fallo es un test preexistente que depende de
la hora del día, ya reportado aparte, no relacionado) ✓ · npm run build ✓ · cada pieza confirmada
en navegador (breadcrumbs, tag→búsqueda por URL, newsletter no-op, página Quiénes somos, fuentes
con links reales) · 3 tandas desplegadas a staging→main.

## ✅ Feed RSS + enlace a Compatibilidad en el FAQ (2026-07-28)

El dueño pidió comprobar que el blog tuviera RSS en las 3 rutas que suelen probar los checklists de
SEO/GEO (`/feed`, `/rss`, `/rss.xml`) — no existía ninguna. Se creó `lib/rss.ts` (genera RSS 2.0 del
blog en español, ordenado por más reciente) servido en las 3 rutas. `/feed` y `/rss` (sin punto en
la URL) necesitaron sumarse a la exclusión del matcher del middleware de idioma en `proxy.ts` —
si no, next-intl las reescribía con prefijo `/es/...` y devolvían 404 antes de llegar al route
handler (`/rss.xml` no necesitó el cambio, ya lo cubría la exclusión existente de archivos con punto).

De paso: en el artículo FAQ, la pregunta "¿Puedo combinar varios péptidos (stack)?" ahora enlaza a
la herramienta de Compatibilidad de stacks (es/en) — el dueño notó que la respuesta recomendaba
revisar combinaciones pero no daba una forma concreta de hacerlo.

También: las imágenes de portada que el dueño generó (en `Desktop/Aqui claude/`) quedaron
renombradas ahí mismo con el nombre de slug correcto (antes solo se habían copiado a `public/blog/`
con el nombre nuevo, dejando los originales sin renombrar).

Verificado: tsc ✓ · npm test (82/82) ✓ · npm run build ✓ (`/feed`, `/rss`, `/rss.xml` aparecen como
rutas dinámicas) · las 3 URLs devuelven 200 con `content-type: application/rss+xml` y XML válido con
los 20 posts · enlace a `/compatibilidad` confirmado en el FAQ renderizado · staging→main desplegado.

## ✅ Las 7 portadas restantes del blog, integradas (2026-07-28)

El dueño generó con Gemini las 7 imágenes que faltaban (prompts dados en esta sesión) y las dejó en
`Desktop/Aqui claude/11.png`...`17.png`. Se identificó cada una por su ícono (reloj, monedas, pulso,
flechas cruzadas ×2, matraz, jeringa) y coincidían exactamente con el orden de los 7 prompts dados
→ se copiaron a `public/blog/` con el nombre de slug correcto y se sumaron a `SLUGS_WITH_IMAGE`:

- eliminación (reloj), costo por mg (monedas), registro de dosis TRT (pulso), compatibilidad de
  stacks (flechas cruzadas), reconstitución (matraz), semaglutida (jeringa), comparador (shuffle).

Con esto los 20 artículos del blog ya tienen imagen propia — ninguno cae al ícono+degradado por
defecto.

Verificado: dimensiones exactas 1424x752 en las 7 · sin marca de agua de Gemini visible · tsc ✓ ·
npm test (82/82) ✓ · npm run build ✓ · las 7 URLs devuelven 200 y se confirmó una renderizada en el
navegador (calculadora-de-eliminacion) · staging→main desplegado.

## ✅ Buscador + filtro por categoría en el blog (2026-07-28)

Con 20 artículos y 9 categorías, el blog ya pasaba el umbral de la propia regla de UX del proyecto
(10+ ítems necesitan filtros). Nuevo `components/app/blog/BlogGrid.tsx` (cliente): buscador (título +
extracto) y chips de categoría, mismo patrón que `PeptideLibraryGrid` en `/protocolos`. Mientras no
hay filtro activo se muestra la grilla+paginación ya renderizada por el servidor (sin JS, buena para
SEO); en cuanto hay texto o categoría, el componente cliente toma el control y muestra su propia
lista filtrada (sin capar a 12 — igual que el resto de listas filtrables de la app).

Verificado: tsc ✓ · npm test (82/82) ✓ · npm run build ✓ · probado en navegador: buscar "TRT" da 1
resultado correcto, filtro "Pérdida de peso" da 1 resultado correcto · staging→main desplegado.

## ✅ Paginación del blog (2026-07-28)

El blog llegó a 20 artículos en una sola página larga. Se agregó paginación de 12 por página
(`?page=N`) con controles Anterior/números/Siguiente en `app/[locale]/blog/page.tsx`, canonical
propio por página para SEO. De paso se corrigió el orden: mostraba del más viejo al más nuevo
(orden de escritura del registro) — ahora se ordena por `publishedAt` descendente, el más nuevo
primero.

**Pendiente del dueño**: generar con Gemini las imágenes de portada de los 2 últimos artículos
(`calculadora-de-eliminacion-como-usarla.png` y `calculadora-de-costo-por-mg-como-usarla.png`, 1424x752)
— se le dieron los 2 prompts, mismo estilo de marca que las demás portadas (degradado
#1CD39C→#00A87E, ícono blanco). Avisar cuando estén listas para integrarlas y sumar los slugs a
`SLUGS_WITH_IMAGE`.

Verificado: tsc ✓ · npm test (82/82) ✓ · npm run build ✓ (`/blog` pasó a dinámico por usar
`searchParams`) · confirmado en navegador: página 1 = 12 posts más recientes (empieza en
costo-por-mg), página 2 = los 8 restantes · staging→main desplegado.

## ✅ 5 artículos-guía de calculadoras + FAQ de TRT con búsquedas reales (2026-07-28)

El dueño compartió capturas de "la gente también pregunta" de Google sobre TRT (dosis, efectos
secundarios, ng/dL, si se compra en farmacia, etc.) y pidió aprovecharlas para tráfico. Se amplió el
FAQ de `/calculadora-trt` de 3 a 13 preguntas, usando esas búsquedas reales tal cual (apunta a
intención real de búsqueda, no a lo que adivinaríamos nosotros). Cuidado aplicado: preguntas como
"¿son suficientes 400mg para músculo?" o "¿cómo subo la testosterona rápido?" se responden de forma
factual/educativa, nunca como recomendación de dosis — siempre redirigiendo a análisis + médico.

También se completaron los 5 artículos-guía de calculadoras que habían quedado pendientes de la
tanda anterior (reconstitución, semaglutida/tirzepatida, comparador, eliminación, costo por mg) —
mismo patrón que los de TRT/Compatibilidad: bloque de respuesta directa, "cómo funciona", "cómo
sacarle el máximo partido". Grounding verificado a mano: los números de titulación de semaglutida
(0,25→2,4mg) y tirzepatida (2,5→15mg) coinciden exactamente con el FAQ que ya existía en el código
— nada inventado.

Verificado: tsc ✓ · npm test (82/82) ✓ · npm run build ✓ · FAQ ampliado confirmado en navegador ·
listado del blog confirmado con los 7 artículos nuevos de la sesión · staging→main desplegado.

## ✅ Calculadora + quiz de TRT, y 2 artículos SEO/GEO nuevos (2026-07-28)

El dueño pidió 2 artículos ("Registra tus dosis de TRT" y "Compatibilidad de stacks") y, tras
mostrarle una referencia de un competidor (balancemyhormones.co.uk), confirmó vía pregunta directa
que también quería construir una calculadora de TRT + un quiz de nivel de testosterona como
herramientas nuevas — inspiradas en la estructura del competidor, sin copiar su copy ni su UI.

**2 herramientas nuevas** (siguiendo el patrón exacto de las otras 7 calculadoras: página +
componente + `ToolPieces` + wiring en `ToolsMenu`/`Footer`/`herramientas`/`sitemap.ts`):
- `/calculadora-trt` (`lib/trt-calc.ts`, con tests): dosis semanal (mg) + concentración del vial
  (mg/mL) + frecuencia → mg/mL/unidades de jeringa por inyección. La testosterona ya viene disuelta
  en aceite a concentración fija — no hay paso de reconstitución como con los péptidos.
- `/quiz-trt` (`lib/trt-quiz.ts`, con tests): 8 preguntas sí/no sobre síntomas comunes de
  testosterona baja → banda baja/media/alta. Deja explícito en la propia pantalla de resultado y en
  el FAQ que **no diagnostica nada** — solo un análisis de sangre lo confirma. Decisión deliberada:
  no se copió el "resumen ejecutivo con superlativos" ni ningún dato inventado del competidor.

**2 artículos de blog nuevos** (es/en), aplicando el framework SEO/GEO revisado la sesión anterior:
- "Cómo registrar tus dosis de TRT" — paralelo al de GLP-1, enlaza a la calculadora nueva.
- "Compatibilidad de stacks: cómo funciona y cómo sacarle el máximo partido" — explica los 4
  estados de la herramienta (estudiado/precaución/evitar/sin datos) con una **tabla real** nueva
  (`CompatComboTable`, no datos en imagen) de 6 combos sacados literalmente de
  `lib/stack-compatibility.ts` — ningún dato inventado para el artículo.

Verificado: tsc ✓ · npm test (82/82) ✓ · npm run build ✓ · calculadora y quiz probados en
navegador (resultado correcto: 100mg/200mg-mL → 0.5mL/50u; quiz llega a pantalla de resultado con
banda y aviso de no-diagnóstico) · ambos artículos verificados visualmente (es) con contenido y
tabla renderizando correctamente · staging→main desplegado.

## ✅ Bloque de respuesta directa (GEO) en 12 artículos del blog (2026-07-28)

El dueño compartió un PDF con una conversación previa en Gemini sobre estrategia SEO/GEO
(Generative Engine Optimization) para posicionar PeptiBrain, incluyendo un "prompt maestro" para
reescribir los artículos del blog. Se auditó contra lo ya construido antes de tocar nada:

- Ya cumplido: schema.org `SoftwareApplication` (sin `aggregateRating` inventado), `FAQPage`
  schema, apuntar a intención de búsqueda (no a marca), tabla real de comparación (no en imagen)
  en `mejores-apps-de-peptidos`, jerarquía H1/H2/H3 en los 13 posts, enlaces internos a
  calculadoras.
- Rechazado explícitamente: el ejemplo del PDF de un "Resumen Ejecutivo del Dr. Leo" con
  superlativos autoproclamados ("la más recomendada", "la más segura") — es una afirmación no
  verificable presentada como hecho para que una IA la repita; contradice tanto la regla D2 como
  la propia condición del PDF de "no fluff genérico". No se implementó.
- Mejora real aplicada: nuevo componente `Summary` en `ArticleBlocks.tsx` (bloque "En resumen:" /
  "In short:", pirámide invertida) insertado tras la intro y antes del primer H2, en los 12 posts
  que no tenían tabla (se excluyó `mejores-apps-de-peptidos`, que ya tiene su propia tabla). Cada
  resumen está anclado en lo que el propio artículo ya dice — nada de claims nuevos.

Verificado: tsc ✓ · npm test (74/74) ✓ · npm run build ✓ · verificado visualmente en navegador
(es + en) en `/blog/bpc-157-que-es-y-para-que-se-usa` · staging→main desplegado.

## ✅ Imagen de portada del artículo de registro de dosis GLP-1 (2026-07-27)

Cerrado el pendiente: el dueño generó la imagen con el prompt de estilo ya dado (mismo look que
el resto del blog: ícono blanco sobre degradado verde con círculos redondeados en las esquinas),
misma dimensión exacta (1424x752) que las demás portadas. Copiada a
`public/blog/como-registrar-tus-dosis-de-glp1.png` y agregado el slug a `SLUGS_WITH_IMAGE` en
`lib/blog/posts.ts` para activarla — antes caía al ícono de calendario + degradado por defecto.

Verificado: tsc ✓ · npm test (74/74) ✓ · npm run build ✓ · verificado visualmente en el navegador
(la imagen reemplaza el ícono correctamente) · staging→main desplegado.

## ✅ 3 mejoras de confianza/SEO inspiradas en Shotsy (2026-07-27)

El dueño compartió capturas de la landing de un competidor (Shotsy) y pidió tomar ideas. De 4
sugeridas, se implementaron 3 (la 4 —credibilidad con nombre real/asesor médico— quedó fuera a
propósito: no se puede fabricar una figura de autoridad falsa, necesita algo real del dueño):

1. **Nombres comerciales** (Ozempic, Wegovy, Mounjaro, Zepbound): agregados a los `tags` de
   Semaglutida/Tirzepatida en `lib/peptide-profiles.ts` — esto es funcional, no solo copy: antes
   buscar "Ozempic" en el formulario de crear péptido no encontraba nada. También en su
   `description`, en el FAQ y en el artículo de blog del registro de dosis.
2. **FAQ ampliado de 5 a 10 preguntas** con redacción tipo pregunta-real (recordatorios, compartir
   con el médico, sin tienda de apps, combinar compuestos). Se agregó el schema.org `FAQPage` que
   la landing nunca tuvo (solo las herramientas sueltas lo tenían) — ayuda a que Google/su IA
   citen estas respuestas directamente.
3. **Bloque "Qué es / Qué no es"** (dos columnas, check verde / X roja) en la landing, entre
   testimonios y FAQ — refuerza visualmente la línea D2 sin agregar riesgo legal nuevo.

De paso: corregido `priceCurrency: EUR` → `USD` en el schema.org de la landing (quedó desde antes
del cambio de precios a USD de una sesión anterior).

Verificado: tsc ✓ · npm test (74/74) ✓ · npm run build ✓ · contenido y estructura confirmados en
el navegador (texto, orden, JSON-LD, estilos computados `opacity:1`/`visible`) — la captura visual
del bloque nuevo tuvo un glitch puntual del panel de preview al hacer scroll (no de la app; el
resto de la página sí capturó bien). staging→main desplegado.

## ✅ Artículo de blog "Cómo registrar tus dosis de GLP-1" es/en (2026-07-27)

El dueño notó que la home no aparece en Google ni en la IA de Google para búsquedas genéricas
("registra tus dosis de GLP-1") — solo cuando buscan "peptibrain" por nombre. Diagnóstico: normal
para un sitio de días; la home compite por marca, no por intención de búsqueda tipo "cómo hacer
X". Se creó un artículo dedicado a esa intención exacta:

- `/blog/como-registrar-tus-dosis-de-glp1` (es) y `/en/blog/...` (en). Registrado en
  `lib/blog/posts.ts` + mapa de contenido en `app/[locale]/blog/[slug]/page.tsx`.
- Contenido original: qué anotar en cada dosis, cómo empezar el primer día, qué mirar en el
  registro semanas después, cómo llevarlo a la cita médica, errores comunes. Se miró la landing
  de la competencia (Shotsy) solo para inspirarse en QUÉ cubrir (rotación de zona, exportar para
  la cita), nunca se copió texto.
  Enlaza a PeptiBrain de forma natural al final, no como venta forzada.
- Jerarquía SEO verificada en el navegador: 1 h1, 6 h2, 3 h3.
- **Pendiente del dueño**: generar `public/blog/como-registrar-tus-dosis-de-glp1.png` (prompt de
  imagen ya entregado, mismo estilo que el resto del blog: ícono blanco sobre degradado verde) y
  agregar el slug a `SLUGS_WITH_IMAGE` en `lib/blog/posts.ts` para activarla. Mientras tanto cae al
  ícono + degradado por defecto (se ve bien igual, no es un error).

Verificado: tsc ✓ · npm test (74/74) ✓ · npm run build ✓ · verificado visualmente en el navegador
(ambos idiomas, aparece en el índice del blog) · staging→main desplegado.

## ✅ Ajustes a Compatibilidad de stacks: navegación + honestidad del "sin datos" (2026-07-27)

Feedback del dueño tras ver la herramienta desplegada:
- **No estaba enlazada** en el menú "Herramientas" del header (`ToolsMenu.tsx`) ni en el footer —
  solo se llegaba por `/herramientas` o los enlaces cruzados de otras calculadoras. Agregada en
  los tres lugares.
- El veredicto del resultado pasa de `<p>` a `<h3>`, por el pedido explícito de reforzar
  h1/h2/h3 en todas las páginas para SEO (recordatorio general, aplicado aquí).
- **"Sin datos" se sentía como que la app estaba rota** (ej. Semaglutida + TB-500): el aviso de
  "la mayoría no tiene estudios" solo vivía DENTRO de la tarjeta de resultado, nunca antes. Ahora
  hay una línea siempre visible bajo los selectores que lo avisa de entrada — mismo principio
  honesto que ya tenía la herramienta, pero con la expectativa puesta ANTES, no después.
- Se agregaron 12 pares reales GLP-1 × péptidos de recuperación (Semaglutida/Tirzepatida/
  Retatrutida/Cagrilintide × BPC-157/TB-500/GHK-Cu) marcados "Precaución" en vez de "Sin datos" —
  es un stack de recomposición corporal genuinamente común, y el propio perfil de BPC-157 ya
  decía "sin interacciones graves conocidas con otros péptidos de esta lista", una pista real que
  no se estaba usando. Sigue sin inventarse ningún dato: la nota es honesta sobre que son
  mecanismos distintos y que no hay estudio formal de la combinación puntual.

Verificado: tsc ✓ · npm test (74/74) ✓ · npm run build ✓ · verificado visualmente en el navegador
(menú, footer, tarjeta de resultado con el nuevo texto) · staging→main desplegado.

## ✅ Nueva herramienta gratis: Compatibilidad de stacks (2026-07-27)

El dueño vio la herramienta de un competidor (peptidosfacil.com) — una matriz de 23×23 (500+
celdas) sin jerarquía, que ni él mismo entendía. En vez de copiarla, se construyó `/compatibilidad`:
elegir 2 compuestos → un solo veredicto (Estudiado / Precaución / Evitar / Sin datos), combinaciones
populares precargadas, leyenda visual. Reutiliza el campo `combinesWithAvoid` que ya existía en
cada perfil de `lib/peptide-profiles.ts` — no se inventó contenido nuevo, solo se reestructuró en
`lib/stack-compatibility.ts` (22 compuestos, 36 pares curados; distingue lo que la fuente nombra
explícitamente de lo que es solo plausible por categoría, marcado como "caution" para no inflar
el veredicto). Integrada en `/herramientas`, en los enlaces cruzados de las demás calculadoras y
en el sitemap.

Verificado: tsc ✓ · npm test (74/74) ✓ · npm run build ✓ · **verificado visualmente en el
navegador a 375px** (los 4 estados, FAQ, disclaimer y CTA) — es pública, no requiere login, así
que a diferencia de la mayoría de la app sí pude mirarla renderizada de verdad. staging→main
desplegado.

## ✅ Auditoría freemium + cierre de 2 fugas de monetización (2026-07-27)

El dueño pidió evaluar la lista de features gratis/Pro como experto en monetización. Hallazgo
real revisando el código (no solo el marketing): dos features anunciadas como Premium eran
gratis de facto. Con su OK, se corrigieron:

- **"Crear protocolos automáticos"** (Pricing/Paywall feature Premium #5): `addProtocol` y
  `addTitrationProtocol` en `lib/app-data.ts` no tenían NINGÚN control de plan — un usuario
  gratis podía generar sus 60 dosis programadas igual que Premium. Ahora lanzan `PlanLimitError`
  para plan gratis. El botón "Crear protocolo" en Péptidos manda al paywall en plan gratis
  (mismo patrón que el botón del Asistente IA en Inicio) en vez de abrir el modal sin avisar.
- **Histórico de Estadísticas sin tope**: plan gratis ahora ve hasta 30 días (today/7d/30d);
  rangos más largos (3m→10y/all/custom) muestran `PremiumLocked`, con las opciones bloqueadas
  del selector marcadas "🔒 Premium". Si alguien gratis llega con "Histórico" ya seleccionado
  (el default de la página), se reajusta solo a 30 días — no lo recibe con un muro apenas entra.
- **Copy corregido**: "Salud completa (comidas, hidratación...)" en Pricing y Paywall mencionaba
  "comidas", que ya era gratis desde antes — no genera conversión y genera la sensación de "pagué
  por algo que ya tenía". Reemplazado por las categorías que sí siguen siendo Premium (fotos,
  análisis, hidratación, sueño, ánimo).

Recomendaciones dadas pero NO implementadas (quedan para si el dueño las pide): momento de
upgrade emocional en la racha de 7 días (no bloqueante), preview borroso del PDF del informe en
vez de un muro directo.

Verificado: tsc ✓ · npm test (74/74) ✓ · npm run build ✓ · staging→main desplegado.
**No verificado en navegador**: ambas pantallas viven tras el login.

## ✅ Encuesta de motivo de cancelación (2026-07-27)

Capa 1 de `docs/sistema/PROMPT-RETENER-INGRESOS.txt` (ya la mencionaba como pendiente). Idea
originada en un post compartido sobre encuestas de cancelación, adaptada a lo que Hotmart permite
de verdad. Spec completa en `PROMPT-ENCUESTA-CANCELACION.md`.

- Nueva encuesta de un clic entre "rechazó la oferta de descuento" y "instrucciones de cancelar":
  `components/app/cuenta/CancelSurveyModal.tsx`. Motivos: no_esperaba, plan_gratis_basta,
  no_entendi, miedo_cobro, muy_caro, no_tiempo, otro (con nota opcional).
- Ruteo: "muy_caro" reabre el `CancelOfferModal` que ya existía; "no_entendi" ofrece un mailto a
  soporte; el resto solo registra y sigue. **Nunca se ofrece pausar ni descuento automático por
  cobro** — Hotmart no lo expone por API, prometerlo generaría cobros que igual llegan.
- Tabla nueva `cancellation_feedback` (migración 0046, **aplicada y verificada contra la base
  real** vía Supabase MCP), servidor-only con RLS activo sin políticas — mismo patrón que
  `hotmart_events`/`ai_calls`. Endpoint `app/api/account/cancel-feedback/route.ts`.
- Panel de admin: nueva tarjeta "Motivos de cancelación · últimos 30 días" en la sección Usuarios,
  junto a "Cancelaciones (30d)" (`lib/admin-data.ts` + `AdminDashboard.tsx`).

Verificado: tsc ✓ · npm test (74/74) ✓ · npm run build ✓ · migración aplicada y confirmada contra
Supabase real · staging→main desplegado. **No verificado en navegador**: el flujo vive tras el
login (Cuenta → Cancelar suscripción) y nunca inicio sesión.

## ✅ Bug #30, retry en 503 de family_extra_seats, decisión de rutas /en/ (2026-07-27)

- **#30 resuelto**: no era una contradicción real. "Grupo de 3 cuentas" (marketing) cuenta al
  dueño + 2 invitados = 3; el aviso de cupo lleno decía "tu plan Family solo incluye 2" sin
  aclarar que ese 2 son los invitados, no el total, y leía como que faltaba 1 cuenta prometida.
  Reescrito: "tu plan Family solo incluye 2 invitados además de ti".
- **#32/#57 (503 de `family_extra_seats`)**: la causa de raíz (plan gratuito de Supabase se
  satura) no se puede arreglar desde el código sin pasar a un plan pago — **eso sí requiere tu
  aprobación explícita porque cuesta dinero, no lo decidí solo**. Lo que sí se podía hacer sin
  gastar: un reintento automático (400 ms) antes de rendirse, en `lib/app-data.ts`. La mayoría de
  esos 503 son un bache de un segundo, no una caída real.
- **#58 (`cdn.growthbook.io` 503)**: revisado — GrowthBook **no existe como dependencia en
  `package.json`** ni se referencia en ningún archivo del proyecto. Esas peticiones que vio el QA
  no las genera el código de PeptiBrain; probablemente una extensión del navegador o herramienta
  del entorno de quien hizo el QA. No hay nada que arreglar aquí.
- **Decisión de rutas `/en/` (#47)**: la app **todavía no se lanzó** (nada indexado en Google
  todavía), así que es el momento de menor riesgo para decidir, no de mayor. Se decide mantener
  los mismos slugs en español para ambos idiomas (`/peptidos`, no `/peptides`) — cero trabajo,
  cero riesgo de romper nada, y como no hay tráfico ni enlaces guardados todavía no hay costo de
  SEO real en esta decisión. Si más adelante se quiere un dominio 100% en inglés para ese mercado,
  se revisita entonces.
- **Revisión estática (sin poder loguearme) de "Eliminar cuenta" / "Restablecer datos" /
  "Cancelar suscripción"**: los tres piden escribir una palabra de confirmación distinta cada uno
  (no están mezclados), deshabilitan el botón hasta que coincide exactamente, y "Cancelar
  suscripción" dirige a instrucciones por email en vez de cancelar directo — correcto, porque
  Hotmart es quien de verdad gestiona el cobro, no la app. No encontré bugs, pero **no reemplaza
  probarlo de verdad logueado** — sigue en la lista de "NO PROBADO" hasta que tú (u otra persona
  con cuenta) lo hagas.

Verificado: tsc ✓ · npm test (74/74) ✓ · npm run build ✓ · staging→main desplegado.

## ✅ Lote de bugs cosméticos del backlog QA (2026-07-27)

Retomé el backlog de bugs cosméticos "MENORES — copy y UI" (sección de más abajo). Corregidos
#17, #37, #39, #43, #82 y #84 (detalle en cada número, más abajo en la lista completa). De paso,
revisando código encontré que #38, #42 y #75 ya estaban resueltos de sesiones anteriores sin
marcar ✅, y que #79 (CSV con fechas sin cero) parece obsoleto: no existe ninguna función de
**exportar** CSV en el código actual, solo importar.

Sigue pendiente (necesitan decisión de producto o ver la app logueada, cosa que no puedo hacer):
#19, #24 (parece resuelto pero no puedo confirmarlo sin datos reales), #30, #32/#57/#58 (causa de
raíz en red — CR-3, requiere investigar Vercel/env), #40, #41, #44, #45, #46, #47 (decisión de
rutas /en/ ANTES de lanzar), #49, #70, #80, #81, #83, y toda la sección "NO PROBADO" que requiere
OK explícito del dueño.

Verificado: tsc ✓ · npm test (74/74) ✓ · npm run build ✓ · staging→main desplegado y confirmado
(`success` en GitHub, commit `885c7fd`). **No verificado en navegador**: todas las pantallas
tocadas viven tras el login.

## ✅ Estados vacíos con CTA (2026-07-27)

Barrido pedido por el usuario: toda pantalla que puede mostrarse "sin datos
todavía" debe tener mensaje + botón a la acción, no solo un icono y una frase
muerta. Se usó un agente Explore para mapear los ~18 puntos del código con
`.length === 0`; se corrigieron los 5 que eran realmente bare (sin ningún
botón):
- Inventario de viales (`peptidos/page.tsx`, `ViatesTab`): CTA a agregar
  péptido, o a bajar hasta las tarjetas de péptido si ya hay péptidos.
- `ProtocolModal` sin péptidos: botón directo a crear uno.
- `HelpCenter` sin resultados: "Limpiar búsqueda" + "Escribir a soporte".
- `ShoppingList` sin dosis programadas: botón "Registrar uso" (reusa
  `/app/peptidos?nuevo=uso`).
- Informe médico completamente vacío: un aviso con CTA arriba en vez de
  4 tablas mudas (no se puso CTA en cada tabla individual porque es un
  documento imprimible para el médico, no una pantalla de acción).

El resto de puntos encontrados (paneles de admin, vistas de solo-lectura de
familia compartida, celdas de calendario/semana por día, ideas board) ya
estaban bien así o no tienen ninguna acción sensata que ofrecer — se dejaron
igual a propósito.

Verificado: tsc ✓ · npm test (74/74) ✓ · npm run build ✓ · staging→main
pusheado. **No verificado en navegador**: todas las pantallas tocadas viven
tras el login y nunca inicio sesión — igual que el resto de la app interna.

## ✅ Programa de afiliados Hotmart + precios en USD (2026-07-27)

Un tercero quiere vender PeptiBrain por afiliación. No hizo falta tocar código
del webhook: `payload->data` de Hotmart ya trae `affiliates`/`commissions` en
cada evento, así que el tracking de quién vendió qué lo lleva Hotmart solo.

- Comisión configurada en Hotmart: **35% recurrente**, solo en Premium/Family
  (mensual y anual). El plan Fundadores (pago único) queda en 0%.
- Acceso de afiliados: abierto a cualquiera en Hotmart.
- `NORMAS-AFILIADOS.md` (raíz del repo) es el texto para pegar en Hotmart →
  Afiliación → Reglas del afiliado: qué SÍ/NO puede decir un afiliado (línea
  roja D2: la app ejecuta el protocolo, no lo sugiere — nada de dosis, curas
  ni sustituir al médico), reglas de promoción y la comisión real. **Pendiente
  del usuario**: pegarlo en Hotmart y pasarle el link de afiliación a su
  contacto — eso no lo puedo hacer yo.
- `lib/admin-data.ts` + `AdminDashboard.tsx`: nueva tarjeta "por afiliado"
  (ventas netas, devueltas) leída directo de `hotmart_events.payload`, dentro
  de la sección de Adquisición. Hotmart sigue siendo el libro de comisiones
  oficial; esto es solo visibilidad para el dueño.
- **Bug real encontrado de paso**: la landing en español anunciaba "9€/mes" y
  "19€/mes" pero Hotmart cobra en dólares (Premium $9, Family $19) — precio y
  divisa no coincidían con lo que se cobraba de verdad. Corregido:
  `CURRENCY` en `i18n/routing.ts` ahora es USD en los dos idiomas (antes solo
  `en` era USD). `USER_DATA_CURRENCY` (lo que el usuario anota que gastó en
  sus viales) sigue en EUR — es su historial, no un precio de la app, y no
  debe seguir al idioma (ver comentario en el propio archivo, bug #60 previo).
  Verificado en el navegador: `/es` y `/en` muestran `$9 /mes` y `$19 /mes`,
  sin ningún € colado en precios de planes.

Verificado: tsc ✓ · npm test (74/74) ✓ · npm run build ✓ · staging→main
mergeado y pusheado (commit `7b720a1`).

## ✅ Bloque C del PLAN-PRODUCTO.md — COMPLETO, 12 de 12 (2026-07-27)

Desplegado en 5 capas verificadas (40d0d8a, eb918b4, 2a32692, 791d163, 481be53).

**Decisión de producto tomada con el dueño**: C1 y C6 pedían que la app sugiriera
dosis e interpretara análisis, lo que choca con la línea roja D2 del propio plan
("la app EJECUTA el protocolo del usuario, nunca lo sugiere"). Se eligió respetar
la línea. Consecuencias concretas en el código:
- Los análisis muestran **tendencia** (subió/bajó respecto a la vez anterior) y
  nunca si un valor es normal. La flecha **no se pinta de verde ni de rojo**:
  subir es bueno en un marcador y malo en otro, colorearlo colaría un juicio.
- Los patrones de efectos **cuentan coincidencias**, no diagnostican: "5 de 6
  náuseas cayeron en día de dosis" es un dato para llevar a consulta; "la dosis
  te causa náusea" sería medicina.

| # | Qué | Estado |
|---|---|---|
| C2 | Tarjeta "hoy toca esto" (dosis + unidades + jeringa + zona, junto y antes de inyectar) | ✅ |
| C3 | Caducidad real del vial (`reconstituted_at`, migración 0045) + aviso de recompra a ≤10 días | ✅ |
| C4 | Informe médico con análisis y efectos secundarios | ✅ |
| C5 | Patrones de efectos (`lib/side-effect-patterns.ts`, 8 tests) | ✅ |
| C6 | Tendencia en análisis, versión segura (`lib/lab-trend.ts`) | ✅ |
| C7 | Gráficos a prueba de outliers (`lib/chart-scale.ts`, 7 tests) | ✅ |
| C8 | Resumen semanal, domingos 10:00 (`/api/cron/weekly`) | ✅ |
| C9 | Comparador de fotos antes/después | ✅ |
| C10 | Coste por mg, semanal y proyección anual (10 tests) | ✅ |
| C11 | Asistente: markdown legible + 1024 tokens + aviso si se corta | ✅ |
| C1 | "Repetir lo que venías haciendo" (`lib/protocol-history.ts`, 9 tests) | ✅ |
| C12 | Tour con coachmarks anclados a elementos reales | ✅ |

**Cómo se resolvió C1 sin cruzar la línea**: en vez de plantillas con dosis
típicas (que es recetar), la app deduce la pauta de las dosis que el usuario YA
registró con ese péptido. Los números son suyos; la app solo se acuerda por él.
Exige 3 dosis mínimo, usa la mediana de los intervalos (unas vacaciones no le
cambian el "cada 7 días") y descarta el historial entero si encuentra una
cantidad no numérica, en vez de rellenar basura en un formulario de dosis.

**C12** pasó de 9 pantallas de texto a 5 pasos que iluminan el elemento real
(anclados por `data-tour` en `TopNav`), con botón Atrás. Sigue las convenciones
de overlay del proyecto: `createPortal` a `document.body` —el header tiene
`backdrop-blur` y un `fixed` dentro de él se posiciona respecto al header, que
fue el bug #50— y cierra con Escape, con la X y con clic fuera.

Verificado en cada capa: tsc ✓ · npm test (74/74) ✓ · npm run build ✓ · deploys
confirmados. La migración 0045 se comprobó contra el esquema real de la base
antes y después de aplicarla.
⚠️ **No verificado en navegador**: la tarjeta "hoy toca esto", el tour y el resto
de pantallas internas viven tras el login, y nunca inicio sesión. Están cubiertas
por tsc/tests/build, no por inspección visual.

## ✅ Segunda tanda de bugs cosméticos del backlog QA (2026-07-27)

Tras el Bloque B, se pidió explícitamente cerrar los ~25 bugs restantes. Cerrados en esta tanda:
- **#5** — confirmación al borrar foto de progreso (antes borraba directo); de paso, `alt` real
  en la imagen del lightbox en vez de `alt=""` (parte de #39).
- **#21** — "Nombre del péptido (opcional)" decía opcional en el formulario donde SÍ es obligatorio
  (crear péptido); nuevo placeholder `peptideNameRequiredPlaceholder` solo ahí. Los usos legítimamente
  opcionales (calculadora) no se tocaron.
- **#22** — Proveedores ahora valida formato de web/teléfono/email (`lib/validation.ts` nuevo,
  compartido); antes aceptaba `javascript:alert(1)` como web sin avisar.
- **#28** — "Vencida hace 0 días" → "Vence hoy" cuando la dosis venció el mismo día.
- **#31** — botón "Invitar" deshabilitado ahora también aplica `grayscale` (señal que no depende
  del contraste de color, más robusta en modo oscuro).
- **#48** — la calculadora ahora explica por qué no calcula cuando agua/vial/unidades = 0 (antes
  se quedaba en silencio).
- **#56** — confirmado que ya estaba resuelto (capa anterior), solo se marca en el backlog.
- **#65** — `importCsvResult` con plural ICU correcto + `importCsvDoses` ahora devuelve qué fila
  falló y por qué (`failedRows`), mostrado en `ImportCsvModal`.
- **#77** — teléfono de un familiar ahora se valida igual que en "Editar perfil" (antes aceptaba
  cualquier texto).

Verificado: tsc ✓ · npm test (40/40) ✓ · npm run build ✓.

**Quedan sin tocar** (requieren decisión de producto o son de bajo impacto/alto riesgo de tocar a
esta distancia del lanzamiento): #8 (marcar dosis futura como aplicada — podría romper el caso
legítimo de registrar una dosis unas horas antes), #10/11/14/16/17/19/20/24/25/27/29/30/57/58/61-63/
66/67/69-76/78-84 — sobre todo copy menor, i18n de detalle, o requieren ver la pantalla renderizada
para no adivinar. Documentados en el backlog de abajo, no bloquean vender con seguridad.

## ✅ Bloque B del PLAN-PRODUCTO.md completo (2026-07-27)

Los 6 puntos del Bloque B, incluyendo los 2 refactors grandes (B1/B2) que el usuario pidió
explícitamente hacer YA pese al riesgo a 6 días del lanzamiento.

- **B1 — sistema único de formularios**: nuevo `lib/hooks/useSaveAction.ts` (saving/error/logError
  en un solo hook). Migrados los 13 formularios que antes repetían el patrón a mano: los 9 modales
  de Salud (incluye ejercicio), ProviderModal, ProtocolModal, CalendarModal (viaje), familia
  (invitar), y registrar dosis en Péptidos.
- **B2 — capa de caché de datos**: instalado `swr`. Nuevo `lib/hooks/useAppData.ts` con una sola
  clave de caché compartida (`"app-data"`) para las 7 pantallas (Inicio, Péptidos, Salud,
  Estadísticas, Familia, Cuenta, Informe) + el widget de dosis del header, que antes hacían
  `loadAppData()` cada una por su cuenta (~24 peticiones duplicadas por navegación, CR-3). Ahora
  comparten una sola copia: marcar una dosis en una pantalla actualiza el badge del header al
  instante, sin refetch.
- **B3** — `lib/date-range.ts` con `formatDateSmart` (año solo si distinto), aplicado en Salud;
  corregidos 2 bugs reales de idioma (`ProfileMenu` reimplementaba `todayIso`, `BodyLevelChartSection`
  ignoraba el locale real). El resto de duplicación cosmética de fechas (funcionalmente correcta)
  queda como deuda técnica documentada, no tocada por riesgo/beneficio a esta distancia del lanzamiento.
- **B4** — `removeDose()` en `lib/app-data.ts` + botón de borrar con confirmación en cada dosis del
  protocolo (antes solo se podía borrar el péptido entero o resetear todos los datos).
- **B6** — cerrados de este backlog: #4, #6, #12, #13, #35, #36, #53, #59, #64 (varios ya cubiertos
  como efecto colateral de B2/A2). El resto (~25 de 84, sobre todo copy/UI menor) queda documentado
  como pendiente, no crítico para vender con seguridad.

Verificado: tsc ✓ · `npm test` (40/40) ✓ · `npm run build` ✓. No se pudo verificar visualmente el
flujo con sesión iniciada (nunca uso contraseñas); sí se verificó que la home pública carga sin
errores en el servidor de desarrollo local.

## ✅ Bloque A del PLAN-PRODUCTO.md, sin A1/A5 (2026-07-26) — desplegado a main (ceaf364)

Ejecutado A2, A3, A4, A7, A8 completos; A6 documentado (requiere que el dueño use el botón ya
existente, no algo que el agente deba automatizar). Quedan A1 (pago real, solo el dueño) y A5
(subir Supabase a Pro por los backups, cuesta ~25$/mes, requiere aprobación de gasto).

- **A2** — `lib/plausible.ts` ampliado (`vialMassMg`, `bacWaterMl`, `targetUnitsRange`,
  `costAmount`) y aplicado donde faltaba: calculadora de reconstitución, crear vial, registrar
  dosis, valor de laboratorio (existía el rango pero no se usaba), e importador CSV (cantidad
  Y fecha — antes aceptaba "01/01/1800" y "999999999 mg" sin avisar).
- **A3** — cerrados los formularios que fallaban en silencio (400/500 sin ningún mensaje):
  registrar dosis, proveedor, protocolo/titulación, viaje (no tenía ni try/catch), los 8 modales
  de Salud + ejercicio, invitar familiar (tampoco tenía try/catch) e importar CSV de familia.
- **A4** — todos esos catches (más los ya existentes de péptido/vial) ahora llaman
  `lib/error-log.ts` `logError()`: un 400/500 real queda en `error_log`/panel, no solo en la
  consola del usuario que lo sufrió.
- **A6** — NO ejecutado por el agente (borrar es irreversible); usar
  Cuenta → Zona de peligro → Restablecer mis datos.
- **A7** — decidido NO traducir rutas (`/peptidos` se mantiene en inglés) a 6 días del
  lanzamiento: nada que proteger todavía, riesgo real de romper next-intl. Backlog post-lanzamiento.
- **A8** — `Help.tools1A` (es/en) ya distingue la calculadora pública gratis de la de Premium.

Verificado: tsc ✓ · `npm test` (40/40) ✓ · `npm run build` ✓ · deploy a producción confirmado.

## ✅ Tests automatizados de los flujos críticos (2026-07-26) — desplegado a main (c65685f)

Vitest instalado (`npm test`). 40 tests en 4 archivos, 0.8s, corren sin navegador ni sesión ni DB:
- `tests/dose-math.test.ts` (11) — matemática de dosis (unitsToDraw/waterForTargetUnits)
- `tests/date-range.test.ts` (10) — filtros de fecha (isWithinRange/todayIso/formatDateOnly)
- `tests/plausible.test.ts` (7) — límites clínicos de plausibilidad
- `tests/stats.test.ts` (12) — adherencia/estado de vial/dinero invertido

Cubren los casos exactos que el QA encontró rotos (agua=0→Infinity, dosis mayor al vial,
fechas futuras contando como actividad, rango "hoy-hoy" colando ayer, "sin datos" vs "0%" del
bug #24). Encontraron un bug real al escribirlos: `myShareOfCost` en `lib/stats.ts` reventaba
con `TypeError` si `vial.shares` venía `undefined` — verificado que no ocurre en producción hoy,
blindado con `?? []` de todas formas por ser cálculo de dinero. tsc ✓ build ✓.
**No cubren**: interfaz, base de datos, permisos, ni el recorrido completo por pantalla — para eso
haría falta Playwright con una cuenta de pruebas dedicada (ofrecido, pendiente de decisión del usuario).

## 🐞 BACKLOG DE BUGS — lista viva (2026-07-25)

> **Origen**: dos rondas de QA exhaustivo hechas por Claude con la extensión de Chrome, usando la
> app como usuario real (creó péptidos, viales, dosis, protocolo de 60 dosis, salud, foto,
> proveedor, viaje) y forzando límites (0, negativos, texto, fechas imposibles, nombres de 229
> caracteres, triple clic). **84 hallazgos numerados.** Numeración original conservada.
> **Lo que SÍ está bien**: los cálculos de las 4 calculadoras se verificaron correctos
> (reconstitución, GLP-1 sema/tirze, conversor mg↔mcg, dosis→mL/U); el importador CSV es el ÚNICO
> formulario que valida y avisa bien (patrón a copiar); los exports están bien formados; sin
> errores de consola al cargar.
> **Regla**: no borrar entradas al arreglarlas — marcarlas ✅ con el commit.

### 🎯 LEER PRIMERO — 4 causas raíz que explican ~30 de los 84
Atacar estas cuatro mata la mayoría del backlog. Arreglar bug a bug es el error aquí.

- **CR-1 · No hay capa de validación en cliente.** El backend rechaza con HTTP 400 y la UI **no dice
  nada**: el modal no se cierra, el botón sigue verde, el usuario cree que guardó. Y donde no hay
  regla en base, entra cualquier cosa. Explica: 1, 2, 3, 4, 7, 14, 15, 21, 22, 53, 55, 67, 77.
  → Copiar el patrón del importador CSV (aviso inline en rojo) y el de "Editar perfil" (validación
  inline "Correo válido"/"Número válido"), que YA existen y funcionan bien.
- **CR-2 · No se puede borrar ni editar casi nada de Salud.** Un dato mal metido es permanente.
  Explica: 6, 23, 68 — y bloquea la limpieza de los datos de prueba que quedaron.
- **CR-3 · Refetch duplicado de 12 tablas en cada navegación (~24 peticiones).** Explica: 12, 32,
  57, 58, 59 (503 intermitentes, lentitud de 5-8 s, badge que no se actualiza).
- **CR-4 · Fechas mezclando UTC y hora local, y sin año.** Explica: 9, 52, 61, 79, 82.

### 🔴 CRÍTICOS — riesgo de dosificación, pérdida de datos o bloqueo
1. ✅ **Concentración `Infinity mg/mL` guardada en base.** Vial 10 mg + agua `0` → guarda y muestra
   `10 mg · Infinity mg/mL`. Lo más grave del informe. Validar agua > 0 y no renderizar nunca
   `Infinity`/`NaN`.
2. ✅ **Calculadora dice "Extraer hasta 0.0 unidades" sin avisar.** 10 mg + 0.01 ml + 250 mcg → `0.0 U`
   (real 0,025 U, no medible). Existe aviso para "supera la jeringa" pero no para el defecto.
3. ✅ **"Resolver agua" da resultado físicamente imposible.** Vial 1 mg, dosis 2000 mcg, 20 U → `0.10 mL`.
   No se pueden sacar 2 mg de un vial de 1 mg, y 20 U son el doble del volumen total.
4. ✅ **Fallos silenciosos en 5 formularios** (400 sin mensaje): nombre de péptido de 229 caracteres
   (input sin `maxlength`), vial `-10` mg, peso `-50` kg / grasa `500 %`, comida `-5000` kcal,
   sueño `48` h.
5. ✅ **"Eliminar foto" borra sin confirmación** (los demás borrados sí confirman). Ver también 56.
6. ✅ **No hay forma de borrar dosis ni protocolos programados.** Ahora se puede borrar una dosis
   individual (`removeDose` + confirmación) además del péptido entero o "Restablecer todos mis datos".
7. ✅ **Ningún control de plausibilidad, y encima se celebra.** Aceptó 500 kg, 99 % grasa, 999.999 kcal,
   999.999 ml, 99.999 min, testosterona 99.999, dosis 999.999 mg. El toast felicitó con **"-427 kg"**.
8. ✅ **Dosis en el futuro se puede marcar como Aplicada** (registrada el 01/01/2030).
9. ✅ **Fechas sin año** (`mar 1 de ene`, `26 jul`): un registro de 1900 o 2030 parece de este año.
   Peligroso en un historial clínico.
50. ✅ **El modal "Centro de ayuda" queda ATRAPADO y no se puede cerrar.** X y título fuera de pantalla,
   `Escape` no cierra, clic fuera tampoco y además **atraviesa** el modal activando lo de debajo.
   Solo se sale recargando. **Causa exacta ya diagnosticada**: el overlay `fixed inset-0` se
   renderiza DENTRO del `<header sticky backdrop-blur>`; el `backdrop-filter` crea un containing
   block para `position:fixed`, así que `inset-0` mide 57 px en vez del viewport → el panel queda en
   `top:-264px`. **Arreglo: `createPortal(document.body)`** (los demás modales sí se centran bien).
51. ✅ **Doble/triple clic en "Guardar péptido" crea duplicados.** 3 clics → 3 POST 201 → 3 péptidos.
   No se desactiva el botón durante el envío. **Es el origen real de los dos "Semaglutida"**
   (el arreglo por nombre del commit 916b291 no cubre la carrera de clics rápidos).
52. ✅ **Desfase de un día app vs informe.** Salud "25 jul", informe "24 jul". Peso del 1 ene sale como
   "31 dic 1899". Mezcla de UTC con hora local al formatear.
53. ✅ **El importador CSV acepta fechas y cantidades imposibles**: `01/01/1800` y `999999999 mg` se
   importan (201). Ese registro rompe el gráfico "Dosis en el tiempo" y provoca scroll horizontal
   en toda la página. Ahora rechaza (cuenta como fila fallida) fechas fuera de ±25/+3 años y masas
   fuera del rango plausible.
54. **El icono de descarga sin etiqueta de Familia exporta TODOS tus datos** (`peptibrain-datos.json`,
   todo el historial) — el `aria-label` ya existe; sin confirmación (no se añadió: es una descarga
   no destructiva, reversible, no justifica la fricción de un modal).

### 🟠 ALTOS — funcionalidad
10. ✅ Asistente responde cortado y con **markdown crudo** (`**6 péptidos**`), y trunca la respuesta.
11. ✅ **"Programar una dosis" no programa nada**: navega a Péptidos › Resumen sin abrir formulario.
12. ✅ Navegación lenta o perdida: pulsar "Péptidos" a veces no hace nada; cuando funciona tarda 5-8 s
    mostrando el dashboard viejo. (Ver CR-3 — resuelto con caché SWR compartida, B2.)
13. ✅ **Badge rojo de dosis pendientes no se actualiza** al aplicar una dosis (seguía en 60), y cuenta
    las 60 futuras en vez de solo las vencidas/de hoy. Ambas partes resueltas: se actualiza al
    instante (B2, caché compartida) y solo cuenta vencidas + de hoy (`dueTodayOrOverdueCount`).
14. ✅ Duración del protocolo sin tope visible: 9999 semanas → "creará 60 dosis" sin explicar el límite.
15. ✅ **Viaje con fecha fin anterior al inicio se guarda** (26 jul → 1 jul).
16. ✅ Pide zona de inyección para un péptido **ORAL**.
17. ✅ Lista de la compra incoherente: "Añade un vial" cuando sí lo tiene; sugiere jeringas para oral.
    Mensaje distinto para "sin vial" vs "vial con unidad no calculable"; jeringas solo cuentan vías
    inyectables (`NON_INJECTABLE_ROUTES` sumó "nasal", que faltaba junto a "intranasal").
18. ✅ Confirmación equivocada: al borrar un **proveedor** pregunta "¿Eliminar este **vial**?".
19. Protocolo guardado en la calculadora se lista con un "—" en vez de un resumen.
20. ✅ Péptidos duplicados indistinguibles en el desplegable de "Registrar uso". (Ver 51 y 74.)
21. ✅ Campos "(opcional)" que son obligatorios: "Nombre del péptido (opcional)" en crear péptido
    (nuevo placeholder solo ahí). "Efecto secundario — opcional" no se encontró tal cual (ya no dice eso).
22. ✅ Proveedores sin validación: web `javascript:alert(1)`, teléfono `abcdefg`, email inválido.
    Ahora valida los 3 (bloquea guardar + avisa) con `lib/validation.ts`.
    Hoy se pintan como texto plano (no hay XSS) — **pero si algún día se convierten en `<a href>`
    sí lo habría**. "Editar perfil" YA tiene el patrón correcto: reutilizarlo.
23. ✅ **Peso y Ejercicio no se pueden editar ni borrar.** (Ver CR-2 y 68.)
24. ⏳ Métricas que se contradicen: Estadísticas "Adherencia — Sin datos" con 1 dosis aplicada;
    Inicio "Dosis cumplidas 0 de 0" mientras Estadísticas dice 1. Revisado: el test
    `tests/stats.test.ts` que cubre exactamente ese escenario de adherencia YA pasa, y no se
    encontró el texto literal "0 de 0" en Inicio — puede estar resuelto, pero solo se puede
    confirmar viendo la app logueada con datos reales (no puedo iniciar sesión).
25. ✅ Gráfica "Dosis en el tiempo" etiqueta el eje con horas (`10h`) aunque el periodo sea "Histórico".
26. ✅ Filtro "Personalizado" tras recarga mostraba datos fuera de rango — **ARREGLADO** (916b291).
27. ✅ Notificación incoherente: "Llevas 12 días sin registrar" con racha de 1 día.
28. ✅ "Vencida hace 0 días" (debería ser "vence hoy").
29. ✅ Tour guiado estático: dice "vamos a verlas una por una" pero no navega ni resalta, sin botón
    Atrás, y menciona "Con Premium" en una calculadora que el usuario ya tiene.
30. ✅ Contradicción de plan: "Mi plan: Family — el más completo" vs "tu plan Family solo incluye 2".
    No era contradicción real, faltaba aclarar "invitados" vs total — reescrito.
31. ✅ En modo oscuro el botón "Invitar" deshabilitado se ve idéntico a uno activo (añadido
    `disabled:grayscale`, señal que no depende del contraste de color).
32. ⏳ Red: `family_extra_seats` 503 → reintento de 400ms agregado (mitiga, no elimina — la causa
    real es el plan gratuito de Supabase, pasar a uno pago necesita tu aprobación). growthbook 503
    no viene del código de la app (no existe esa dependencia) — probable ruido del entorno de QA.
55. ✅ **El viaje con fechas invertidas activó "Modo viaje: Activo"** y pausó los recordatorios sin avisar.
56. ✅ Borrar un viaje no pide confirmación (ya estaba resuelto en una capa anterior).
57. ⏳ `HEAD family_extra_seats` 503 en cada carga (×2) → el banner del límite del plan puede mentir.
    Mitigado en 916b291 (`extraSeatsUnknown` ya no bloquea) + reintento de 400ms (ver 32), pero la
    causa raíz (Supabase free tier) sigue — solo se arregla pasando a un plan pago, tu decisión.
58. ✅ `cdn.growthbook.io` 503 ×3 por carga — revisado, no es del código de PeptiBrain (sin esa
    dependencia en `package.json`), ruido ajeno a la app.
59. ✅ **Todas las tablas se piden DOS veces por carga** (~24 peticiones en vez de 12). (Ver CR-3 —
    resuelto con caché SWR compartida entre las 7 pantallas + widget, B2.)
60. ✅ Al cambiar a inglés **la moneda pasa de € a $** con los mismos números. Eso no es traducir.
61. ✅ En la UI inglesa las fechas siguen en español ("Next dose lun 27 de jul").
62. ✅ El `<title>` sigue en español en `/en/`.
63. ✅ La tarjeta de "Compartir" mezcla idiomas: en español pone "jose's protocol", "1 day streak".
64. ✅ "1 días" / "1 days" — falta singular/plural (Inicio e informe). `Informe.streakDays` ahora
    usa plural ICU.
65. ✅ "1 dosis importadas · 1 péptidos nuevos creados · 1 filas con error" — sin plurales, y no dice
    QUÉ fila falló. `importCsvResult` con plural ICU + `importCsvDoses` devuelve `failedRows`
    (número de fila + motivo), mostrado en `ImportCsvModal`.
66. ⏳ (labs y efectos ✅) El informe solo incluye péptidos, dosis, viales y peso. **Faltan** comidas, hidratación, sueño,
    ánimo, efectos secundarios, análisis y fotos.
67. ✅ El desplegable de "Cantidad" del vial permite "ml" como unidad del péptido.
    ⚠️ Parcialmente mitigado en 916b291 (ya no se pinta la concentración absurda), pero **la opción
    sigue ahí**; decidir si se restringe a mg/mcg/UI salvo viales líquidos.
68. ✅ **Peso, Ejercicio, Hidratación, Sueño, Ánimo y Efectos no tienen borrar ni editar.** (CR-2.)
69. ✅ El 404 es el por defecto de Next.js: en inglés, sin marca, sin cabecera, sin enlace de vuelta.
70. "Instalar la app" abre `/descargar` a pantalla completa sin cabecera; no usa el prompt nativo
    de instalación y no cubre escritorio.
71. ✅ **Móvil (372 px):** el icono de sincronizar se solapa con el logotipo "PeptiBrain".
72. ✅ **Móvil:** en Familia el subtítulo se solapa con los botones y el banner del plan queda en una
    columna de ~10 caracteres.
73. ✅ **Móvil:** el FAB tapa "+ Registrar uso" en Péptidos y el contador de Efectos en Inicio.
74. ✅ "Elegir péptidos específicos" muestra dos "Semaglutida" idénticos.
75. ✅ Acordeón del Centro de ayuda: revisado, ya anima a `height:"auto"` sin ningún recorte fijo —
    no se encontró el bug descrito, probablemente resuelto en una capa anterior sin marcar.
76. ✅ La FAQ dice "Calculadora (Premium)" aunque el plan Family ya la incluye.
77. ✅ El teléfono de un familiar acepta 12 dígitos sin validar, mientras Editar perfil sí valida.
78. ✅ Resumen pinta las 60 dosis de golpe, sin paginación ni "cargar más".

### 🟡 MENORES — copy y UI
33. ✅ Capitalización: "Julio De 2026", "Domingo, 26 De Julio" (`capitalize` afecta también a "de").
34. ✅ Doble símbolo: "+ + Agregar otro péptido (mezcla)".
35. ✅ Números sin separador de miles: "999999 kcal" desborda la tarjeta — ya no puede ocurrir,
    A2 rechaza calorías fuera de rango (max 20.000) antes de guardar.
36. ✅ "2000.0 unidades" se pinta en verde (color de éxito) cuando es un error — ahora se pinta en
    rojo cuando supera la capacidad de la jeringa (calculadora y crear vial).
37. ✅ "Agua bacteriostática (ml)" solo existe como placeholder: al escribir desaparece la etiqueta.
    Se añadió etiqueta fija arriba del campo (igual con "Precio del vial").
38. ✅ Emojis de ánimo: revisados, ya son distinguibles y cada botón tiene `aria-label` — resuelto
    en una capa anterior sin marcar.
39. ✅ La nota de la foto solo se ve en el lightbox, no en la tarjeta; la imagen sin `alt`.
    `alt` ahora incluye fecha + nota; indicador 📝 en la tarjeta cuando hay nota.
40. El "+" de Salud a veces abre modal (Peso) y a veces un formulario inline (Ejercicio).
41. CTA inconsistentes en estados vacíos: "Registrar salud" en Ejercicio vs "Registrar comida"…
42. ✅ Botón de exportar en Familia: revisado, ya tiene `aria-label` — resuelto en una capa anterior
    sin marcar. Ver 54.
43. ✅ "Modo viaje / Pausa los recordatorios…" truncado en el menú de perfil — quitado el `truncate`,
    ahora envuelve a 2 líneas en vez de cortar a mitad de palabra.
44. Avatar vacío en "Editar perfil"; en Familia un miembro muestra una foto de vial como avatar.
45. Filtros por defecto distintos: Inicio "Últimos 7 días" vs Péptidos "Histórico".
46. La cabecera sticky solapa y recorta contenido al hacer scroll.
47. ✅ `/en/` mantiene slugs en español. **Decidido**: se quedan así (no `/peptides`) — la app
    todavía no lanzó, nada indexado, cero riesgo de romper SEO/enlaces manteniéndolo simple.
    (El `<title>` en inglés ya se arregló aparte, bug #62.)
48. ✅ Calculadora con agua = 0 o unidades = 0: no calcula y no explica por qué.
49. "Pendiente" / "Marcar como aplicada" a veces necesita dos clics (el primero solo enfoca).
79. ❓ El CSV exporta fechas sin cero: `23/9/2026`. No se encontró NINGUNA función de exportar a
    CSV en el código actual (solo existe **importar** CSV, en Familia y Cuenta) — probablemente
    esa feature se quitó o se reemplazó por el JSON export en otra capa. Bug parece obsoleto.
80. Ninguna descarga (JSON, CSV, PNG) muestra aviso de "descargado".
81. El botón "Recargar" del header no da ninguna señal.
82. ✅ "Caduca en 29 d (24 ago)" se lee como "hace 24" — reescrito "Caduca en 29 días · vence el 24 ago".
83. Cambiar de idioma te devuelve a la pestaña Resumen.
84. ✅ Los modales no usan `role="dialog"` ni atrapan el foco — arreglado en `ModalShell.tsx`
    (base compartida de 8 modales): Escape cierra, `role="dialog"`/`aria-modal`, Tab atrapado dentro.

### ⚪ NO PROBADO — requiere OK explícito del dueño
Compartir progreso y viales · cambiar permisos de familia · "Añadir asiento extra (5€/mes)" ·
descargas (PDF calculadora, informe, JSON, CSV) · Importar CSV con archivo propio · cambiar
nombre/email/teléfono/contraseña · "Restablecer todos mis datos" / "Eliminar mi cuenta" /
"Cancelar suscripción".

### 🧹 DATOS DE PRUEBA QUE QUEDAN EN LA CUENTA REAL
El QA limpió lo que pudo. **Sigue ahí porque la app no ofrece forma de borrarlo** (bug 68):
peso 500 kg / 99 % con fecha **1 ene 1900**, ejercicio 99.999 min, hidratación 999.999 ml,
sueño 12 h, ánimo Normal, efecto "Náusea severa QA" (26 jul), y **59 dosis pendientes** del
protocolo de "prueba de peptido". Contaminan estadísticas y gráficos hasta que se borren.

## 📋 SESIÓN 2026-07-25 (larga) — resumen de lo desplegado

Todo lo de abajo está EN PRODUCCIÓN y verificado (tsc + build + navegador + consultas a la DB real).

**Bugs graves corregidos**
- **8 de 10 tarjetas invisibles en la landing**: cada tarjeta del carrusel "Péptidos populares" iba
  envuelta en `<Reveal>` (aparecer al entrar en pantalla). Como el carrusel se desplaza en HORIZONTAL,
  las de la derecha nunca entraban en viewport y quedaban en `opacity:0` para siempre — incluso tras
  deslizar. Lo veía TODO visitante. Regla que queda: **nunca `<Reveal>` dentro de un scroll horizontal**.
  Verificado 8 invisibles → 0. Ningún otro carrusel tiene el patrón.
- Farmeo de puntos PB: `award_pb*` eran llamables por RPC directo → EXECUTE revocado (migración 0041).
- 10+ bugs de auditoría de código: doble-submit en 6 modales de Salud, "Próxima dosis" sin ordenar por
  fecha, límite superior de rango reaparecido en Inicio, timezone en fechas solo-día y en Modo viaje,
  reenvío de confirmación de email al guardar perfil, cupos de Familia no bloqueados al invitar, viaje
  con fechas invertidas invisible, CSV siempre en español, header desbordando a 375px.
- Modo oscuro se colaba en la web pública (nuevo `ThemeScope`: la web pública siempre en claro).

**Usabilidad — añadir un péptido (el dueño no encontraba cómo)**
- De 1 camino escondido (`Péptidos > Inventario > "+" mudo`) a **4 vías**: botón con TEXTO arriba junto
  al título visible desde cualquier pestaña, estado vacío con CTA, pestaña Resumen sin péptidos, y
  "Primeros pasos" de Inicio.
- Sugerencias al escribir (el formulario NO las tenía; el onboarding sí): desde 2 letras, busca por
  nombre Y POR ETIQUETAS. Se añadió la etiqueta `"GLP-1"` a Semaglutida/Tirzepatida/Retatrutida/
  Cagrilintide porque **escribir "glp" no devolvía nada** pese a ser el término con el que se anuncia
  la app. "TRT" ya estaba etiquetado pero no se buscaba.

**Rendimiento** (línea base y detalle en la sección de abajo)
- Mixpanel bajo demanda: −122 KB de JS en CADA primera visita (era import estático en el layout raíz).
- Web pública vuelve a ser pre-generada: el Header hacía `supabase.auth.getUser()` en servidor, lo que
  volvía dinámica toda la web (~739 ms por visita). Movido a `HeaderAuthCta` (cliente). Rutas que
  pasaron de `ƒ` a `●`: landing, blog, blog/[slug], comparador, protocolos, herramientas, descargar y
  3 calculadoras. `/calculadora` sigue dinámica A PROPÓSITO (usa parámetros de URL para prerrellenarse).
- `PageSkeleton` en 6 pantallas que hacían `return null` (pantalla en blanco).

**Panel de administración (3 capas)**
1. Seguridad: había **8 cuentas con `role='admin'`**, incluidas desechables de prueba. Reducidas a 1.
2. Costo real de IA: `lib/admin-data.ts` tenía `const aiCostEstimate = 0` escrito a mano. Migración
   0044 (`ai_calls`) + registro por llamada con tokens reales + precio por env var
   (`AI_PRICE_INPUT_PER_1M`/`AI_PRICE_OUTPUT_PER_1M`, 0 por defecto = modelo gratis actual).
   Aviso automático si la IA supera el 20% de lo facturado.
3. Embudo de activación: **calculado desde las tablas reales, NO desde un `event_log`** — un log de
   eventos empezaría vacío y añadiría escrituras por cada acción; esto funciona con el historial
   completo y mide hechos, no clics. Resalta el paso con mayor caída.
   Cuello de botella hoy: "programan una dosis" (4) → "marcan dosis aplicada" (1).

**Decisiones deliberadas de NO hacer** (para que no se relean como olvidos)
- Capa C de performance (partir la landing con dynamic import): ganancia pequeña (casi todas las
  secciones ya son de servidor) frente al riesgo de tocar el SEO de la landing.
- LTV/CAC/payback por canal: requieren gasto en publicidad, que hoy es 0 → se marcan "no medido".
- Cambiar la tipografía de marca (Inter está prohibida por `16-DIRECCION-DE-ARTE`): afecta a TODA la
  app; a 8 días del lanzamiento se enseña primero al dueño en una pantalla, no se aplica a ciegas.
- Páginas legales siguen dinámicas (les falta `setRequestLocale`): arreglo de 1 línea, tráfico mínimo.

**⚠️ Pendiente de decisión del usuario**
- Renombrar pestañas de Péptidos: Resumen → "Mis dosis", Inventario → "Mis péptidos" (propuesto, sin OK).
- Rescate visual de las capturas: racha duplicada (chip arriba + tarjeta abajo), los 5 chips mezclan
  datos y botones con la misma forma, checks grises del "Resumen de tu día" que parecen pendientes,
  nombre en minúscula, escritorio con mucho aire a los lados.

## ⚡ PERFORMANCE (2026-07-25) — capas A y D aplicadas; B y C pendientes de decisión

**Línea base** (Lighthouse móvil con throttling de red+CPU, contra servidor de producción local):

| Pantalla | Score | LCP (meta <2.5s) | CLS (meta <0.1) | TBT | Speed Index |
|---|---|---|---|---|---|
| Landing | 58 | ❌ 5.6s | ✅ 0 | 490ms | 8.6s |
| Login | 66 | ❌ 6.9s | ✅ 0 | 250ms | 6.2s |
| Paywall | 77 | ❌ 5.0s | ✅ 0.012 | 220ms | 3.1s |
| Calculadora | 73 | ❌ 5.0s | ✅ 0 | 350ms | 2.8s |

**Capa A aplicada — Mixpanel bajo demanda**: `lib/mixpanel.ts` importaba `mixpanel-browser` de forma
estática desde el layout raíz → 119 KB de JS en TODAS las páginas, 79% sin ejecutarse, incluso para
visitantes que no aceptaron cookies (y sin consentimiento la librería no puede trackear igualmente).
Ahora se carga con `import()` dinámico y SOLO con consentimiento. Resultado medido en BYTES
(determinista, no afectado por la carga de la máquina):

| Pantalla | JS antes | JS después | Ahorro |
|---|---|---|---|
| Landing | 475 KB | 353 KB | −122 KB (−26%) |
| Login | 476 KB | 361 KB | −115 KB (−24%) |
| Paywall | 446 KB | 324 KB | −122 KB (−27%) |
| Calculadora | 447 KB | 325 KB | −122 KB (−27%) |

Verificado en vivo que la analítica NO se rompió: sin consentimiento el chunk de Mixpanel (411 KB sin
comprimir) no se descarga; al pulsar "Aceptar todas" se descarga y el tracking queda activo.

**Capa D aplicada — skeletons**: 6 pantallas hacían `return null` mientras cargaban → pantalla en blanco.
Nuevo `components/app/shell/PageSkeleton.tsx` (forma del contenido real, respeta `prefers-reduced-motion`,
CLS 0) conectado en Inicio, Péptidos, Salud, Estadísticas, Familia y Cuenta.

⚠️ **Las mediciones de TIEMPO "después" NO son válidas**: al repetirlas la máquina estaba con load average
57 (CapCut + indexación del sistema + agentes en segundo plano), lo que infla LCP/TBT artificialmente.
Solo los bytes son evidencia de esta tanda. **Pendiente: repetir la medición de tiempos con la máquina en
reposo** antes de dar por cerrado el capítulo de performance.

**Pendiente de decisión (tocan la landing, NO ejecutado):**
- **Capa B, la mayor ganancia**: toda la web pública se renderiza de cero en cada visita (no cacheable)
  porque `components/app/Header.tsx` hace `await supabase.auth.getUser()` en servidor para decidir entre
  "Empezar gratis" y "Ir a mi app" → ~739ms de TTFB por carga. Moviendo esa lectura al navegador la landing
  puede ser estática/ISR → LCP estimado 5.6s → ~2s.
- **Capa C**: `dynamic import` de las secciones bajo el pliegue de la landing (baja TBT y Speed Index).

**Presupuesto para features nuevas (38)**: ninguna pantalla nueva debe pasar de ~350 KB de JS en la primera
carga ni empeorar el CLS de 0. Se mide ANTES de declararla lista.

## 🚦 CERTIFICACIÓN PRE-LANZAMIENTO (2026-07-25) — veredicto: **NO APTO todavía** (1 bloqueante, igual que el 2026-07-21)
Repetida la auditoría de venta a 8 días del lanzamiento (2 de agosto). Esta sesión además: (a) corrida y cerrada la auditoría de seguridad/rendimiento de Supabase vía MCP (revocado el farmeo de PB por RPC directo, RPCs sin sesión cerradas, 8 índices de FK agregados, políticas RLS duplicadas fusionadas), (b) corregidos 10+ bugs reales de una auditoría de código (doble-submit en 6 modales de Salud, orden de "Próxima dosis", límite superior de fecha reaparecido en Inicio, timezone en fechas solo-día y en Modo viaje, reenvío de confirmación de email, cupos de Familia no bloqueados al invitar, viaje con fechas invertidas, CSV en idioma fijo, header desbordado a 375px, modo oscuro filtrado a la web pública), (c) `MANUAL-DEL-DUEÑO.md` actualizado (estaba desactualizado: no mencionaba el panel /panel ya construido, y decía OpenRouter en vez de Gemini).

| # | Bloque | Estado | Detalle |
|---|---|---|---|
| 1 | Seguridad | ✅ | RLS en todas las tablas, IDOR probado (sesión previa), headers/CSP en vivo, webhook con firma timing-safe. Farmeo de PB por RPC cerrado hoy. Quedan 2 ⚠️ menores aceptados: "leaked password protection" requiere plan Pago de Supabase (no crítico), bucket `avatars` permite listar archivos (riesgo bajo, patrón común). |
| 2 | Datos | ✅ RLS/índices, ❌ **backups**: confirmado que el plan Free de Supabase no tiene backups ni restore — sin red de seguridad si algo se corrompe. |
| 3 | Escala | ✅ para 300-500 usuarios. Mismo Supabase Free: pausa a los 7 días de inactividad + egress 5GB — ligado al punto de backups. |
| 4 | IA | ✅ Gemini funcionando, probado con preguntas reales, kill-switch + límites activos, costo ~0%. |
| 5 | Pago | ❌ **BLOQUEANTE — el único que de verdad detiene el lanzamiento**: nunca se probó un pago real de punta a punta (pagar → plan activo → features). Código listo, falta la prueba real (solo la puede hacer el usuario). |
| 6 | Legal | ✅ 5 páginas reales (LLC verificada), enlaces del footer confirmados apuntando a rutas que existen. |
| 7 | Economía | ✅ costo IA ~0% del precio (modelo gratis). |
| 8 | Operación | ✅ panel /panel (sustituto de Sentry) + error_log + Error Boundaries activos, MANUAL-DEL-DUEÑO.md actualizado hoy. ⚠️ sin status page pública (no crítico a esta escala). |
| 9 | Producto enriquecido | ⚠️ **no verificado con evidencia fresca esta sesión** — no puedo iniciar sesión en la app (regla dura), así que no pude renderizar/puntuar /40 las pantallas internas post-fixes. Lo público (landing, calculadora, protocolos) sí se miró a 375px. Pendiente que el usuario confirme visualmente el estado vacío rediseñado de Inicio. |
| 10 | Rigor de entrega | ✅ invariantes de dinero/datos, IDOR probado, circuit-breaker IA, export de datos, borrado de cuenta real. ⚠️ auto-QA end-to-end como usuario real: no lo pude hacer yo (requiere login), pendiente del usuario. |

**Acciones que solo el usuario puede hacer antes de vender** (sin cambios desde el 2026-07-22, siguen abiertas):
1. ❌ **Prueba de pago real de punta a punta** — el único bloqueante duro.
2. ⚠️ Decidir cuándo subir a Supabase Pro (backups + sin pausa) — recomendado antes del primer cliente real, no antes de eso.
3. ⚠️ Mirar el estado vacío rediseñado de Inicio ("No tienes dosis pendientes") y confirmar que se ve bien.
4. ⚠️ Activar "Leaked password protection" si en algún momento sube a Supabase Pro (opcional, no bloqueante).

Última actualización: 2026-07-24 | Sesión de análisis de competencia (Dose Track, PepCalc, Peptides Calculator, PeptideCalc.io) + features de producto resultantes: borrar péptido, nivel estimado en el cuerpo, restablecer datos, calculadora con Water Solver/mezclas/protocolos guardados, % grasa corporal, tarjeta de protocolo compartible, sueño/ánimo, vista previa de titulación al crear protocolo, importar dosis desde CSV. Migraciones 0037-0040 corridas y verificadas. Titulación e import CSV no necesitaron migración nueva.

## 🔮 Pendiente a futuro (NO construir sin pedirlo explícitamente)
- **OCR de análisis de laboratorio con IA**: escanear foto del resultado y extraer los marcadores automáticamente (en vez de tipear a mano). Encontrado en 2 competidores (Dose Track, Peptides Calculator) — validación de mercado real. Pausado porque tiene costo real por uso (llamada a modelo de visión) — el usuario pidió "apuntalo para un futuro", no construirlo ahora. Diseño ya pensado: nunca autoguardar, siempre mostrar lo que la IA leyó para que el usuario confirme/corrija antes de guardar; límite de uso por plan para controlar costo.
- **Comprar a proveedores dentro de la app** (afiliación, comparador de precios entre tiendas): necesita decisión de negocio (con qué proveedor, cómo se declara la afiliación) antes de poder construirse — no es solo una decisión técnica. Visto en 3 competidores distintos (PepCalc, Peptides Calculator, Peptide Tracker and Library) — señal de mercado consistente, no una idea aislada. Anotado, sin construir hasta que el usuario decida el negocio.
- **Sincronización con Apple Health / Google Fit** (peso, composición corporal, entrenamientos, sueño): visto en PeptideCalc.io (HealthKit, solo lectura). No aplica a la PWA web actual — requiere apps nativas de iOS/Android. El usuario pidió anotarlo para "cuando tengamos la app en Apple y Android", no construirlo ahora.

## ✅ Sesión 11r (2026-07-23) — Tablero de Ideas / Feature Request Board (⚠️ falta migración 0031)
El usuario pidió un "feedback board / feature request board" tipo Canny. Decidido con él (AskUserQuestion): **solo usuarios registrados** proponen/votan (el tablero se VE sin login, para SEO), alcance **Ideas + Votar + Roadmap** (sin Changelog por ahora), y vive en una **página pública `/ideas`**.
- **Migración 0031** (`ideas` + `idea_votes`): `ideas` (title 3-120, description ≤2000, category, status con check open/planned/in_progress/done/declined, `vote_count` denormalizado), `idea_votes` (unique idea+user). RLS: cualquiera LEE; solo autenticado inserta idea propia; solo admin cambia estado; voto propio insert/delete. Trigger `sync_idea_vote_count` mantiene `vote_count`. **⚠️ SIN correr — hasta que se corra, `/ideas` muestra estado vacío (la query falla suave y devuelve []), pero votar/proponer NO funcionará.**
- Página pública `app/[locale]/ideas/page.tsx` (server, `force-dynamic`, lee ideas + votos del usuario + si es admin). Componente client `components/app/ideas/IdeasBoard.tsx`: tabs **Ideas** (form para proponer + lista ordenada por votos, voto optimista) y **Roadmap** (ideas agrupadas por planned/in_progress/done). El autor auto-vota su idea (patrón Canny). Admin ve un `<select>` de estado inline en cada tarjeta.
- Endpoints: `POST /api/ideas` (crear + auto-voto), `POST /api/ideas/vote` (alternar voto), `POST /api/ideas/status` (admin, requireAdmin + createAdminClient). Todos validan sesión.
- `lib/ideas.ts` (tipos + constantes de estados/categorías). i18n es/en namespace `Ideas`. Enlace "Ideas" en Header (desktop) + Footer + sitemap.
- ✅ Verificado: tsc ✓ eslint ✓ build ✓ (ruta `/[locale]/ideas` + 3 APIs compilan) · navegado en vivo a 375px: página renderiza, tabs Ideas/Roadmap funcionan, form muestra "Sign in to post" (sin sesión), roadmap con los 3 grupos de estado y sus colores, estado vacío correcto. **NO se pudo probar votar/proponer end-to-end** porque la tabla no existe aún (falta migración) y no hay conexión Postgres directa en `.env.local` para correrla desde aquí.
- **⚠️ ACCIÓN DEL USUARIO (bloqueante para que funcione)**: correr `supabase/migrations/0031_ideas.sql` en el SQL editor de Supabase. Sin eso, `/ideas` se ve pero votar/proponer da error.

## ✅ Sesión 11q (2026-07-23) — Biblioteca `/protocolos` con buscador/filtros + vida media real
El usuario compartió 2 capturas de un competidor (PepBuddy: landing + página "Peptide Library" con buscador, filtros, contador y dato de vida media por péptido) pidiendo un estudio para sacar ideas. Se hizo el análisis, se descartó copiar el dato de "ensayos en humanos" (no verificable sin investigar cada péptido) y se aprobaron 2 mejoras: biblioteca con buscador/filtros, y agregar vida media real.
- **Investigación de vida media** (agente con búsqueda web, 24 péptidos): para cada uno se buscó el dato real en fichas técnicas FDA (semaglutida, tirzepatida, retatrutida, cagrilintide, ipamorelina, sermorelina, tesamorelina, PT-141, timosina alfa-1 → confianza "alto") o estudios preclínicos/literatura secundaria (confianza "medio"/"bajo"). Para 5 péptidos (Adipotide, MOTS-c, Epitalon, Selank, Semax) **no existe ningún dato confiable** — se marcan como "Sin dato confiable" en vez de inventar un número. CJC-1295 lleva nota aclarando que sin DAC (~30 min) y con DAC (~6-8 días) son radicalmente distintos.
- `lib/peptide-profiles.ts`: nuevos campos `halfLife: string` + `halfLifeConfidence: "alto"|"medio"|"bajo"|"sin-dato"` en los 24 perfiles.
- `/protocolos` reconstruida como Biblioteca real: nuevo componente `components/app/protocolos/PeptideLibraryGrid.tsx` (client) con buscador por nombre, pills de filtro por categoría, contador "Mostrando X de 24", y cada tarjeta ahora muestra vida media con un punto de color según confianza (verde=alto, ámbar=medio, gris=bajo, sin punto + cursiva="sin dato confiable" — nunca se inventa un valor). Ya NO agrupa por categoría con headers fijos (reemplazado por los filtros interactivos).
- ✅ Verificado: tsc ✓ eslint ✓ build ✓ · navegado en vivo: buscar "sema" → 2 resultados (Semaglutida, Semax) ✓, filtro "Sleep" → 4 resultados correctos (Sermorelina, Epitalon, DSIP, Selank) ✓, Epitalon muestra "Sin dato confiable" en cursiva sin punto, Sermorelina muestra punto verde + "~11-12 min" ✓, sin desborde a 375px.
- **Nota conocida (no corregida, ya documentada)**: descripciones/vida media siguen solo en español — mismo gap bilingüe de `lib/peptide-profiles.ts` que ya existía en `/protocolos` y en la Biblioteca de la home.

## ✅ Sesión 11p (2026-07-23) — Flechas de navegación en la Biblioteca + Precios repetido
El usuario pidió dos ajustes a la home: (1) flechas para mover el carrusel de "Péptidos populares" en vez de solo deslizar, y (2) repetir la sección de Precios debajo de los artículos del blog (la página es larga, conviene recordar el precio antes de que el visitante se vaya).
- `PeptideLibrary.tsx`: agregadas 2 flechas circulares (◀ ▶, ocultas en móvil — el swipe ya alcanza ahí) que mueven el carrusel 2 tarjetas por clic.
- **Bug real encontrado y corregido**: la primera implementación usaba `el.scrollBy({behavior:"smooth"})`, que no se anima de forma fiable en todos los entornos. Se cambió a asignación directa de `scrollLeft` + la clase CSS `scroll-smooth` en el contenedor (más estándar y fiable entre navegadores).
- `app/[locale]/page.tsx`: `<Pricing />` ahora se renderiza dos veces — una vez en su posición original, y otra vez debajo de `<BlogHighlights />`, antes del CTA final. Sin conflicto de ids/anchors (verificado que Pricing no usa ninguno).
- ✅ Verificado: tsc ✓ eslint ✓ build ✓ · el navegador de vista previa se quedó pegado a mitad de la verificación (una herramienta de scroll se colgó) — se detectó, se abrió una pestaña nueva limpia, y ahí se confirmó en vivo: clic en la flecha mueve el carrusel de verdad (scrollLeft pasó de 0 a 544, capturado en pantalla con Retatrutida/BPC-157/TB-500 visibles tras el clic), y las dos secciones de Precios existen en el DOM.

## ✅ Sesión 11o (2026-07-23) — Tabla comparativa real (no imagen) en el artículo de apps
El usuario pidió una imagen "comparador potente" tipo checks/cruces contra la competencia con Nano Banana. Se le explicó el riesgo: no puedo generar logos reales de terceros, y una imagen con checks inventados para "App A/B/C" no sería precisa. Pidió que fuera "100% precisa como la información que tiene el artículo" — se decidió construirla como **tabla HTML real dentro del artículo** en vez de imagen generada (así es editable, accesible, y nunca desactualizada).
- Nuevo componente `components/app/blog/AppComparisonTable.tsx`: tabla con 3 estados por celda — check (✓ verde), cruz (✗ gris) o **guion "no especificado"** (nunca se adivina/inventa; si el artículo no lo afirma explícitamente sobre esa app, la celda queda en guion). Columna de PeptiBrain destacada con fondo verde suave. Scroll horizontal propio (no rompe el ancho de página en 375px).
- Insertada en `mejores-apps-de-peptidos.tsx` (es y en), al principio del artículo. Los datos de cada celda son **exactamente** lo que el texto del propio artículo ya afirmaba (ninguna celda inventada ni verificada por fuera): PeptiBrain con las 6 columnas en verde (español real, calculadora, registro de dosis, control de vial, plan familiar, IA); Peptide Tracker/PeptIQ/PepCalc-PeptideCalc/Dose Track solo con lo que el texto decía de cada una, el resto en guion.
- ✅ Verificado: tsc ✓ eslint ✓ build ✓ · navegado en vivo en inglés a 375px — la tabla se ve bien, con su propio scroll horizontal, sin desbordar la página; los iconos y el guion "no especificado" se leen claros.

## ✅ Sesión 11n (2026-07-23) — Biblioteca de péptidos en la home (carrusel + vista rápida)
El usuario vio una referencia visual (biblioteca de péptidos con tarjetas, categoría, icono, "Vista rápida"/"Aprender más") y propuso algo "estilo Spotify" (listas de seguimiento personales sin cuenta). Se acordó con él la versión que protege el embudo de registro: la biblioteca se explora libremente (SEO, sin login), pero "Seguir" lleva a crear cuenta — nunca se construyó el guardado anónimo de listas.
- Nuevo componente `components/app/landing/PeptideLibrary.tsx`: carrusel horizontal (scroll-snap, con puntos de paginación) con 10 péptidos curados (los mismos populares del artículo de blog), usando datos reales de `lib/peptide-profiles.ts`. Cada tarjeta: categoría (pill neutro, sin colores variados por categoría — la variedad viene del icono, no del color, respetando la disciplina cromática 60-30-10), icono único por categoría en círculo verde acento, nombre, descripción truncada, botón "Vista rápida" (abre modal reutilizando `ModalShell.tsx` ya existente, con dosis/frecuencia + CTA "Crear cuenta gratis para seguirlo" + "Ver protocolo completo") y botón "Seguir" (va directo a `/login`).
- Insertada en la home entre `FreeTools` y `BlogHighlights`. De paso se agregó TikTok al `sameAs` del JSON-LD `Organization` (solo tenía Instagram).
- **Bug real encontrado y avisado, NO corregido** (no era parte de este pedido, ya existía en `/protocolos`): los campos `route`/`frequency`/`description` de `lib/peptide-profiles.ts` solo existen en español — en la versión inglesa de la web (y ahora también en esta nueva sección) se mezcla texto en español con las etiquetas en inglés. Traducir los 24 perfiles sería un trabajo del tamaño de la traducción del blog — pendiente si el usuario lo pide.
- ✅ Verificado: tsc ✓ eslint ✓ build ✓ · navegado en vivo en inglés y a 375px: el carrusel se ve bien, "Follow" lleva a `/en/login`, el modal "Vista rápida" abre con los datos correctos y sus dos botones, sin desborde horizontal.
- **Pendiente futuro, anotado, NO construir sin que lo pida**: posible colaboración con marcas de péptidos (afiliación) o marca blanca/white label — el usuario lo mencionó como visión a futuro, no para ahora.

## ✅ Sesión 11m (2026-07-23) — Enlace "Inicio" en el menú
El usuario pidió "añade la página de inicio a la web" — se aclaró con él que quería un enlace "Inicio" visible en el menú de navegación (antes solo se podía volver a la portada tocando el logo).
- `Header.tsx`: nuevo enlace "Inicio"/"Home" antes de "Herramientas".
- **Bug real encontrado y corregido en el momento**: agregarlo sin más rompía el layout en móvil — el header pasó a medir 410px de ancho en una pantalla de 375px (scroll horizontal), porque ya no cabían todos los elementos (Inicio + Herramientas + Blog + banderas + botón). Se ocultó "Inicio" en móvil (mismo patrón que "Ingresar", que también solo se ve desde `sm:` hacia arriba) — verificado con `document.documentElement.scrollWidth` que a 375px ya no desborda, y que en escritorio si se ve.
- ✅ Verificado: tsc ✓ eslint ✓ build ✓ · confirmado en vivo a 375px (sin overflow) y a 1280px (enlace visible).

## ✅ Sesión 11l (2026-07-23) — Banner CTA del blog (con mockup de la app) + TikTok en el footer
- **Banner CTA de calculadoras**: el usuario generó las 2 imágenes (es/en, prompt de sesión anterior: mockup de la app con "250 mcg" + botón "Probar gratis"/"Try free"). Se les quitó el destello de Gemini (mismo proceso de retoque que en las 11 portadas — esta vez la marca de agua caía encima de un borde recto del mockup del teléfono, así que se ajustó el radio/máscara para no dejar rastro). Guardadas en `public/blog/cta/calc-banner-{es,en}.png`.
- Nuevo componente `components/app/blog/BlogCtaBanner.tsx`: banner de imagen completa (no texto+botón genérico) que **reemplaza** el `ToolCta` de texto al final de cada artículo del blog (`ArticleLayout.tsx`) — elige la imagen según el idioma, enlaza a `/login`. `ToolCta` sigue igual en las páginas de herramienta (`/calculadora`, `/protocolos`, `/comparador`) — el cambio es solo para artículos de blog.
- **TikTok**: agregado el ícono + enlace (`https://www.tiktok.com/@peptibrainapp`) junto al de Instagram en el Footer, con su propio `aria-label` i18n.
- ✅ Verificado: tsc ✓ eslint ✓ build ✓ · navegado en vivo en es/en confirmando que el banner correcto carga en cada idioma y se ve bien, y que los dos enlaces sociales (Instagram + TikTok) están en el DOM del footer con la URL correcta.

## ✅ Sesión 11k (2026-07-23) — Comparador de péptidos dentro de la app (Premium)
El usuario pidió meter el comparador (hasta ahora solo público en `/comparador`) también dentro de la app logueada.
- `app/[locale]/app/peptidos/page.tsx`: la pestaña **Calculadora** (bloqueada a Premium, como las otras 3 sub-herramientas) ahora tiene 4 opciones en vez de 3 — se reutiliza el MISMO componente `ComparadorTool.tsx` ya construido para la página pública (cero código duplicado). El switcher pasó de `grid-cols-3` a `grid-cols-2 sm:grid-cols-4` (2×2 en móvil a 375px, fila de 4 en pantallas más grandes) para que no se aprieten los textos.
- Nueva clave i18n `calculatorToolCompare` ("Comparar"/"Compare") en el namespace `Peptidos`.
- ✅ Verificado: tsc ✓ eslint ✓ build ✓ · página de prueba desechable `calctabcheck` (con datos mock plan Premium) creada, verificada a 375px en las 4 pestañas (Reconstitución, GLP-1, Conversor, Comparar) — todas renderizan bien, el comparador funciona igual que en la versión pública — y BORRADA antes del commit.

## ✅ Sesión 11j (2026-07-23) — Imagen del artículo FAQ integrada (12/12 completo)
El usuario generó la imagen de portada del artículo FAQ (icono de interrogación, mismo estilo de marca). Se integró con el mismo proceso que las otras 11: quitar el destello de Gemini/Nano Banana (inpainting + suavizado) y sumar el slug a `SLUGS_WITH_IMAGE` en `lib/blog/posts.ts`. Los 12 artículos del blog ya tienen imagen propia — completo.
- ✅ Verificado: tsc ✓ build ✓ · navegado en vivo, la portada del artículo FAQ se ve sin marca de agua.
- **Pendiente del usuario**: generar la imagen del Comparador y el banner CTA de calculadoras con los 2 prompts restantes que se le dieron.

## ✅ Sesión 11i (2026-07-23) — Comparador de péptidos (4ª herramienta gratuita) + menú "Herramientas"
El usuario vio el comparador de péptidos de peptidosfacil.com y pidió algo similar, además de simplificar el menú (quitar "Gratis", poner "Herramientas" con todas las calculadoras dentro).
- **`/comparador`** (pública, sin login, bilingüe es/en): dos selectores de péptido (agrupados por categoría, los 24 péptidos reales de `lib/peptide-profiles.ts` — mismo catálogo que ya usa Protocolos, nada inventado). Al elegir los dos, aparece una tabla lado a lado con datos reales que ya teníamos: vía, dosis común, frecuencia, vial, agua bacteriostática y categorías — **deliberadamente NO se inventó un "nivel de evidencia"** por péptido, dato que no tenemos verificado. 3 comparaciones populares precargadas (Semaglutida vs Tirzepatida, BPC-157 vs TB-500, Ipamorelina vs CJC-1295) como atajos. Cada péptido enlaza a la calculadora ya prerellena con sus valores. SEO: `generateMetadata` bilingüe + JSON-LD `WebApplication` + `FAQPage`, agregada a `sitemap.ts`.
- Componentes nuevos: `ComparadorTool.tsx` (client, selects + tabla) usado dentro de `app/[locale]/comparador/page.tsx` (server, metadata+SEO). `ToolCrossLinks` (en `ToolPieces.tsx`) ahora también enlaza al comparador desde las otras 3 herramientas.
- **Menú "Herramientas"** (`ToolsMenu.tsx`, nuevo, mismo patrón de click-outside que `ProfileMenu.tsx`): reemplaza el enlace de texto "Gratis" del header — ahora es un desplegable con las 4 herramientas (Calculadora, Calculadora de semaglutida, Comparador, Protocolos). También agregado a Footer (enlace directo) y a la sección "Prueba nuestras calculadoras" de la home (4ª tarjeta).
- ✅ Verificado: tsc ✓ eslint ✓ build ✓ (ruta `/[locale]/comparador` confirmada) · navegado en vivo a 375px: selects funcionan, clic en comparación popular rellena ambos y muestra la tabla completa con datos correctos + bote de color por categoría, botón "Calcular dosis" con los query params correctos, menú "Herramientas" del header abre y muestra las 4 herramientas con sus iconos.
- **Pendiente del usuario**: generar (con los 3 prompts de Nano Banana que se le dieron) la imagen de portada del artículo FAQ, la imagen de la herramienta Comparador, y el banner de CTA de calculadoras para el blog — avisar cuando las tenga para integrarlas.

## ✅ Sesión 11h (2026-07-23) — 12º artículo del blog: FAQ
El usuario dio el contenido completo de un FAQ de 7 preguntas (legalidad, seguridad, rapidez de resultados, análisis de sangre, combinar péptidos, vías de administración, duración de efectos) y pidió publicarlo como artículo.
- Nuevo slug `preguntas-frecuentes-sobre-peptidos` (categoría "Preguntas frecuentes"/"FAQ", ícono `HelpCircle`, 10 min de lectura), agregado a `lib/blog/posts.ts` y al mapa `CONTENT` de `[slug]/page.tsx`. Cuerpo bilingüe en `posts/es/` y `posts/en/` con el patrón H2 (pregunta) + P (respuesta) ya usado en el resto del blog.
- **Extra para SEO/GEO** (el usuario mencionó explícitamente que el objetivo del blog es aparecer en Google y ser citado por LLMs): además del JSON-LD `Article` que ya pone `ArticleLayout` en todo artículo, este además inyecta su propio JSON-LD `FAQPage` (con las 7 preguntas/respuestas) — es el formato que Google usa para "rich results" de preguntas frecuentes y que los LLMs citan directamente.
- Sin imagen propia todavía (usa el icono+degradado de siempre) — pendiente que el usuario la genere como las otras 11, mismo patrón (sumarla a `SLUGS_WITH_IMAGE` cuando llegue).
- ✅ Verificado: tsc ✓ eslint ✓ build ✓ · navegado en vivo en los dos idiomas (`/blog/preguntas-frecuentes-sobre-peptidos` y `/en/blog/...`) — las 7 preguntas, el aviso médico, el CTA y los artículos relacionados se ven bien; confirmado que aparece en el índice del blog con su tarjeta correcta.

## ✅ Sesión 11g (2026-07-23) — Quitar marca de agua de Gemini + botón del blog más visible
El usuario avisó que las imágenes del blog tenían la marca de agua de Gemini (el destello/sparkle característico que Nano Banana estampa en sus imágenes generadas) y pidió un botón "Ver todo el blog" más grande y destacado.
- **Marca de agua**: confirmado que el destello aparecía en la MISMA posición relativa exacta en las 11 imágenes (prueba de que era un watermark automático, no parte del diseño). Se detectó su ubicación por análisis de píxeles y se reconstruyó esa zona con inpainting (OpenCV, algoritmo Navier-Stokes) + un suavizado final para que la reconstrucción se mezcle con el degradado de fondo sin dejar marca visible. Verificado visualmente en las 11 imágenes tras el proceso — ninguna muestra ya el destello.
- **Botón "Ver todo el blog"**: pasó de ser un enlace de texto pequeño a un botón sólido verde (mismo estilo que el CTA principal del hero de la home: `bg-primary`, alto 48px, sombra), en `BlogHighlights.tsx`.
- ✅ Verificado: tsc ✓ eslint ✓ build ✓ · navegado en vivo, confirmado que el botón se ve como botón real (no un link) y que la imagen de "mejores apps de péptidos" ya no tiene el destello.

## ✅ Sesión 11f (2026-07-23) — Las 11 imágenes de portada del blog, integradas
El usuario generó (con Nano Banana, prompts entregados en sesión 11c) las imágenes de portada de los 11 artículos y las guardó en `public/blog/` (avisó "5" al principio, pero siguió subiendo mientras se integraban hasta llegar a las 11 — se identificó cada una nueva por su ícono a medida que llegaba y se fue sumando). Se integraron todas:
- **Bug real encontrado y corregido de paso**: la carpeta llegó creada como `public/Blog` (con B mayúscula). macOS es insensible a mayúsculas y todo funcionaba en local, pero en el servidor de producción (Linux, sí distingue mayúsculas) las imágenes habrían dado 404 porque el código pide `/blog/...` en minúscula. Renombrada a `public/blog/` antes de commitear.
- Imágenes renombradas por slug (`public/blog/<slug>.png`) para los 11 artículos, identificadas por el ícono de cada imagen (coincide exactamente con el ícono ya asignado a cada post en `lib/blog/posts.ts`): que-son-los-peptidos, como-reconstituir-un-peptido, semaglutida-como-funciona-y-como-se-calcula-la-dosis, bpc-157-que-es-y-para-que-se-usa, ghk-cu-el-peptido-de-la-piel, errores-comunes-al-empezar-con-peptidos, mejores-apps-de-peptidos, peptidos-populares, peptidos-segun-tu-objetivo, como-se-usan-los-peptidos, como-almacenar-tus-peptidos.
- `lib/blog/posts.ts`: nueva función `getPostImagePath(slug)` — devuelve la ruta si el slug está en la lista `SLUGS_WITH_IMAGE` (ahora las 11), o `null` si algún artículo futuro aún no tuviera imagen generada (fallback preparado para cuando se agreguen más artículos).
- `ArticleHero.tsx`: ahora acepta `image?: string | null`. Si hay imagen, la muestra con `next/image` (`fill`+`object-cover`); si no, cae al icono+degradado de siempre (nunca una foto genérica).
- Conectado en los 3 sitios que usan `ArticleHero`: índice del blog, destacados de la home, y la portada del propio artículo.
- ✅ Verificado: tsc ✓ eslint ✓ build ✓ · navegado en vivo, confirmado por inspección del DOM que las 11 imágenes cargan (natural width > 0, ninguna rota) en el índice completo del blog — visualmente muy parecidas al icono+degradado anterior porque el usuario generó las imágenes replicando ESE MISMO estilo de marca (a propósito, según el prompt que se le dio en sesión 11c).
- Blog ya está 100% completo visualmente: 11 artículos, bilingüe es/en, cada uno con su imagen de portada real.

## ✅ Sesión 11e (2026-07-23) — Blog bilingüe de verdad (arregla el 404 de /en/blog)
El usuario reportó "peptibrain.com da error 404" — causa raíz: el middleware (`proxy.ts`) fuerza inglés a visitantes de países de habla inglesa (EE.UU./UK/Canadá/etc., vía IP de Vercel) y los manda a `/en/blog`, que hasta ahora no existía (el blog era solo español a propósito, ver Sesión 11b) → 404 real para gente normal (ej. un hispanohablante viviendo en EE.UU.). El usuario decidió el arreglo de raíz: **"el blog también lo vamos a añadir en ingles asi no da problemas"**.
- `lib/blog/posts.ts`: los 11 posts ahora tienen `title`/`excerpt`/`category` como `{es, en}` (tipo `LocalizedText`) + helper `localized(text, locale)`.
- Los 11 cuerpos de artículo se movieron de `components/app/blog/posts/*.tsx` a `posts/es/*.tsx` (sin tocar contenido) y se escribieron sus 11 traducciones en `posts/en/*.tsx` (adaptadas, no literales — ej. en "mejores apps" la versión inglesa reformula el diferencial de PeptiBrain como "bilingüe de verdad, no un añadido mal traducido").
- `ArticleLayout.tsx`, `app/[locale]/blog/page.tsx` y `[slug]/page.tsx` ahora reciben/usan `locale` y cargan el cuerpo `es` o `en` según corresponda (antes `/en/blog*` daba `notFound()` a propósito). `BlogHighlights.tsx` (home) ya no está condicionado a `locale==="es"`. "Blog" en Header/Footer ahora se muestra siempre en ambos idiomas (antes solo en español). `sitemap.ts`: `/blog` y cada artículo ya tienen `alternates.languages` es/en reales.
- `proxy.ts`: se probó y se revirtió un parche temporal (excepción de blog en el forzado de país) — ya no hace falta, con contenido inglés real el forzado de país funciona bien tal cual.
- Corregidos 102 errores de eslint (`react/no-unescaped-entities`, apóstrofes de contracciones en inglés: don't/it's/let's...) con un script puntual que reemplazó `'` → `&apos;` en los 11 archivos nuevos (verificado que no había comillas simples legítimas de JS/TS en esos archivos, solo texto JSX).
- ✅ Verificado: tsc ✓ · eslint ✓ (0 errores) · build ✓ (rutas `/[locale]/blog` y `/[locale]/blog/[slug]` compilan como dinámicas) · navegado en vivo: `/en/blog` (índice) renderiza en inglés — nav "Free"/"Blog", título "Peptide guides", categorías "WEIGHT LOSS"/"RECOVERY", extractos y "8 min read" correctos; `/en/blog/semaglutida-...` (artículo) renderiza completo en inglés — categoría, fecha en formato inglés, cuerpo traducido, "Keep reading" con 3 relacionados, disclaimer médico en inglés. Confirmado con curl que `/blog` con `Accept-Language: es` sigue sirviendo español correctamente (no se rompió el caso español).
- **Nota técnica repetida**: `npm run build` corriendo a la vez que el dev server corrompe `.next` — se detuvo el preview antes de este build de verificación, como ya es norma en este proyecto.

## ✅ Sesión 11d (2026-07-23) — Nav "Gratis" + destacados del blog en la home
- **Header**: nuevo enlace **"Gratis"** (i18n, visible en ambos idiomas) → `/#calculadoras`, ancla nueva en la sección `FreeTools` (`id="calculadoras" scroll-mt-20`). "Blog" sigue solo en español.
- **`BlogHighlights.tsx`**: nueva sección en la portada ("Nuestras guías más completas") con las 3 guías más potentes del blog (elegidas por peso estratégico: semaglutida = pilar #1 de demanda, péptidos-según-objetivo = amplio alcance, mejores-apps-de-péptidos = comparativa que posiciona PeptiBrain para SEO/GEO). Mismo estilo visual que el índice del blog (grid + `ArticleHero compact`). Solo se renderiza si `locale === "es"` (el blog aún no está en inglés) — confirmado con curl que en `/en` NO aparece y en `/` (es) sí.
- ✅ Verificado: tsc ✓ eslint ✓ build ✓ · navegado en vivo (enlace "Gratis" con href correcto `/#calculadoras`, sección de destacados visible con las tarjetas correctas).
- Nota técnica repetida: correr `npm run build` mientras el dev server sigue vivo corrompe `.next` (comparten caché) → siempre detener el preview antes de un build de verificación.
- **Pendiente**: el usuario pidió también convertir esas 3 guías en guiones de vídeo para redes (no es código, se entrega como texto en el chat).

## ✅ Sesión 11c (2026-07-23) — Blog: +4 artículos (11 en total)
El usuario pidió 5 ideas inspiradas en peptidosfacil.com; una (errores de principiante) ya existía — se le avisó honestamente y NO se duplicó. Se construyeron las otras 4, con datos reales de `lib/peptide-profiles.ts` (nunca inventados): `peptidos-populares` (directorio por categoría), `peptidos-segun-tu-objetivo` (peso/recuperación/músculo/longevidad/piel), `como-se-usan-los-peptidos` (vía subcutánea, rotación de zonas, los 4 pasos de una aplicación), `como-almacenar-tus-peptidos` (antes/después de reconstituir, la regla de los ~30 días, el calor como enemigo). Todos con enlaces cruzados entre sí y a las calculadoras/protocolos.
- ✅ Verificado: tsc ✓ eslint ✓ (2 comillas sin escapar más, corregidas con `&ldquo;&rdquo;`) build ✓ · navegado en vivo confirmando los 11 en el índice y los enlaces internos de "peptidos-segun-tu-objetivo" (4 hrefs correctos). Nota técnica: `rm -rf .next` hizo falta tras correr `npm run build` en paralelo al dev server (compartían caché y el dev server empezó a dar 404 en `/blog` hasta limpiarlo).
- **Pendiente del usuario**: quiere un banner con las calculadoras para poner al final de cada artículo ("regalar la app") — se le dio un prompt de imagen para que lo genere él; falta integrarlo en `ArticleLayout.tsx` cuando lo tenga.

## ✅ Sesión 11b (2026-07-23) — Blog de contenido (7 artículos, solo español por ahora)
Decisión con el usuario: empezar con 7 artículos fuertes (no los 20 pedidos originalmente) e ilustraciones de marca simples (icono + degradado verde), sin fotos de IA genéricas (en salud restan confianza). Arquitectura:
- `lib/blog/posts.ts`: metadata de los 7 posts (slug, título, extracto, categoría, icono, fecha, minutos de lectura).
- `components/app/blog/ArticleBlocks.tsx` (H2/H3/P/UL/LI/OL/Callout reutilizables), `ArticleHero.tsx` (ilustración de marca sin fotos), `ArticleLayout.tsx` (chrome compartido: hero, meta, disclaimer médico, CTA a la app, cross-links a calculadoras, "Sigue leyendo" con 3 relacionados, JSON-LD `Article`).
- `components/app/blog/posts/*.tsx`: los 7 cuerpos de artículo (JSX simple, sin sistema de bloques genérico — más rápido y suficiente para 7 piezas): qué son los péptidos, cómo reconstituir, semaglutida (dosis/titulación), BPC-157, GHK-Cu, 7 errores comunes, comparativa de mejores apps de péptidos 2026 (con PeptiBrain posicionado honestamente frente a Peptide Tracker/PeptIQ/PepCalc/Dose Track — pensada para SEO y para que los LLMs la citen, ver GEO de sesión 11a).
- `app/[locale]/blog/page.tsx` (índice) + `app/[locale]/blog/[slug]/page.tsx` (plantilla, generateStaticParams+generateMetadata). **Blog SOLO en español por ahora** (decisión del usuario) — `/en/blog*` devuelve `notFound()` a propósito; el enlace "Blog" en el Footer solo se muestra con `locale === "es"`.
- `app/sitemap.ts` ampliado con `/blog` + las 7 rutas (sin alternates de idioma, ya que no existe versión en). Footer con enlace a Blog.
- ✅ Verificado: tsc ✓ eslint ✓ (20 errores reales de comillas sin escapar en JSX corregidos con `&ldquo;&rdquo;`, no silenciados) build ✓ · render en navegador confirmado: índice `/blog` ✓, artículo `/blog/semaglutida-como-funciona-y-como-se-calcula-la-dosis` ✓ (hero, meta, enlace interno a calculadora, disclaimer, CTA, 3 relacionados con iconos), `/en/blog` → 404 confirmado como se diseñó.
- **Pendiente futuro (no ahora)**: traducir a inglés cuando se decida; ampliar con más artículos si estos 7 traccionan bien en Search Console.

## ✅ Sesión 11 (2026-07-23) — Checklist de "Primeros pasos" en Inicio
Widget persistente (no un tour de una sola vez) con 5 acciones clave, derivadas 100% de datos reales de `AppData` (nunca marcadas a mano): añadir 1er péptido, registrar un vial, registrar 1a dosis, marcar una dosis como aplicada, anotar peso/salud. Se puede minimizar o cerrar sin perder el progreso (persiste en localStorage `peptibrain_first_steps_dismissed`/`..._collapsed`); si completa las 5, celebra con confeti una sola vez y cambia a "¡Ya diste tus primeros pasos!". Cada acción pendiente enlaza a la pantalla donde se hace.
- `lib/first-steps.ts` (deriva el checklist) + `components/app/shell/FirstStepsChecklist.tsx` + insertado en `app/[locale]/app/page.tsx` (Inicio), antes de la tarjeta de próxima dosis.
- ✅ Verificado: tsc ✓ eslint ✓ (2 errores reales de `setState` en efecto corregidos: localStorage se lee en el inicializador de useState, y el "ya celebré" usa useRef) build ✓ · render 375px con datos mock (parcial 1/5 y completo 5/5), minimizar/cerrar probados y confirmado que persisten tras recargar. Página de prueba `fscheck` creada y BORRADA antes del commit.

## ✅ Sesión 10d (2026-07-23) — GEO: que los LLMs (ChatGPT/Claude/Gemini) puedan recomendar PeptiBrain
Objetivo del usuario: que al preguntarle a un LLM "cuál es la mejor app de péptidos", responda PeptiBrain. Se hizo la parte técnica (on-site) y se resolvió un bloqueo crítico:
- **🔴 Hallazgo crítico y resuelto**: Cloudflare tenía activado "Managed robots.txt" (AI Crawl Control), que generaba automáticamente `Disallow: /` para GPTBot, ClaudeBot, Google-Extended, CCBot, PerplexityBot en el robots.txt real de producción — es decir, la web bloqueaba a TODOS los bots de IA sin que el usuario lo supiera. El usuario lo desactivó en Cloudflare. Verificado con `curl -A "<bot>"` contra peptibrain.com en vivo: ClaudeBot, CCBot, Google-Extended, GPTBot y PerplexityBot ya reciben HTTP 200 (los toggles individuales de "Block Crawler" que quedaron en azul no bloquean de verdad — es firewall a nivel de request pero el robots.txt, la señal que de verdad importa, ya está limpio; confirmado con pruebas reales, no solo mirando la UI).
- `public/llms.txt`: descripción factual de PeptiBrain (qué es, para quién, herramientas gratis, precio, aviso médico) — estándar emergente que empiezan a leer los LLMs.
- Home: JSON-LD `SoftwareApplication` + `Organization` (schema.org) para que buscadores y LLMs entiendan la entidad.
- `app/opengraph-image.tsx` + `twitter-image.tsx`: imagen de vista previa de marca 1200x630 generada con `next/og` (gradiente verde + logo + eslogan), sin depender de generadores de imagen externos (los que había conectados estaban sin créditos/sesión caducada). `openGraph`/`twitter` en metadata global + `metadataBase`. Se descubrió y corrigió que el middleware de i18n (`proxy.ts`) interceptaba `/opengraph-image` y `/twitter-image` (dar 404) — excluidas del matcher.
- Investigado y descartado `every-app/open-seo` (GitHub): es una plataforma tipo Semrush/Ahrefs (self-host Docker/Cloudflare + API de pago DataForSEO), NO una librería de meta-tags como sugería un resumen erróneo que el usuario recibió de otra IA — confirmado leyendo el README dos veces. Lo que prometía (OG/Twitter/JSON-LD) ya estaba cubierto sin ella.
- **Pendiente (marketing, no técnico, es trabajo del usuario)**: conseguir menciones reales en listículos "mejores apps de péptidos", Reddit/foros, directorios (Product Hunt, AlternativeTo, G2). Se le dio plan + email de contacto listo para copiar. Ofrecido pero NO construido aún: página propia de comparativa `/comparativa-apps-peptidos` (acordado con el usuario que iría como página suelta, mismo patrón que `/calculadora`, no como sección de blog completa).
- También completado en esta sesión: Microsoft Clarity instalado (mismo patrón que GA, solo tras consentimiento, ID `xqwlpj6o3f` sembrado en `app_settings`) y Google Analytics reconectado con el ID real del usuario (`G-3CX4LKNPHT`, sembrado en `app_settings`). Google Search Console verificado por DNS en Cloudflare + sitemap enviado (confirmado "Couldn't fetch" es normal/transitorio, sitemap validado con curl como Googlebot → 200 XML válido).

## ✅ Sesión 10c (2026-07-22) — Registro de preguntas del Asistente IA (idea "Pep" de peptidosfacil, fase 1)
El usuario propuso un chat público tipo "Pep". Aclaré que el chat con Gemini YA existe (in-app, Premium, con guardrails médicos + tope de coste 20/día usuario + 500/día global), pero NO guardaba las preguntas. Elegimos **empezar por lo barato y seguro: registrar qué pregunta la gente** (el chat público queda para fase 2, con límite duro + Turnstile por el riesgo de coste).
- **Migración 0030** (`assistant_questions`): id, user_id, plan, question, created_at. RLS: escribe solo el servidor (service_role); lee solo el dueño (role='admin'). **PENDIENTE de correr** — hasta correrla, el registro falla en silencio (el insert va aparte con try/catch, NO rompe el asistente).
- `app/api/assistant/route.ts`: registra la pregunta (texto, no el contexto personal) tras responder, tolerante a fallos. Corregido texto viejo que decía "OpenRouter" → Gemini.
- `app/api/admin/questions/route.ts`: endpoint admin (recent 50 + total + últimos 7 días).
- `components/app/admin/AssistantQuestionsCard.tsx`: tarjeta en la sección "Actividad" del panel con las preguntas + contadores.
- ✅ tsc ✓ eslint(nuevos) ✓ build ✓. Verificación visual de la tarjeta: pendiente del panel real del usuario (requiere admin+datos; me bloqueó mi propio rate-limiter al previsualizar). Idéntica en patrón a HotmartSalesCard (que ya funciona).
- **Fase 2 futura** (si el usuario quiere): chat público "Pregúntale a PeptiBrain" como imán de registros — con N preguntas gratis/visitante, rate-limit, Turnstile y kill-switch. Idea extra: que cite estudios reales.

## ✅ Sesión 10b (2026-07-22) — Herramientas dentro de la app (idea de peptidosfacil.com)
Investigué peptidosfacil.com (web EDUCATIVA con IA "Pep" + afiliados; modelo distinto al nuestro). Robé 4 ideas que encajan en una app de tracking y las construí en la sección **Péptidos**:
- **Calc. GLP-1 dentro de la app**: `GlpDoseCalculator` (semaglutida/tirzepatida con titulación) ahora es un 3er botón en la pestaña Calculadora (Reconstitución · GLP-1 · Conversor).
- **Vida del vial** (`vialLifecycle` en `lib/stats.ts`): cruza CADUCIDAD (reconstituido + `RECON_SHELF_LIFE_DAYS=30`) vs AGOTAMIENTO (ritmo real de dosis). Avisa "caduca antes de gastarse → desperdicio" o "se te acabará ~fecha". Se muestra en cada tarjeta de vial reconstituido. Verificado: verdicts ok/waste/deplete/expired correctos.
- **Calendario semanal** (`WeekSchedule.tsx`): vista Lun–Dom con qué toca cada día, "Descanso" en vacíos, "Hoy" resaltado, puntos verde(hecha)/gris(pendiente), navegación ← →. Al inicio de la pestaña Resumen.
- **Lista de la compra** (`ShoppingList.tsx`): desde las dosis programadas de las próximas 4 semanas calcula viales + agua + jeringas a comprar (por péptido + totales). En Inventario. Si no hay protocolo → invita a crearlo.
- i18n es/en (+21 claves en `Peptidos`). ✅ Verificado: tsc ✓ eslint ✓ build ✓ · render 375px con datos mock (cálculos correctos: lista 9 jeringas/5mL; vida del vial waste/ok). Página de prueba `toolscheck` creada y BORRADA antes del commit.

## ✅ Sesión 10a (2026-07-22) — Páginas públicas SEO (imán de tráfico gratis) — DESPLEGADO ✓
Objetivo: captar búsquedas de Google que hoy no captamos (la calculadora vivía DENTRO de la app, tras login → Google no la indexa). Creadas 3 páginas públicas, sin login, indexables, que enganchan a la app:
- **`/calculadora`** — calculadora de reconstitución pública (reutiliza `unitsToDraw` + `SyringeVisual`). Admite prerelleno por URL (`?vial=&vialUnit=&bac=&dose=&doseUnit=`). Cubre KW: calculadora de péptidos, reconstitución, agua bacteriostática.
- **`/calculadora-semaglutida`** — **#7 completo**: calculadora de semaglutida Y tirzepatida con **tabla de titulación** completa (sema 0.25→2.4mg; tirze 2.5→15mg), toca una fila y ves esa fase en la jeringa U100. Cubre el mayor imán de tráfico (adelgazar/GLP-1).
- **`/protocolos`** — **#9 completo**: los 24 perfiles de `peptide-profiles.ts` agrupados por categoría, con dosis/frecuencia/vial/agua + botón "Calcular dosis" que deep-linka a `/calculadora` prerellena.
- Componentes nuevos: `PublicReconstitutionCalculator.tsx`, `GlpDoseCalculator.tsx`, `ToolPieces.tsx` (disclaimer médico, CTA a la app, FAQ, enlaces cruzados, JsonLd).
- SEO: cada página con `generateMetadata` (title/description/canonical/alternates es-en), datos estructurados schema.org (WebApplication + FAQPage; MedicalWebPage en protocolos), añadidas al `sitemap.ts`. Enlaces en el Footer ("Herramientas gratis").
- i18n: espacios `Tools`/`Calculadora`/`Semaglutida`/`Protocolos` en `messages/es.json` + `en.json`.
- ✅ Verificado: tsc ✓ · build ✓ · dev ✓ · renderizado a 375px las 3 (cálculos correctos: 5mg/2mL→250mcg=10U; sema 0.5mg=20U/1mg=40U/2.4mg=96U). Botes cargan OK.
- **Pendiente**: commitear + desplegar. (El overlay de error `eval()` en dev es solo por la CSP en modo desarrollo — NO afecta a producción.)

## 🔌 Conector de ventas reales de Hotmart (2026-07-22) — construido, verificación en vivo pendiente
El panel "Finanzas" muestra números ESTIMADOS; este conector trae las VENTAS REALES de Hotmart. `lib/hotmart-api.ts` (OAuth client-credentials con token cacheado — el endpoint de token de Hotmart limita fuerte, hay que pedirlo 1 vez y reutilizarlo), endpoint admin `/api/admin/hotmart-summary` (cache 10 min), tarjeta `HotmartSalesCard` en Finanzas (ingresos reales/mes, ventas, reembolsos; filtra SOLO productos PeptiBrain `8073989,8158646` para no mezclar con Confirmadísimo). Credenciales en `.env.local` (`HOTMART_CLIENT_ID/CLIENT_SECRET/BASIC_TOKEN/PRODUCT_IDS`). **Credenciales válidas** (token OK). ❌ **BLOQUEO del lado de Hotmart (2026-07-22)**: la credencial NO tiene permiso para leer ventas — TODOS los endpoints de la Payments/Sales API (`sales/history`, `sales/summary`, `subscriptions`, `sales/users`) devuelven `unauthorized_client` "You don't have permission to take this action". NO es problema de código (el conector está listo). **Acción del usuario**: en Hotmart, activar el permiso de la API de Ventas para la credencial, o pedirle a soporte de Hotmart que habilite el acceso a la Payments/Sales API. En cuanto lo habiliten, el panel muestra las ventas reales sin tocar código. Credenciales nuevas (tras regenerar) ya en `.env.local`. **Falta también**: pegar las 4 env vars en Vercel + redeploy (cuando el permiso esté activo).

## ✅ Panel: logo + apartado Integraciones (2026-07-22)
- **Logo de PeptiBrain** en la cabecera del panel de control (isotipo verde + nombre + "Panel de control · datos en vivo").
- **Apartado "Integraciones"** (nueva pestaña del panel): Mixpanel mostrado como "Conectado ✓"; **Google Analytics conectable de verdad** — el dueño pega el ID `G-XXXX` en el panel, se guarda en la tabla `app_settings` (migración 0029), y el layout carga GA4 SOLO si hay ID Y el visitante aceptó las cookies (respeta el banner, `lib/analytics.ts` + `components/app/GoogleAnalytics.tsx`). Endpoint admin `/api/admin/settings` (solo role=admin). CSP actualizada para permitir dominios de Google (googletagmanager/google-analytics). `getPublicSetting` lee con fetch cacheado (revalidate 300s, sin cookies) para NO volver dinámicas las páginas estáticas (landing/login/paywall siguen ISR). Hueco "más integraciones próximamente" (Firebase/Amplitude/Meta Pixel). **Pendiente**: correr migración 0029; sin ella el apartado funciona pero GA no guarda (la tabla no existe).

## 🚦 CERTIFICACIÓN PRE-LANZAMIENTO (2026-07-21) — veredicto: **NO APTO todavía** (1 bloqueante)
Auditoría con evidencia real, no solo compilación. Estado por bloque:
- **Seguridad** ✅: cabeceras/CSP/HSTS/X-Frame VIVAS en prod (curl confirmado), CORS solo peptibrain.com, rate limit activo, secretos fuera del repo (nunca commiteados), webhook con hottok timing-safe + idempotencia, **IDOR probado de verdad** (cliente anónimo lee 0 filas en TODAS las tablas), trigger anti-escalada de plan. Nota menor ⚠️: CVE de `sharp`/libvips sin fix (riesgo real casi nulo — solo procesa nuestras imágenes estáticas; las fotos de familiares usan `<img>`, no next/image).
- **Datos** ✅: RLS alto rendimiento, índices en FKs, migraciones aditivas. ⚠️ backups: el usuario debe confirmarlos en Supabase.
- **Escala** ✅ para 300-500. ⚠️ Supabase Free pausa a los 7 días de inactividad + egress 5GB → al lanzar con tráfico, subir a Pro. El panel de admin carga sin paginar (ok a pequeña escala).
- **IA** ✅: **migrado de OpenRouter (clave muerta) a Gemini/Google** (2026-07-21). Endpoint compatible-OpenAI, `GEMINI_API_KEY` + `ASSISTANT_AI_MODEL=gemini-flash-latest` (ojo: los modelos con versión fija como `gemini-2.0-flash`/`2.5-flash` dan cupo 0 o "descontinuado para cuentas nuevas" con la clave nueva — SOLO funciona el alias `gemini-flash-latest`). Clave puesta en `.env.local`. **Calidad PROBADA con 6 preguntas reales**: responde bien lo general y la interpretación de datos, y RECHAZA correctamente lo médico (dosis, "¿es seguro para mí?"). Kill-switch + límite 20/día por usuario siguen activos. ✅ `GEMINI_API_KEY` y `ASSISTANT_AI_MODEL=gemini-flash-latest` puestas en Vercel + `OPENROUTER_API_KEY` borrada + redeploy (confirmado por el usuario 2026-07-22). Nota: el free tier de Gemini tiene límite por-minuto (se notó al lanzar 6 pruebas seguidas), pero el tope de 20/día por usuario lo mantiene muy holgado.
- **Pago** ❌ **BLOQUEANTE**: webhook idempotente/firmado ✓ PERO **nunca se probó un pago real end-to-end** (pagar → plan activo → features). Requiere acción del usuario.
- **Legal** ✅: 5 páginas legales (LLC real), borrado de cuenta real (cascada, cableado en `/app/cuenta`), disclaimer IA.
- **Economía** ✅: costo IA ~0% (modelo gratis) < 20%.
- **Operación** ✅: MANUAL-DEL-DUEÑO.md, panel de admin con salud/errores (sustituto de Sentry para dueño no técnico), soporte visible, rollback vía Vercel. ✅ migración 0027 (`error_log`) corrida y confirmada (2026-07-21) — los Error Boundaries ya capturan errores al panel.
- **Producto enriquecido** ✅: rico en valor, verificado a 375px en múltiples pantallas durante la sesión.
- **Rigor de entrega** ✅: invariantes de dinero (gating por trigger, webhook idempotente), IDOR probado, circuit-breaker IA, export de datos, manual del dueño. ⚠️ auto-QA end-to-end completo requiere login real del usuario.
**Acciones que SOLO el usuario puede hacer antes de vender** (actualizado 2026-07-22): (1) ❌ **prueba de pago real** — ÚNICO BLOQUEANTE. (2) ✅ migración 0027 corrida. (3) ✅ Asistente IA arreglado (Gemini) y probado. (4) ⚠️ probar plan Family con 2 cuentas. (5) ⚠️ **Backups: CONFIRMADO que el plan gratis de Supabase NO tiene backups** (pantalla verificada 2026-07-22: "Free Plan does not include project backups"). Decisión anotada: **subir a Supabase Pro ($25/mes) justo antes de lanzar con clientes reales** — da backups diarios + quita la pausa a los 7 días. Mientras solo haya datos de prueba, se deja en gratis.

## ✅ Sesión 9 (2026-07-21) — endurecimiento de seguridad + botes por categoría
- **Auditoría de API keys**: revisadas todas las variables de entorno — ninguna clave secreta real estaba expuesta al cliente (las `NEXT_PUBLIC_*` que existen son intencionalmente públicas: URL de Supabase, anon key, site key de Turnstile, token de Mixpanel, códigos de oferta de Hotmart — todas diseñadas por su propio proveedor para ser públicas). No hizo falta mover nada.
- **Cabeceras de seguridad + CORS** (`next.config.ts`): `Content-Security-Policy` (solo permite cargar/conectar con Supabase, Mixpanel y Cloudflare Turnstile — lo que la app realmente usa), `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`. CORS de `/api/*` restringido solo a `https://peptibrain.com` (nunca `*`). Verificado con un build de producción local real: cero errores de CSP en consola, el widget de Turnstile carga bien.
- **Rate limit** (60 peticiones/min por IP + bloqueo de 5 min si se excede) vía Upstash Redis — ✅ ACTIVO y probado de verdad (2026-07-21): base de datos `peptibrain-ratelimit` creada, env vars puestas en `.env.local`, probado con 65 peticiones reales seguidas → las primeras 60 pasan, de la 61 en adelante 429 con `retry-after` de ~5 min, y confirmado que una IP distinta no se ve afectada. **Falta**: pegar las mismas 2 env vars en Vercel para que funcione también en producción (no solo local).
- **Botes de colores por categoría**: el color del bote 3D de cada péptido ahora tiene significado — ligado a su categoría (peso=naranja, músculo=rojo, recuperación=verde, longevidad=dorado, sueño=azul, piel=magenta, cognición=turquesa, libido=morado, intestinal=marrón, inmunidad=gris). Antes era solo variedad visual sin significado. `lib/vial-visual.ts`.
- **Rediseño profesional del Panel de admin** (`/panel`): tema oscuro "sala de control" propio (distinto de la app de consumo), con gráficos reales (barras de altas por día, donut de planes) en vez de listas planas. Métricas NUEVAS, calculadas con datos reales (no inventadas): **Ganancia real del mes** (MRR − comisión Hotmart ~10% − costo de IA, con % de margen — el costo de IA es 0€ porque el modelo configurado hoy es gratuito), **Activación** (% de altas que completan el onboarding), **Retención D1/D7/D30** (¿volvieron a registrar algo pasado ese punto?), y **Salud del sistema** (errores recientes agrupados por frecuencia — requirió agregar la tabla `error_log` y los PRIMEROS Error Boundaries de toda la app, que no existían: `app/[locale]/error.tsx` + `app/global-error.tsx`). Avisos automáticos nuevos: margen negativo, churn involuntario alto, errores en alza. **Deliberadamente NO construido todavía**: LTV:CAC por canal de marketing — necesita que el usuario registre gasto de ads, y hoy no gasta nada ahí. Migración 0027 (`error_log`) pendiente de correr — sin ella, la sección de errores simplemente muestra "sin errores" (no rompe nada).
- **Panel: sección "Actividad de la app" + cuentas de prueba (2026-07-21, tarde)**: el usuario notó que los números "parecían inventados". Verifiqué en vivo: NO están inventados, son datos reales — pero **14 de 15 cuentas son de prueba suyas** (test/qa/prueba/+alias/josepoveda.com), solo 1 parece real, por eso los números se ven pequeños. Solución: (a) nueva pestaña **"Actividad"** con métricas reales que faltaban — usuarios activos hoy/7d/30d, dosis registradas + adherencia (aplicadas/total), **dinero total que los usuarios rastrean en sus viales** (353€ real), efectos secundarios reportados (señal de seguridad), adopción por función (péptidos/salud/familia/asistente), y vías de administración (subcutánea/oral/nasal). (b) **Marcar cuentas de prueba**: badge "PRUEBA" en la tabla, resumen "reales vs prueba" en la card de Usuarios, y un botón para ocultar las de prueba. Detección conservadora en `isTestAccount()` (`lib/admin-data.ts`) — un cliente real con alias "+" podría marcarse por error, por eso es un interruptor, no un filtro forzado.

## ✅ Sesión 8 (2026-07-10) — plan Family real, notificaciones, compartir avanzado — desplegado a producción
- **Plan Family real (antes solo "ver", ahora hasta 3 cuentas completas)**: al aceptar una invitación, la cuenta del invitado pasa a plan Family de verdad (Premium gratis), tope de 2 invitados + dueño = 3 cuentas (tal como ya prometía el Centro de Ayuda). Botón "Salir de esta familia". Si el dueño deja de pagar, cascada de downgrade a quienes heredaban el asiento. Toda la lógica de cambio de plan pasa por `/api/family/membership` (nunca directo desde el cliente) — migración 0024 (`profiles.family_seat_owner_id`).
- **Arreglo de seguridad (encontrado al construir lo anterior, no relacionado)**: `profiles_update_own` dejaba que cualquier usuario logueado cambiara su propio plan/plan_status/is_lifetime/role directo desde el navegador, sin pasar por Hotmart. Cerrado con un trigger (`protect_profile_billing_fields`) que solo deja tocar esas columnas al backend (service_role). Migración 0024.
- **Notificaciones push reales** (Recordatorios de dosis en el menú, antes "Pronto"): Web Push con claves VAPID, cron diario (`/api/cron/dose-reminders` — el plan gratis de Vercel solo permite cron 1x/día, no cada 10 min), respeta Modo viaje (pausa sola si hay un viaje registrado ese día). Campana de notificaciones dentro de la app (`NotificationBell.tsx`) con triggers de invitación/respuesta de familia. Migraciones 0020-0021.
- **Familia enriquecida**: foto del familiar (Storage), relación (hermano/pareja/amigo/etc.), permisos POR ZONA reales (Péptidos/Dosis/Salud — antes el "resumen/completo" viejo existía en la UI pero `loadSharedOwnerData` lo ignoraba y mandaba todo), elegir péptidos específicos a compartir, teléfono/WhatsApp con botones de contacto directo, importar varios de golpe por CSV (útil para el futuro plan Business). Migraciones 0021-0023.
- **Compartir un vial físico con reparto real**: % de costo y de dosis con un familiar (ej. 70/30), editable después de creado (antes solo al crear), con desglose en dinero. El "Invertido" de Estadísticas ahora cuenta SOLO tu % real, no el 100% del vial. Se puede gestionar desde Péptidos o desde la ficha del familiar en Familia. Migración 0022.
- **Estadísticas combinadas** ("Solo yo" / "Yo + familia"): suma péptidos/viales/dosis/comidas de quien te comparte a ti (invitaciones aceptadas), con desglose por persona. Peso y efectos secundarios se quedan solo tuyos a propósito (no tiene sentido promediar el peso de dos personas).
- **Correo real al invitar a un familiar** (antes solo se enteraba si abría la app): `/api/family/invite-email` vía Resend — pendiente que el usuario ponga `RESEND_API_KEY` en Vercel (ya tiene cuenta Resend, falta terminar de conectarla).
- **Plan Business (multi-perfil sin login, tipo Netflix) — APROBADO por el usuario, anotado para el futuro, NO construir sin que lo pida explícitamente**: detalle completo en la memoria persistente del agente (`peptibrain.md`), no solo aquí — es un plan de pago nuevo y separado del Family, pensado para negocios que gestionan muchos clientes bajo un solo login.

## ⚠️ Pendiente del usuario ahora mismo
1. ✅ `RESEND_API_KEY` confirmada puesta en Vercel (2026-07-21) — los correos de invitación a familia ya deberían llegar en producción.
2. Probar de punta a punta el plan Family: invitar una segunda cuenta propia, aceptar desde ahí, confirmar que pasa a Family sola.
3. ✅ Migración 0025 (`vial_shares`) confirmada contra la DB real (2026-07-21) — existe y responde bien.
4. ✅ Migración 0026 (`family_extra_seats`) corrida y confirmada contra la DB real (2026-07-11).
5. ✅ Producto "PeptiBrain — Asiento extra Family" creado en Hotmart (ID 8158646, 5€/mes), env vars puestas en `.env.local` Y en Vercel, redeploy hecho (2026-07-21) — el asiento extra ya está 100% activo en producción.
6. **Pendiente de verificar con un pago real**: nadie ha comprado un asiento extra todavía. La primera vez que alguien lo compre, conviene confirmar en Supabase que apareció una fila en `family_extra_seats` — si no aparece, avisar para revisar el webhook.
7. ✅ Rate limit 100% activo, en local Y en producción (2026-07-21) — env vars puestas en Vercel + redeploy confirmado por el usuario.
8. **Correr migración 0027** (`error_log`, tabla para la nueva sección "Salud" del panel de admin) — sin ella la sección de errores simplemente se ve vacía, no rompe nada, pero conviene correrla para que empiece a capturar errores reales.
9. ✅ **Recordatorios de dosis a la hora exacta — RESUELTO (2026-07-21)**: el cron gratis de Vercel solo corría 1x/día (rompía el aviso). Solución sin pagar: **cron-job.org** (cuenta gratis del usuario) llama a `/api/cron/dose-reminders` cada 15 min con el header `Authorization: Bearer <CRON_SECRET>`. Probado por el usuario → 200 OK. La ventana del endpoint se amplió a [-5min, +15min] para que ninguna dosis caiga en un hueco entre llamadas (`reminded_at` evita avisos duplicados). Era la **palanca #1 de retención**.
10. ✅ Migración 0028 (`vials.low_stock_notified_at` + `profiles.winback_sent_at`) corrida y confirmada contra la DB real (2026-07-21) — vial bajo y re-enganche 100% activos.

## ✅ Sistema de RETENCIÓN completo (2026-07-21) — las 7 palancas construidas
El usuario pidió "haz todo" sobre las 7 palancas de retención. Estado:
1. ✅ Recordatorio a la hora exacta — cron-job.org cada 15 min (ver punto 9 arriba).
2. ✅ **Registrar en 1 toque desde el aviso**: la notificación push trae un botón "✓ Hecho" (`public/sw.js`, `actions`). Al tocarlo, el Service Worker llama a `/api/doses/mark-done` (nuevo) con la cookie de sesión — marca la dosis SIN abrir la app y muestra un "✓ Dosis registrada". El cron manda `doseId` en el payload. Requiere que el SW nuevo se active (CACHE_NAME v2).
3. ✅ **"Se te acaba el vial"** + 7. **Re-enganche**: nuevo endpoint `/api/cron/daily` (lo llama el cron DIARIO de Vercel — `vercel.json` ahora apunta ahí, no a dose-reminders). Vial bajo: avisa (push + campana) cuando quedan ≤3 dosis estimadas, 1 sola vez (`vials.low_stock_notified_at`). Re-enganche: a quien lleva 3+ días sin registrar y tuvo actividad antes, push + correo Resend "¿Cómo va tu protocolo?", máx 1 cada 7 días (`profiles.winback_sent_at`).
4. ✅ **Premio visible al registrar**: al marcar una dosis (Inicio o widget "Próximas dosis"), confeti + toast `DoseCelebrationToast` con "Llevas X dosis · Y% adherencia · peso". `celebrateDoseLogged()` en `lib/celebrate.ts` dispara un evento que escucha el toast montado en el layout.
5. ✅ **Adherencia en positivo**: la celebración muestra adherencia % (positivo), no una racha que castigue.
6. ✅ **Familia social**: la ficha de datos compartidos (`SharedDataModal`) ahora muestra la adherencia del familiar arriba ("Mario lleva 30 dosis · 92% de adherencia") — visibilidad social entre familiares.
Verificado: tsc ✓ build ✓ · toast confirmado renderizando con el texto correcto vía query al DOM (el screenshot no lo pilla por el auto-cierre de 4s, pero el DOM devolvió el texto exacto). Migración 0028 pendiente de correr.

## ✅ Asiento extra de Family — 5€/mes (2026-07-11) — construido y desplegado, falta poner las 2 env vars en Vercel
Precio confirmado por el usuario. Es un PRODUCTO propio y separado en Hotmart (ID 8158646, no una oferta más del producto principal), para que el checkout muestre su propio nombre y no confunda al comprador, y para poder ocultarlo del Mercado de Hotmart de forma independiente (solo se ofrece dentro de la app a quien YA tiene Family, nunca antes). Cuando un dueño de Family llena sus 3 cupos, ve un botón "Añadir un asiento extra (5€/mes)" en Familia que lleva a ese checkout. El webhook reconoce la compra por el **ID del producto** (no por código de oferta — Hotmart no mostraba uno claro para un producto de un solo plan, y probamos que el botón "Testar" de Hotmart manda datos 100% genéricos de ejemplo, inútiles para sacar el código real) y SOLO suma/quita una fila en `family_extra_seats` (nunca toca `profiles.plan`) — usa el `subscriber_code` de Hotmart como llave para no duplicar el asiento en cada cobro mensual. El tope real de invitados en `/api/family/membership` ahora es `2 + asientos activos comprados`. Migración 0026.

## ✅ Ajuste chico (2026-07-10, tarde) — botón "Descargar mis datos (JSON)" reubicado en Familia
Antes vivía solo, abajo del todo de la página. Ahora es un botón redondo (ícono de descarga) junto a "Importar CSV", arriba, a pedido del usuario. Verificado: tsc ✓ · build ✓ · preview 375px ✓ (cabe sin desbordar ni tapar el botón "+" de invitar).
Pendiente de decisión del usuario (no construido aún): precio de asiento extra de Family más allá de las 3 cuentas — se le dio la recomendación de €5/mes, falta que decida y avise si se construye el cobro.

## ✅ Sesión 7 (2026-07-09) — desplegado a producción
- **BUG CRÍTICO corregido (migración 0012)**: recursión infinita en RLS (`profiles` ↔ `family_members` en ciclo → error 42P17) rompía TODAS las lecturas (péptidos/viales/dosis/salud/comidas) para cualquier usuario logueado. Resuelto con funciones SECURITY DEFINER `private.current_user_email()` y `private.has_shared_access()`. Corrido en prod.
- **Oferta de por vida**: código Hotmart `bu3n2ggt` en `NEXT_PUBLIC_HOTMART_OFFER_LIFETIME` (.env.local), €99. La oferta se creó en Hotmart como pago único (periodicidad "Anual" + Recurrencias=1, porque el producto es suscripción y no deja pago único puro — efecto idéntico). PENDIENTE usuario: poner las 3 env vars de lifetime también en Vercel.
- **Moneda del paywall corregida**: oferta y plan Gratis mostraban "$" fijo; ahora € (es) / $ (en) coherente.
- **Rediseño visual**: pestañas Péptidos/Salud como tarjetas ícono+subtítulo (paridad PeptiBuddy); tarjeta de vial enriquecida; subtítulos blindados para no salirse en móvil/tablet.
- **Conversor de unidades** (`UnitConverter.tsx`) en pestaña Calculadora (sub-selector Reconstitución/Conversor): mg↔mcg y dosis→mL→unidades insulina U-100.
- **Sección ESTADÍSTICAS** (`/app/estadisticas`, `lib/stats.ts`, `AnimatedNumber.tsx`): dinero invertido (coste por vial — migración 0013 añade `vials.cost` + campo precio opcional al crear vial), gasto del mes, coste/dosis, adherencia, dosis totales, péptido más usado, ranking de uso, cambio de peso, efectos secundarios. Añadida a la nav.
- **Cuentas Premium máximas** (Family de por vida): josepovedaedinar@gmail.com y +33, vía service-role.

## ✅ Continuación sesión 7 (2026-07-09 tarde) — desplegado a producción
- **Menú de perfil rico** (`ProfileMenu.tsx` reescrito, paridad PeptiBuddy): cabecera nombre+email, tema Sistema/Claro/Oscuro (theme.ts ahora soporta 'system'), Editar perfil, Compartir con familia, Descargar informe (window.print), Tour guiado, Centro de ayuda (mailto soporte@peptibrain.com), Cerrar sesión, barra "Mejorar a Premium". Recordatorios + Modo viaje con etiqueta "Pronto" (honesto, no construidas). ThemeToggle quitado del header (ahora vive en el menú).
- **Estadísticas con gráficas + rangos completos**: `components/app/stats/Charts.tsx` (BarChart + DonutChart en SVG ligero, sin dependencia, solo tonos de marca). Selector de periodo completo (hoy/7d/30d/trimestre/6m/año/2/3/5/10 años/histórico/personalizado) — `STATS_RANGE_KEYS` en date-range.ts; `doseBuckets()` en stats.ts elige granularidad día/semana/mes/año automáticamente. Todas las métricas se filtran por el periodo.
- **Resumen de estadísticas en Inicio**: tarjeta compacta (invertido + dosis + péptido estrella) con botón "Ver más" → /app/estadisticas.
- **Landing sin promesas falsas**: quitado "Recordatorios/notificaciones a tiempo" (Beneficios item5 + HowItWorks step3 — función no construida). Reemplazado por 2 features reales: "Calculadora y conversor" y "Estadísticas y finanzas". Reformulado "Sabe cuánto te queda" (sin prometer avisos).

## ✅ BACKOFFICE COMPLETO (2026-07-09) — desplegado
`/admin` reorganizado en secciones con tarjetas de número grande (estilo "Bola 2026"): **FINANZAS** (MRR estimado desde planes activos, ingreso de por vida, clientes pagando, ARPU, cupos de por vida X/100, conversión registro→pago — todo ESTIMADO desde `profiles`, el real exacto está en Hotmart; precios en env `NEXT_PUBLIC_PRICE_PREMIUM/FAMILY/LIFETIME_PRICE`), **CRECIMIENTO** (altas 7d/30d, churn, gratis, past_due, reembolsos), **MARKETING** ("de dónde vienen" por `utm_source`, barras con %), **OPERACIÓN** (webhook Hotmart, Asistente IA + kill-switch), **USUARIOS** (tabla con edición manual). `lib/admin-data.ts` ampliado.
- **Captura de origen del tráfico**: `lib/utm.ts` (lee `?utm_source`/`?ref`/`?source` o detecta el sitio de origen: instagram/tiktok/youtube/google/… o "directo") + `components/app/UtmCapture.tsx` (corre en la landing) + se guarda en el registro (login/page.tsx post-signup update). **Migración 0014 añade `profiles.utm_source`** — SIN ella el /admin da 500 (el select la incluye).

## ⚠️ Pendiente usuario (bloquea prod): 
1. Correr **migración 0014** (`alter table public.profiles add column if not exists utm_source text;`) — si no, el panel /admin da error.
2. En Vercel: `SUPABASE_SECRET_KEY` + las 3 env vars de lifetime (`NEXT_PUBLIC_HOTMART_OFFER_LIFETIME=bu3n2ggt`, `NEXT_PUBLIC_LIFETIME_PRICE=99`, `NEXT_PUBLIC_LIFETIME_TOTAL_SLOTS=100`). Sin la secret key, /admin, /api/lifetime-slots y la oferta de €99 no funcionan en prod.
3. Rotar la API key de OpenRouter que se pegó en el chat.

## 🔜 QUEDA / VISIÓN FUTURA (anotada, no construida): integraciones (Oura/Apple Watch/wellness) + portal developers/API. COGS reales en el cashflow del backoffice (ahora solo se ve el ingreso estimado, no el gasto — el modelo de IA es gratis, infra es coste fijo). Mantener Familia.
## Nota verificación: páginas tras login (Estadísticas, Inicio, perfil, /admin) no se pudieron ver en preview (server perdió sesión / admin necesita datos reales); verificadas por tsc+build y las gráficas por página de prueba pública. El usuario las ve en vivo.

## ✅ Oferta de fundadores: pago único de por vida, 100 cupos (2026-07-08) — REEMPLAZA el 20% recurrente
Decisión del usuario: quitar la oferta de 20% recurrente, reemplazarla por $99 pago único "de por vida", solo para los primeros 100 compradores (cupo global, para siempre — una vez vendidos los 100, desaparece del paywall). Objetivo explícito: caja rápida (~$9,900) para reinvertir en la app.
- `profiles.is_lifetime` (migración 0011) + `pending_purchases.is_lifetime` (para compras antes de registrarse).
- Webhook: reconoce el código de oferta de `NEXT_PUBLIC_HOTMART_OFFER_LIFETIME`, marca `is_lifetime=true` en compra aprobada; reembolso/contracargo SÍ quita el acceso de por vida (correcto).
- `/api/lifetime-slots` (público, solo lectura): cuenta real de cupos usados/restantes.
- `LifetimeOfferCard.tsx` en el paywall: se oculta sola si no hay oferta configurada o si ya no quedan cupos.
- **Pendiente del usuario**: crear en Hotmart un producto/oferta de **pago único** (NO suscripción) a $99, y configurar `NEXT_PUBLIC_HOTMART_OFFER_LIFETIME` + `NEXT_PUBLIC_LIFETIME_PRICE`/`NEXT_PUBLIC_LIFETIME_TOTAL_SLOTS` si el precio/cupo cambian del default.
- Nota de doctrina (`02B-ONBOARDING-MONETIZACION.md`): los lifetime deals se recomiendan "con pinzas" porque el costo de servir (IA vía Asistente) sigue corriendo contra un pago único — mitigado porque el Asistente ya tiene su propio límite diario por usuario y el kill-switch global, independiente del plan.
Bugs encontrados y corregidos de paso: filtro "Todas" en el paso de péptido del onboarding no mostraba sugerencias (bug real); vías de administración (Subcutánea/Intramuscular/Oral/Nasal) ahora tienen ícono propio en onboarding y en Péptidos.

## ✅ Mascota virtual integrada (2026-07-08)
Usuario generó la imagen (`Diseños/Mascota PeptiBrain/Mascota PeptiBrain.png`, sheet de 4 estados). Se recortó y se le quitó el fondo (flood-fill desde los bordes, sin herramientas externas — script en el scratchpad de la sesión) → `public/mascota/{waving,celebrating,pointing,sleeping}.png`, componente `components/app/shell/Mascot.tsx`. Conectada en: `WelcomeStep` (waving), `BuildingScreen` al terminar el onboarding (celebrating, junto al confeti), Inicio "sin dosis pendiente" (pointing). `sleeping` queda disponible para el próximo estado vacío que se use (ej. Salud/Péptidos sin registros).

## ✅ Oferta de bienvenida con urgencia real (2026-07-08)
`lib/onboarding.ts` guarda `startedAt` (hora real de inicio del wizard). En el paywall, `WelcomeOfferBanner.tsx` muestra cuenta regresiva real de 48h con el % de descuento (env var `NEXT_PUBLIC_WELCOME_DISCOUNT_PERCENT`, default 20). Al comprar dentro de la ventana, usa un código de oferta con descuento de Hotmart (env vars `NEXT_PUBLIC_HOTMART_OFFER_PREMIUM_DISCOUNT`/`..._FAMILY_DISCOUNT`) en vez del precio normal. **Pendiente del usuario**: crear esa oferta con precio rebajado en el dashboard de Hotmart y pegar su código — sin eso, el banner simplemente no aparece (no rompe nada).
No se construyó "oferta pre-primera-victoria" aparte: el paywall ya aparece justo después del wizard de onboarding (primer péptido/vial/dosis), que ES el momento post-primera-victoria — coincide de forma natural con la secuencia ya existente.
Mascota virtual: se le dio al usuario un prompt de generación de imagen listo para usar (4 estados: neutral, celebrando, alentando, durmiendo) — pendiente de que él genere las imágenes para integrarlas.

## ✅ Confeti + íconos por péptido + onboarding personalizado (2026-07-08)
- **Confeti** (`canvas-confetti`, `lib/celebrate.ts`, respeta `prefers-reduced-motion`): al terminar el onboarding (BuildingScreen) y al agregar el primer péptido manualmente.
- **Íconos distintos por categoría de péptido** (`lib/peptide-visual.ts` + `PeptideIcon.tsx`): antes todo usaba el mismo ícono genérico Beaker/Syringe. Ahora cada péptido muestra un ícono según su categoría (Dumbbell=músculo, Moon=sueño, Brain=cognición, etc.) en PeptideCard, Viales e Inicio. Deliberadamente NO se agregaron colores nuevos por categoría (para no romper la disciplina cromática 60-30-10 del sistema) — la variedad viene del ícono, no del color.
- **Onboarding personalizado por objetivo**: nuevo paso 0 (`GoalStep.tsx`) pregunta el objetivo (reutiliza las 10 categorías de péptidos) antes de "¿qué péptido usas?" — la respuesta preselecciona el filtro de categoría en las sugerencias, y personaliza la primera línea del paywall ("Armado para tu objetivo: X").

## ✅ BACKOFFICE v1 (2026-07-08) — solo Secciones 1+2 (etapa MVP, sin clientes reales aún)
`/admin` (protegido, solo `role='admin'` verificado en servidor — migración 0010, dueño = josepovedaedinar@gmail.com): ventas (usuarios por plan, altas 7d/30d, churn voluntario/involuntario separado, reembolsos/chargebacks), tabla de usuarios con búsqueda + edición manual de plan/estado (por si el webhook falla), salud del webhook de Hotmart, uso del Asistente IA + su kill-switch. Avisos automáticos arriba (o "✅ Todo en orden"). Deliberadamente NO incluye: error_log/event_log (no existen), LTV/CAC/atribución por canal (prematuro sin datos reales) — quedan para cuando haya clientes de verdad, según la doctrina de 21-BACKOFFICE.md.

## ✅ PUERTA DE RIGOR DE ENTREGA (48) — revisada 2026-07-08
- **Dinero**: gating de plan atómico vía trigger de Postgres ✓, webhook con firma timing-safe + idempotencia + distingue refund/chargeback/cancelación ✓
- **Datos**: exportar datos (JSON) en Familia ✓, migraciones no destructivas ✓. **Falta**: no existe "borrar mi cuenta" (derecho al olvido) — solo manual vía Supabase (ver MANUAL-DEL-DUEÑO.md)
- **Seguridad**: RLS activo en TODAS las tablas ✓. **Falta probar en vivo**: IDOR (leer recurso de otro usuario por ID) nunca se probó activamente con 2 cuentas reales
- **IA — circuit-breaker**: agregado tope GLOBAL diario (`ASSISTANT_GLOBAL_DAILY_LIMIT`, migración 0009) + aviso por correo al dueño (opcional, vía Resend) cuando se activa — antes solo había límite por-usuario
- **IA — calidad de output**: NUNCA evaluado con preguntas reales (requiere key de OpenRouter funcionando en un ambiente probado)
- **Manual del dueño**: creado en `MANUAL-DEL-DUEÑO.md` (cuentas, deploy, runbook, mantenimiento)
- **Auto-QA end-to-end + primer arranque vacío**: NO pude probarlo yo — sin credenciales de una cuenta real. Pendiente de que el usuario lo recorra.
- **Backups de Supabase**: pendiente de que el usuario confirme en su plan que están activos y son restaurables.

## ✅ AUDITORÍA EXHAUSTIVA 2026-07-08 — TODAS las tareas completadas
Además de todo el bloque de "Clonar PeptiBuddy" (ver más abajo), se corrieron y cerraron TODAS las tareas de la auditoría `/auditoria --exhaustivo`:
- Familia: vista real del invitado ("Compartido conmigo", aceptar/rechazar, modal de datos compartidos) — migración 0008 (`owner_name`)
- Paywall/landing: corregidas 3 funciones inventadas que no existían (Recordatorios de dosis, Proyección de stock, Modo viaje) — reemplazadas por funciones reales (Calculadora, Asistente IA, Salud completa, Protocolos, Exportar PDF)
- Familia: copy corregido — decía "te enviaremos invitación" pero no se envía correo real; ahora explica que se ve al entrar a la app
- Cuenta: `alert()` nativo de instrucciones de cancelación reemplazado por modal propio
- Onboarding: los 3 pasos (Péptido/Vial/Dosis) ahora centran verticalmente su contenido (antes quedaba espacio vacío en pantallas altas)
- SEO técnico: `app/sitemap.ts` y `app/robots.ts` agregados (multi-idioma es/en, excluyen `/app/*` y páginas funcionales)

**Migraciones pendientes de correr por el usuario** (si no las corrió ya): 0006 (proveedores), 0007 (assistant_usage), 0008 (owner_name en family_members).

## 🔴 ACTUALIZACIÓN 2026-07-08 — CORRIGE decisiones de más abajo (líneas ~20, 26, 27, 30)

Las siguientes decisiones descritas más abajo como "definitivas" **fueron revertidas hoy** porque el usuario pidió explícitamente igualar TODO PeptiBuddy, sin recortes por evitar migraciones:

- **Dosis SÍ tienen fecha real ahora** (`doses.scheduled_at`, migración 0005). Ya no es solo texto libre. Calendario real construido (`CalendarModal.tsx`) usando esta fecha.
- **Salud SÍ tiene Comidas/calorías** (tabla `meals`, migración 0004), además de Peso (con notas), Ejercicio, Hidratación y Efectos secundarios — las 5, no 4.
- **Hidratación y Efectos secundarios YA NO están permanentemente bloqueados** — se corrigió un bug real: aunque el usuario pagara Premium, esas secciones (y la Calculadora) SIEMPRE mostraban el candado porque el código nunca revisaba `data.plan`. Ya revisan el plan real y muestran contenido funcional a usuarios Premium/Family.
- **Calculadora de reconstitución construida de verdad** (`ReconstitutionCalculator.tsx`), ya no es un placeholder.
- **"Crear protocolo"** construido: genera automáticamente N dosis programadas (frecuencia + duración en semanas) — `addProtocol()` en `lib/app-data.ts`.
- **Viales** ahora con badge Reconstituido/No reconstituido, fecha de apertura, eliminar, y dos secciones nuevas: **Agua bacteriostática** (viales reconstituidos) y **Proveedores** (tabla `providers`, migración 0006, CRUD simple).
- **Base de péptidos** ampliada a 23 con categorías (`PEPTIDE_CATEGORY_IDS` en `lib/peptide-profiles.ts`) y filtro de categorías conectado en el onboarding.
- **Racha real**: `computeStreak()` ahora cuenta días consecutivos de verdad (antes contaba el total histórico de dosis aplicadas).
- **Rangos de fecha**: se agregó "Últimos 6 meses" y "Personalizado" (selector de 2 fechas) en `lib/date-range.ts` — ya conectado en Inicio y en Péptidos > Usos.
- **Onboarding**: se agregó la pantalla de bienvenida inicial ("¡Bienvenido a PeptiBrain!" + Empezar/Explorar por mi cuenta) y el link "Saltar" en cada paso — antes el wizard arrancaba directo en el paso 1 sin esa intro.
- **Asistente IA construido de verdad** (antes solo un botón bloqueado sin funcionalidad real): BFF en `app/api/assistant/route.ts`, vía **OpenRouter** (no Anthropic directo — decisión explícita del usuario), modelo por defecto `openai/gpt-oss-20b:free` (gratis, env var `ASSISTANT_AI_MODEL` para cambiarlo por cualquier modelo de openrouter.ai/models sin tocar código), circuit-breaker de 20 mensajes/día por usuario (tabla `assistant_usage`, migración 0007), gate a Premium real, chat con contexto de los propios datos del usuario, disclaimer "no es consejo médico". **Requiere que el usuario configure `OPENROUTER_API_KEY` en `.env.local`/Vercel — no puedo crear esa cuenta ni la key por él.** Free tier de OpenRouter: 50 msj/día sin tarjeta, 1000/día si carga $10 de saldo (no se gasta, solo desbloquea el límite). Sin la key, el Asistente responde error "no disponible" pero el resto de la app sigue funcionando normal.
- Se corrigió además un bug de pérdida de datos en `addHealthLog`: guardar hidratación en un día que ya tenía peso registrado borraba el peso (el upsert no fusionaba con lo existente). Ya fusiona correctamente.

**Migraciones pendientes de correr por el usuario (en orden, si no las corrió ya):** 0003 (hardening+familia), 0004 (comidas), 0005 (scheduled_at), 0006 (proveedores), 0007 (assistant_usage). Todas están en `supabase/migrations/`.

**Pendiente real del usuario:** conseguir una API key de Anthropic (console.anthropic.com) y ponerla en `ANTHROPIC_API_KEY` para que el Asistente funcione de verdad — esto tiene costo real por cada mensaje (mitigado por el límite diario de 20).

## ⚠️ BUGS CRÍTICOS DE AUTH ENCONTRADOS Y CORREGIDOS (2026-07-07, tras activar Resend + Confirm Email)
Al activar "Confirm email" y probar el flujo completo con una cuenta real, aparecieron 3 bugs graves en cadena — todos corregidos y verificados:
1. **El login (Ingresar) y "olvidé mi contraseña" SIEMPRE fallaban.** Causa raíz confirmada con una llamada directa a la API de Supabase: el proyecto exige captcha (Cloudflare Turnstile) en TODOS los flujos de auth (login, recuperar contraseña), no solo en el registro — pero esos 2 formularios nunca pedían el captcha. Supabase rechazaba el intento con `captcha_failed` ANTES de revisar la contraseña, y nuestro código traducía ese error a "contraseña incorrecta" (falso positivo engañoso). Se agregó el widget de Turnstile a ambos formularios en `app/[locale]/login/page.tsx`. Verificado con una petición real: el error pasó de `captcha_failed` a `invalid_credentials` (el comportamiento correcto).
2. **El enlace de confirmación de correo aterrizaba en la pestaña "Registrarte"** en vez de "Ingresar" (la pestaña por defecto de `/login` siempre era la de registro, sin importar el contexto). Corregido: si la URL trae `?code=` (viene de confirmar el correo), abre directo en "Ingresar" con un aviso verde "¡Correo confirmado!". Requirió envolver la página en `<Suspense>` (uso de `useSearchParams`).
3. **El login saltaba directo a `/app` sin pasar por onboarding/paywall** para cualquier cuenta que tuviera que confirmar su correo primero (porque antes solo `handleRegister` redirigía a `/onboarding`, pero con confirmación de correo activa el usuario nunca pasa por ahí — hace login más tarde, por separado, y `handleLogin` iba siempre a `/app`). Corregido: `handleLogin` ahora revisa `profiles.onboarding_completed_at` y manda a `/onboarding` si falta.
- Además: se conectó **Resend** (dominio `peptibrain.com` verificado vía Cloudflare DNS — hubo que migrar el DNS completo de Piensa Solutions a Cloudflare porque su panel no aceptaba registros con guion bajo como `_dmarc`/`resend._domainkey`), SMTP configurado en Supabase, plantilla de correo con el logo real (`icon-192.png`) en vez de una "P" de texto. El `emailRedirectTo`/Site URL de Supabase también apuntaba a `localhost:3000` en vez de `https://peptibrain.com` — corregido en código (`emailRedirectTo` dinámico) y en el dashboard (Site URL + Redirect URLs).
- Se enriqueció **Mi cuenta** (`app/[locale]/app/cuenta/page.tsx`): ahora muestra nombre/correo real, selector de idioma, botón "Subir a Premium" si el plan es gratis, y un enlace a `/descargar` (la página de instalar la PWA existía pero no estaba enlazada desde ningún lado — bug pre-existente, ya corregido).
- Se limitó el campo de teléfono del registro a 15 dígitos máximo (antes no tenía tope).
- ⏳ **Pendiente de re-verificar por el usuario**: el 404 al confirmar en producción reportado antes de este arreglo — debería estar resuelto ahora (Site URL correcto + captcha en login), pero falta una prueba real de punta a punta del usuario para confirmarlo del todo.

## 🎯 INICIATIVA ACTUAL — Clonar PeptiBuddy exacto (2026-07-07, decisión explícita del usuario: "todo, exacto")
El usuario mostró `/Users/josepoveda/Desktop/Peptibuddy/` (24 capturas numeradas, 1.png-24.png) de una app de referencia y pidió que PeptiBrain iguale su estructura COMPLETA, no solo el copy de la landing (que ya se había copiado en Sesión 3). Diferencias grandes encontradas: PeptiBuddy es de ESCRITORIO (nav arriba, no bottom-nav), tiene sub-pestañas dentro de Péptidos (Usos/Péptidos/Viales/Calculadora) y Salud (Peso/Comidas/Hidratación/Efectos), candados de plan de pago visibles (Calculadora, "Asistente" IA, Hidratación, Efectos secundarios), modo oscuro, tour de 9 pasos (el actual de PeptiBrain es de 4), base de datos de péptidos con autocompletado+descripción al escribir, selector de fecha/hora real con atajos para la primera dosis (hoy es texto libre), pantalla "¡Ya casi está!" tras registro + correo de confirmación con diseño propio, y "¿Olvidaste tu contraseña?".

**Plan de 6 fases acordado con el usuario** (ejecutar en orden, verificar cada una antes de la siguiente):
1. ✅ **HECHO (2026-07-07)** — Registro/login exactos: pantalla "¡Ya casi está!" tras registro (`app/[locale]/login/page.tsx`, estado `justRegistered`, solo se activa si Supabase exige confirmación de correo), página `/restablecer-password` nueva (maneja el enlace de recuperación + detecta enlace caducado), enlace "¿Olvidaste tu contraseña?" en el login, `components/app/Header.tsx` convertido a Server Component que lee la sesión real y muestra "Ir a mi app" en vez de "Empezar gratis" si hay sesión. Plantilla de correo de confirmación con marca propia guardada en `supabase/email-templates/confirm-signup.html` (pendiente de que el usuario la pegue en Supabase → Authentication → Emails → Templates → Confirm signup).
   - ✅ **Confirmado activo (2026-07-07)**: el usuario activó "Confirm email" en Supabase. Verificado con un registro real (`josepovedaedinar+confirmtest...@gmail.com`) → la pantalla "¡Ya casi está!" se muestra correctamente. Bug real encontrado y corregido en la misma prueba: el correo largo se salía del borde de la tarjeta (overflow) en `almostThereBody`/`resetLinkSentBody` — se agregó `break-words` + `w-full` en ambos párrafos.
2. ✅ **HECHO (2026-07-07)** — Onboarding mejorado: `lib/peptide-profiles.ts` ahora tiene campo `description` en los 8 perfiles originales + 4 nuevos (Cagrilintide, Adipotide (FTPP), 5-Amino-1MQ, MK-677/Ibutamoren) para calzar con los chips "Más comunes" de PeptiBuddy. `StepPeptide.tsx` muestra sugerencias en vivo (filtro por substring, ≥2 caracteres) con descripción y "Encontré N sugerencias"/"Ocultar", clic autocompleta nombre+vía. `StepDose.tsx` cambió de texto libre a `<input type="datetime-local">` real + los 3 atajos ("En 1 hora"/"Mañana 8am"/"Mañana 8pm") ahora calculan una fecha real y la formatean a un label humano (`Intl.DateTimeFormat`) que se sigue guardando como texto en `doses.when_label` (sin tocar el esquema de Supabase — decisión: evitar migración de esquema arriesgada con usuarios reales ya usando la app; si más adelante se quiere una agenda de dosis 100% ordenable por fecha real, es una migración aparte a evaluar).
3. ✅ **HECHO (2026-07-07)** — App interna reestructurada a escritorio: `TopNav.tsx` (nav de arriba, 4 pestañas Inicio/Péptidos/Salud/Familia — se mantuvo Familia aunque PeptiBuddy no la tiene, porque es diferenciador explícito de PeptiBrain) reemplaza a `BottomNav.tsx` (borrado). `ThemeToggle.tsx` + `lib/theme.ts` agregan modo oscuro real (clase `.dark` en `<html>`, persistido en localStorage, sin parpadeo gracias a un script inline en `app/[locale]/layout.tsx`). `ProfileMenu.tsx` (menú desplegable con avatar+nombre real desde Supabase, "Mi cuenta"/"Cerrar sesión") reemplaza los íconos sueltos de antes (`SignOutButton.tsx` borrado, absorbido en ProfileMenu). Paleta oscura completa en `app/globals.css`.
   - ⚠️ **Hallazgo técnico importante**: un bloque `.dark { --background: ...; }` escrito como selector de clase simple desaparecía SILENCIOSAMENTE al compilar con Tailwind v4/Lightning CSS (bug o comportamiento no documentado — probablemente relacionado con el `@custom-variant dark (&:is(.dark *))` ya presente en el archivo). Se resolvió usando el selector `html.dark { ... }` en vez de `.dark { ... }` — con eso sí compila y aplica correctamente. **Si en el futuro se necesita agregar más overrides de tema, usar SIEMPRE `html.dark`, nunca `.dark` a secas.**
   - Verificado con una cuenta de prueba real: registro → onboarding → header con nombre real + modo oscuro funcionando + las 4 pestañas navegando correctamente, en modo claro Y oscuro.
4. ✅ **HECHO (2026-07-07)** — Sub-pestañas + dashboard con filtros de fecha (ejecutado sin pausas, a pedido explícito del usuario: "haz de la fase 4 a la 6 sin preguntarme"):
   - **Péptidos** (`app/[locale]/app/peptidos/page.tsx`) reestructurado en 4 sub-pestañas: **Usos** (nuevo — historial de dosis con "Registrar uso" real: selector de péptido + fecha/hora real + dosis, marca pendiente/aplicada), **Péptidos** (el listado que ya existía), **Viales** (nuevo — lista plana de todos los viales de todos los péptidos, solo lectura, con aviso de que se agregan desde Péptidos), **Calculadora** (bloqueada con `PremiumLocked`).
   - **Salud** (`app/[locale]/app/salud/page.tsx`) reestructurado en 4 sub-pestañas: **Peso**, **Ejercicio** (sustituye a "Comidas" de PeptiBuddy — decisión deliberada: PeptiBrain no tiene seguimiento de comidas/calorías en el modelo de datos, y agregarlo habría significado una migración de esquema nueva fuera de alcance; se usó Ejercicio porque sí es un dato real que ya se registra), **Hidratación** (bloqueada), **Efectos secundarios** (bloqueada). El formulario de registro sigue siendo uno solo (peso+ejercicio+hidratación+efecto en un mismo registro diario) — los usuarios gratis SÍ pueden seguir registrando hidratación/efectos vía ese formulario, pero solo ven su propio historial filtrado de Peso/Ejercicio; el historial dedicado de Hidratación/Efectos es lo que está bajo Premium.
   - **Inicio** (`app/[locale]/app/page.tsx`) ahora tiene: filtro de rango de fecha (Hoy/7 días/30 días/Histórico vía nuevo `lib/date-range.ts` + `DateRangeTabs.tsx`), 4 tarjetas de métricas (Dosis cumplidas %, Peso promedio, Hidratación promedio, Efectos registrados — sustituyen "Promedio calorías"/"Rutinas cumplidas" de PeptiBuddy por las mismas razones de arriba: sin dato de comidas/rutinas en nuestro modelo), y 2 paneles (Usos en el rango, Efectos secundarios en el rango).
   - Se agregó `createdAt` real a `Dose` (antes solo existía `when` como texto libre) para poder filtrar por rango de fecha sin tocar el esquema de Supabase (`created_at` ya existía en la tabla, solo faltaba exponerlo en `lib/app-data.ts`).
   - Nuevos componentes reutilizables: `components/app/shell/SubTabs.tsx`, `DateRangeTabs.tsx`, `PremiumLocked.tsx`.
5. ✅ **HECHO (2026-07-07)** — Candados de plan de pago: Calculadora/Hidratación/Efectos secundarios usan `PremiumLocked` (ícono de candado + descripción + botón "Desbloquear con Premium" → `/paywall`). Botón "Asistente" bloqueado agregado en Inicio (arriba a la derecha), enlaza directo a `/paywall` — no es una función de IA real todavía; si se quiere que funcione de verdad, esa es una decisión de arquitectura de IA aparte (qué modelo, costo por uso) que se define cuando llegue el momento, no incluida en este alcance.
6. ✅ **HECHO (2026-07-07)** — Recorrido guiado ampliado de 4 a 9 pasos en `components/app/shell/AppTour.tsx`, adaptado a la estructura REAL de PeptiBrain (no se copiaron literal los pasos de PeptiBuddy porque mencionaban Calendario/Asistente que no son funciones reales nuestras — habría violado la regla UX de "todo elemento interactivo hace algo"): 1) Inicio, 2) Filtros de fecha, 3) Péptidos (intro), 4) Usos, 5) Viales, 6) Calculadora (premium), 7) Salud, 8) Familia, 9) Tu perfil.

**Verificación de las fases 4-6**: tsc ✓ · build ✓ · probado con una cuenta de prueba real en dos anchos reales — **375px (móvil)** y **768px (tablet)** — confirmando que las 4 tarjetas del dashboard, las sub-pestañas de Péptidos/Salud, el registro de un peso real (82.5 kg reflejado correctamente en el dashboard), el candado de Calculadora, y los 9 pasos del tour funcionan en ambos anchos sin overflow. El 98% del tráfico es móvil (dato dado por el usuario) — el diseño de sub-pestañas usa scroll horizontal (`overflow-x-auto`) para no romper en pantallas angostas.

## 🎉 CLON DE PEPTIBUDDY — LAS 6 FASES COMPLETAS (2026-07-07)

## Bloque de prioridad ALTA (Sesión 6, servicios externos) — progreso, retomar ahora que el clon terminó
1. ✅ **Programa de afiliados activado en Hotmart**: 35% de comisión (inicial y recurrente) aplicado a los 4 planes. Descripción del programa escrita y publicada. Producto de Hotmart pasó de "Borrador" a publicado — **ya se puede vender de verdad**.
   - Nota técnica: Hotmart trata el producto como si fuera un "curso" (pide configurar "Área de Miembros"/"Contenido"), aunque PeptiBrain es una app web, no un curso. Se resolvió creando una única lección de bienvenida dentro de Hotmart que redirige al comprador a https://peptibrain.com para iniciar sesión con el mismo correo de compra.
2. ✅ **Cloudflare Turnstile real conectado**: Site Key real (`0x4AAAAAADxQKCITHwG2zCk9`) en `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (`.env.local`); Secret Key la puso el usuario directo en Supabase (Authentication → Attack Protection → Turnstile), Supabase verifica el token del lado servidor automáticamente. `components/app/Turnstile.tsx` ya no usa la clave de prueba. `app/[locale]/login/page.tsx` conecta `onVerify` → `captchaToken` → se envía en `supabase.auth.signUp({ options: { captchaToken } })`, con validación de que exista antes de enviar el formulario.
   - Pendiente: **agregar `NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAADxQKCITHwG2zCk9` en Vercel → Settings → Environment Variables** para que funcione en producción (sin esto, el widget en peptibrain.com usa el fallback de prueba).
3. ⬜ Conectar Resend (correos transaccionales reales)
4. ✅ **Banner de consentimiento de cookies**: `components/app/CookieConsentBanner.tsx` + `lib/mixpanel.ts` con `opt_out_tracking_by_default: true` — Mixpanel ya NO manda ningún evento hasta que el usuario acepte el banner ("Aceptar todas" llama `mixpanel.opt_in_tracking()`, "Solo necesarias" llama `opt_out_tracking()`). Verificado con `preview_network`: antes de aceptar, cero peticiones a `api-js.mixpanel.com`; después de aceptar, `200 OK`.
5. ⬜ Probar un pago real completo de punta a punta

## Datos legales reales de la empresa (NO inventar, ya confirmados por el usuario)
- Entidad: **Digital Dreams World LLC**
- Domicilio: 2105 Vista Oeste NW Suite E 3564, Albuquerque, NM 87120, Estados Unidos
- EIN: 32-0757894
- ⚠️ Esto corrige un error anterior: los Términos de Servicio originales decían "operado desde España" — era una suposición mía incorrecta (por el dominio comprado en un proveedor español). Ya corregido a la LLC real de EE.UU. en `messages/es.json`/`en.json` → `Legal.termsIntro`.

## Páginas legales — completas (2026-07-07)
- Nuevo componente compartido `components/app/legal/LegalPage.tsx` (título+fecha+intro+secciones+volver) — reutilizado por las 5 páginas legales para no repetir código.
- **Nuevas**: `/cookies` (qué cookies usa: Supabase sesión, NEXT_LOCALE, Mixpanel analítica — ninguna de publicidad), `/aviso-legal` (datos de Digital Dreams World LLC), `/reembolsos` (explica el trial de 7 días, cobro automático, cómo cancelar, cómo pedir reembolso vía Hotmart).
- Footer actualizado con los 5 links legales (Términos/Privacidad/Cookies/Reembolsos/Aviso Legal), envueltos en 2 líneas en mobile sin desbordar.
- Verificado: tsc ✓ build ✓ · probado visualmente a 375px real en ES.

## ✅ Bloque de PRIORIDAD MUY ALTA — completado el 2026-07-07
1. **Confirmación de correo arreglada**: el interruptor real estaba en Supabase → Authentication → Sign In/Providers → sección "User Signups" → "Confirm email" (NO donde se buscó primero, dentro del modal "Email"). Ya apagado y verificado con una prueba real de `signUp` → devuelve sesión activa de inmediato.
2. **Webhook de Hotmart funcionando de verdad**: causa raíz encontrada — Hotmart webhook v2.0.0 manda el `hottok` en el **header HTTP `X-HOTMART-HOTTOK`**, NO dentro del JSON como asumí al principio. Corregido en `app/api/webhooks/hotmart/route.ts` (ahora lee `request.headers.get("x-hotmart-hottok")`). Confirmado con la prueba de Hotmart: casi todos los eventos devuelven "200 - Procesado" (Compra aprobada/completa/reembolsada/cancelada, etc.). ⚠️ Único caso pendiente sin bloquear: el evento sintético "Cancelación de Suscripción" en la prueba de Hotmart no trae email de comprador (por eso da 400 en ESA prueba específica) — no afecta a los eventos de compra real, revisar con calma más adelante si aplica en producción real.
3. **Datos de la app migrados de verdad a Supabase**: `lib/app-data.ts` reescrito completo (era localStorage, ahora son llamadas reales a Supabase con RLS). Incluye:
   - Límite del plan Gratis (1 péptido, 1 vial) validado en el SERVIDOR con `PlanLimitError` — ya no se puede saltar editando el navegador.
   - Sembrado inicial desde el onboarding ahora se guarda en Supabase (usa `profiles.onboarding_completed_at` para saber si ya se sembró).
   - Migración de esquema necesaria: `supabase/migrations/0002_doses_when_text.sql` (la columna `when_at timestamptz` se cambió a `when_label text`, porque la app guarda texto libre como "Mañana 8am", no una fecha exacta parseable).
   - Salud: la fecha ahora se guarda en formato ISO real (`log_date`), la pantalla la formatea al idioma actual al mostrarla (antes se guardaba ya formateada, mezclando datos con presentación).
   - Probado de punta a punta con una cuenta real: registro → onboarding → péptido/vial/dosis sembrados correctamente en Supabase → racha y "próxima dosis" mostrando datos reales.
4. **Términos de Servicio y Política de Privacidad reales** (ES/EN), reemplazando el placeholder "estamos redactando esto".
5. **Revisión de seguridad**: RLS probado en las 7 tablas (sin sesión no se puede leer nada), sin secretos en el código, `.env.local` nunca subido a git. Hallazgo menor aceptado (no corregido): el mensaje de "correo ya registrado" permite enumeración de cuentas — riesgo bajo, se dejó así por UX.

⚠️ Nota de aprendizaje para futuras sesiones: **dos veces el usuario corrió SQL/comandos en el proyecto de Supabase equivocado** (confirmadisimo en vez de PeptiBrain) — siempre confirmar el nombre del proyecto visible arriba a la izquierda del dashboard antes de dar instrucciones de "pega esto y dale Run".

## Sesión del 2026-07-06 — resumen de lo construido
- **PWA instalable**: `/descargar` con instrucciones paso a paso iOS(Safari)/Android(Chrome) para agregar a pantalla de inicio.
- **`/app/cuenta`**: pantalla nueva que lee el plan REAL desde Supabase (`profiles.plan`/`plan_status`, ya no localStorage) y muestra botón "Cancelar suscripción".
- **Oferta de retención (win-back)**: `components/app/cuenta/CancelOfferModal.tsx` — antes de dejar cancelar, ofrece 40% de descuento 3 meses. Si igual quiere cancelar, hoy solo le decimos que lo haga desde el correo de Hotmart o soporte — **no cancelamos de verdad vía API de Hotmart todavía** (no tenemos esa integración), es una limitación conocida a futuro.
- **Tour de bienvenida dentro de la app** (`components/app/shell/AppTour.tsx`): modal de 4 pasos (Inicio/Péptidos/Salud/Familia) que aparece la primera vez que se entra a `/app` (flag en localStorage `peptibrain_tour_seen`), con puntos indicadores y botones Omitir/Siguiente/Empezar. Inspirado en el patrón de bienvenida de Confirmadísimo pero adaptado a tour-dentro-de-la-app en vez de página aparte.
- Eventos de Mixpanel nuevos: `app_tour_started`, `app_tour_completed`, `cancel_subscription_clicked`, `retention_offer_accepted`, `retention_offer_declined`.
- Verificado: tsc ✓ build ✓ · el tour se probó visualmente de verdad (con una ruta temporal ya borrada) confirmando que los 4 pasos y los puntos indicadores cambian correctamente.
- Hotmart: los 4 planes (Premium/Family × mensual/anual) creados, checkout conectado al paywall, webhook construido y desplegado (`/api/webhooks/hotmart`) con `HOTMART_HOTTOK` y `SUPABASE_SECRET_KEY` ya puestos en Vercel — pero la prueba de Hotmart seguía devolviendo 401 en el último chequeo, hay que reconfirmar con una prueba fresca.

## Hotmart — 4 planes creados, checkout real conectado al paywall (2026-07-06)
- Dominio `peptibrain.com` comprado en Piensa Solutions. Registro DNS tipo A (@ y www → 216.198.79.1) agregado y YA PROPAGADO (`dig` confirma). Vercel sirve la app por HTTP en el dominio real; HTTPS todavía sin certificado emitido (normal, se resuelve solo en minutos/horas tras la propagación) — pendiente de reconfirmar que ya cargue con candado.
- Los 4 planes de Hotmart YA ESTÁN CREADOS: Premium mensual ($9), Premium anual ($84), Family mensual ($19), Family anual ($180) — todos en USD, con impuesto incluido en el precio mostrado, trial de 7 días gratis activado en los 4.
- Links reales de checkout guardados en `lib/hotmart-links.ts`:
  - Premium mensual: `https://pay.hotmart.com/Q106628596T?off=m7yz3mfb`
  - Premium anual: `https://pay.hotmart.com/Q106628596T?off=wca2xckm`
  - Family mensual: `https://pay.hotmart.com/Q106628596T?off=iucld0wb`
  - Family anual: `https://pay.hotmart.com/Q106628596T?off=lgn3ozqy`
- `app/[locale]/paywall/page.tsx` ya NO simula el pago — el botón de elegir Premium/Family redirige de verdad a Hotmart (plan mensual, con el email del usuario precargado en la URL de checkout). El plan Gratis sigue yendo directo a `/app` sin pasar por Hotmart.
- Imagen de producto (600x600, con el isotipo real de la marca) generada y guardada en `Diseños/hotmart/peptibrain-hotmart-600x600.png`.
- Kit de afiliado completo (5 ángulos de venta, copys, guion UGC, stories, emails, FAQ, reglas de qué no decir) entregado al usuario en el chat — pendiente de guardarlo en un archivo si se quiere reutilizar formalmente.
- ⚠️ **Pendiente crítico — el pago hoy NO activa el plan solo**: falta crear el webhook de Hotmart (con verificación de `hottok`) que, cuando alguien paga de verdad, actualice `profiles.plan` en Supabase automáticamente. Sin esto, alguien puede pagar en Hotmart pero seguir viendo "Gratis" dentro de la app — hay que resolverlo antes de anunciar el lanzamiento real. Requiere: (a) el `hottok` del producto en Hotmart (Configuración → Webhook), (b) la `SUPABASE_SECRET_KEY` (service_role) puesta DIRECTO en Vercel → Environment Variables, nunca pegada en el chat — con ambas se puede escribir el endpoint `app/api/webhooks/hotmart/route.ts`.
- Pendiente inmediato aparte: activar programa de afiliados en Hotmart (35% recurrente, aprobación manual).

## Hoja de ruta acordada con el usuario (2026-07-05) — NO reordenar sin que lo pida
1. Terminar y pulir la web (dominio propio, migrar datos de localStorage a Supabase, Términos/Privacidad reales)
2. Configurar PWA (instalable desde el navegador, sin tienda, sin comisión) — próximo paso técnico pedido explícitamente
3. Definir estrategia de adquisición con micro-influencers / contenido viral corto (usar `34-ADQUISICION-Y-TRAFICO.md`)
4. Construir versión nativa con React Native/Expo — publicar PRIMERO en Google Play (más barato, más rápido, sin esperar cuenta Apple), Apple después sin prisa. Pago (RevenueCat) en vez de Hotmart para las apps nativas.
5. Con el aprendizaje de este proceso, repetir la secuencia para el próximo proyecto del usuario: **Confirmadísimo** (su otra app, confirmación de citas por WhatsApp para barberos)
- Decisión de negocio del usuario: PeptiBrain será su PRIMERA app publicada en Google Play y Apple — quiere aprender el proceso completo con esta antes de repetirlo.
- Nota de costos ya explicada al usuario: cuenta Google Play Developer = $25 pago único (sirve para subir apps ilimitadas, incluida Confirmadísimo después); Apple Developer = $99/año.

⏸️ CHECKPOINT — Última acción completada: **App en producción funcionando de punta a punta** en `https://pepti-brain.vercel.app`. Se resolvió la cadena completa de bloqueos de despliegue: (1) autor de commit inválido → corregido con email noreply de GitHub; (2) repo privado + plan Hobby de Vercel no permite colaboración → repo puesto en público (ver nota de abajo); (3) faltaban `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` en Vercel → Environment Variables (agregadas por el usuario). Verificado en vivo: home 200 ✓, `/app` redirige a `/login` sin sesión (ES y EN) ✓. / Siguiente acción exacta: (1) comprar el dominio `peptibrain.com` (bloquea Resend/Hotmart/Cloudflare); (2) migrar los datos de la app interna (péptidos/viales/dosis/salud/familia) de localStorage a Supabase; (3) escribir Términos/Privacidad reales antes de vender.

⚠️ **PENDIENTE — Volver a poner el repo de GitHub en PRIVADO cuando la app esté terminada.** El usuario pidió explícitamente anotar esto: `github.com/PeptiBrain/peptiBrain` está PÚBLICO ahora mismo (decisión tomada el 2026-07-05) porque el plan gratis de Vercel (Hobby) bloqueaba los despliegues al no permitir "colaboración" en repos privados con más de una identidad de Git autora de commits. No hay secretos reales expuestos (verificado: `.env.local` nunca se subió, ninguna clave secreta de Supabase está en el código). Cuando el usuario termine de construir la app y quiera volver a privado, la única forma de hacerlo sin romper los despliegues es pasar a **Vercel Pro ($20/mes)** — avisarle esto explícitamente cuando pida volver a privado, no solo cambiar la visibilidad sin más.

## Mixpanel — analítica de producto conectada
- Token del proyecto guardado en `.env.local` (`NEXT_PUBLIC_MIXPANEL_TOKEN`) — es público por diseño, no es secreto (a diferencia de las claves de Supabase que sí distinguen pública/secreta).
- `lib/mixpanel.ts`: wrapper con `initMixpanel()`, `track()`, `identifyUser()`, `resetMixpanel()`, `trackPageview()`.
- `components/app/MixpanelProvider.tsx`: inicializa una sola vez y registra vista de página en cada cambio de ruta (necesario porque el App Router es SPA — `track_pageview` automático de Mixpanel solo dispara en la carga inicial). Conectado en `app/[locale]/layout.tsx`.
- Eventos del embudo ya instrumentados: `sign_up_completed` (registro) con `identify()`+`people.set()`, `login_completed` (login) con `identify()`, `mixpanel.reset()` al cerrar sesión, `paywall_viewed` + `plan_selected` (paywall), `onboarding_completed` (pantalla de carga), `dose_logged` (marcar dosis aplicada en Inicio).
- Verificado: tsc ✓ build ✓ dev ✓ — confirmado con `preview_network` que el evento de pageview llega a `api-js.mixpanel.com/track` con `200 OK`.
- ⚠️ Pendiente real: NO hay gate de consentimiento (GDPR/CCPA) todavía — hoy Mixpanel trackea desde el primer segundo sin pedir permiso. Aceptable para desarrollo/validación, pero antes de vender de verdad en España/EU hay que añadir un banner de cookies/consentimiento (se conecta con la doctrina de 47-LEGAL-FISCAL-Y-SOPORTE.md) y usar `mixpanel.opt_out_tracking_by_default` hasta que el usuario acepte.
- Backlog: eventos adicionales razonables si se quiere más profundidad — `peptide_added`, `vial_added`, `health_log_added`, `family_member_invited` (no instrumentados todavía, son de menor prioridad que el embudo principal).

## Sesión 6 — Servicios externos (en progreso)
- ⚠️ Hallazgo de seguridad importante al conectar GitHub: el `git` del sistema estaba inicializado a nivel de TODA la carpeta de usuario (`/Users/josepoveda`, con "No commits yet" — nunca se había subido nada), no solo del proyecto. Si se hubiera subido desde ahí se habría expuesto contenido personal ajeno a la app (otras carpetas del usuario, configuración de Claude, etc.). Se resolvió creando un repositorio git NUEVO Y SEPARADO específicamente dentro de `Peptibrain/` (git anidado, válido y aislado) — el git de la carpeta de usuario se dejó intacto sin tocar, fuera de este proyecto.
- `.gitignore` reforzado: además de lo estándar (node_modules, .next, .env*), se excluyeron las carpetas de material de referencia/diseño que NO son parte del código de la app (`Apps Peptidos/`, `Diseños/`, `Testimonios/` en la raíz, el zip del logo) — sí se subieron los assets finales usados de verdad por la app en `public/` (isotipo, favicons, fotos recortadas de testimonios).
- Repo conectado: `origin` → `https://github.com/PeptiBrain/peptiBrain.git`, rama `main`, primer commit subido y verificado (`git log` + `gh repo view` confirman).
- Supabase: el usuario compartió la URL del proyecto `https://myxgacuijwhcergdeqoz.supabase.co` (dato no sensible, se puede guardar). ⚠️ Recordatorio permanente: NUNCA pedir ni aceptar en el chat la `service_role key`, contraseñas de la base de datos, ni ningún secreto — eso se configura directo en variables de entorno del servidor.
- Pendiente inmediato de Sesión 6 (orden: datos/RLS → auth → BFF/endpoints → UI conectada, según CLAUDE.md): diseñar el modelo de datos real en Supabase (users, peptides, vials, doses, health_logs, family_groups/family_members con nivel de visibilidad), activar RLS por tabla, migrar `lib/app-data.ts` y `lib/onboarding.ts` de localStorage a llamadas reales, luego auth real (reemplaza el login simulado), luego Hotmart/Resend/dominio.

## Sesión 7 — Testing, pulido y rigor de entrega (en progreso)
- Checklist operativa completa (rúbricas /40 y /20, checklist de cierre condicional, tests de 06, puerta de rigor de 48, filtro MVP-vs-enriquecido de 32) generada a partir de los archivos del sistema — usada como guía de esta sesión.
- Bug real encontrado y corregido: `components/app/Header.tsx` — a 375px de ancho REAL (no 1280px reducido) el logo+wordmark, el selector de idioma y el CTA "Empezar gratis" no cabían en una fila y se solapaban. Corregido ocultando el wordmark de texto bajo `sm:` (queda solo el isotipo en mobile) y reduciendo gaps/padding del CTA en mobile.
- Falsas alarmas descartadas (documentado para no repetir la duda en el futuro): (1) "huecos en blanco" entre secciones de la landing al hacer scroll instantáneo — es el mismo artefacto ya documentado de IntersectionObserver + `scrollTo` abrupto, NO un bug; medido con `getBoundingClientRect` y confirmado que el espaciado real es correcto. (2) Clics que "no abrían" un formulario — causado por leer `document.querySelectorAll('input')` en el mismo tick síncrono que el `.click()` (antes de que React comprometa el render) y por clicar justo en el frame en que la hidratación de React todavía no terminó tras una navegación — ambos son artefactos de cómo se probó, no bugs de producto.
- Mejora de rigor de entrega añadida: `app/[locale]/app/familia/page.tsx` — (a) confirmación (`window.confirm`) antes de quitar a un familiar de la lista de compartidos (antes borraba sin preguntar, violaba la regla UX "confirmación para irreversibles"); (b) botón "Descargar mis datos (JSON)" que exporta todo `AppData` (péptidos/viales/dosis/salud/familia) a un archivo — mitigación directa del riesgo #1 del pre-mortem: sin backend, si el usuario borra el navegador pierde TODO su historial de salud sin aviso ni forma de recuperarlo.
- ⚠️ Riesgo conocido documentado (no bloqueante, ya estaba anotado): la racha y el gating de plan (Free/Premium/Family) se calculan 100% en el cliente — cualquiera podría editar `localStorage` desde las DevTools y "hacer trampa" o desbloquear Premium gratis. Aceptable para esta etapa de validación (sin backend todavía), pero debe recalcularse en servidor cuando se conecte Supabase en Sesión 6. Import de datos (complemento al export ya hecho) queda en el backlog si se quiere simetría completa.
- Verificado: tsc ✓ · build ✓ · probado en navegador a 375px real (viewport verdadero, no solo reducir ventana) en landing y en las 4 pantallas de la app interna.
- Segunda pasada (mismo día): recorrido completo de `/login`, los 3 pasos de `/onboarding`, y `/paywall` a 375px real.
  - Bug real corregido: `components/app/Turnstile.tsx` — el contenedor del widget de Cloudflare (test key) tenía `min-h-[65px]`, insuficiente para el banner "Solo para pruebas" que Cloudflare agrega automáticamente en modo test; se subió a `min-h-[100px]` con `overflow-visible`. ⚠️ Queda un solape cosmético MENOR dentro del propio iframe de Cloudflare (el texto "Privacidad · Ayuda" de su footer se monta un poco sobre su propio banner de test) — es contenido cross-origin dentro del iframe, no editable con nuestro CSS; se resuelve solo al reemplazar la sitekey de prueba por la real en Sesión 6, no vale la pena perseguirlo más ahora.
  - Falsas alarmas descartadas por MEDICIÓN (no por lectura de screenshot) en esta pasada: "los botones Intramuscular/Nasal se salen de la pantalla" en el paso 1 del onboarding — falso, es un grid de 2 columnas por diseño (`grid-cols-2` intencional, no `sm:grid-cols-2`) y `scrollWidth`/`scrollX` confirman que no hay overflow real. Regla aprendida y aplicada: medir con `getBoundingClientRect()`/`scrollWidth` antes de reportar un bug de layout visual — los ojos se equivocan con capturas, las mediciones no.
  - Paywall revisado completo (arriba y abajo con scroll): planes, badge "Más popular", nota honesta de "Simulado por ahora — Hotmart", salida "Ahora no, seguir gratis" — todo cabe sin overflow a 375px.
- Pendiente real para continuar Sesión 7 (si el usuario quiere ir más a fondo): correr la rúbrica formal /40 usabilidad + /20 craft de 07-PULIDO.md con un revisor de contexto limpio (subagente que no haya construido las pantallas); recorrer 43-MICRO-CRAFT en detalle (tabular-nums en contadores de racha/dosis, `…` vs `...`, comillas tipográficas). No es bloqueante — no se encontraron más bugs funcionales ni de overflow.

## Bilingüe ES/EN + moneda €/$ — COMPLETO (landing + registro + onboarding + paywall + app interna)
- Librería: `next-intl`. Rutas movidas a `app/[locale]/...` (todo lo que antes vivía en `app/` ahora vive en `app/[locale]/`, excepto `globals.css` y `favicon.ico` que quedan en la raíz de `app/`).
- `i18n/routing.ts`: locales `es` (default, sin prefijo en la URL) y `en` (con prefijo `/en/...`) — estrategia `as-needed`, buena para SEO (cada idioma tiene su propia URL indexable, a diferencia del widget de Google Translate que el usuario preguntó y se descartó).
- `i18n/routing.ts` también define `CURRENCY`: es→€, en→$ (decisión del usuario). Los precios son los MISMOS NÚMEROS con distinto símbolo (€9/$9, €19/$19) — no es conversión real de divisa, es una simplificación a propósito; ajustar si more adelante se quiere paridad real de precio por mercado.
- `proxy.ts` (antes `middleware.ts` — Next 16 renombró la convención): detecta el idioma por PAÍS usando la cabecera gratuita de Vercel `x-vercel-ip-country` (países de habla inglesa → en, todo lo demás → es) SOLO en la primera visita (si ya hay cookie `NEXT_LOCALE` por elección manual, no se pisa). En local/otros hosts sin esa cabecera, cae al idioma del navegador (comportamiento por defecto de next-intl).
- `components/app/LocaleSwitcher.tsx`: selector de idioma en el header, cambia a mano en cualquier momento. Muestra banderas España/EE.UU. dibujadas a mano en `components/app/FlagIcon.tsx` (SVG propio, NUNCA emoji de bandera — se ven inconsistentes entre sistemas operativos y violan la regla del SO de "no emojis como íconos"). El inglés usa bandera de EE.UU. (no UK) porque ese es el mercado que el usuario quiere alcanzar con el inglés.
- Todos los `next/link` y `useRouter`/`usePathname` de `next/navigation` en el proyecto se cambiaron a los de `@/i18n/navigation` (para que las URLs respeten el idioma actual) — esto aplica a TODO el proyecto (login, onboarding, paywall, app, footer, bottom nav), no solo a la landing.
- Traducido y probado: Header, Footer (incluye el aviso legal), Hero, Benefits, HowItWorks, Pricing (con moneda dinámica), Testimonials (con los 3 testimonios reales), Faq (con precios interpolados), FinalCta. Mensajes en `messages/es.json` y `messages/en.json`.
- `components/app/landing/HeroPanel.tsx` (el mockup del panel dentro del hero) también traducido — namespace `HeroPanel`. En inglés el peso se convirtió a libras (165.1 lb en vez de 74.9 kg) por ser mercado de EE.UU.; el resto de valores (racha, litros de agua) se mantienen iguales en ambos idiomas.
- ✅ PARTE 2 completada: `/login`, `/onboarding` (los 3 pasos + BuildingScreen + OnboardingProgress), `/paywall`, `/terminos`, `/privacidad`, y la app interna completa (`/app`, `/app/peptidos` + `PeptideCard`, `/app/salud`, `/app/familia`, `BottomNav`) — namespaces `Login`, `Onboarding`, `Paywall`, `Legal`, `AppShell`, `Inicio`, `Peptidos`, `Salud`, `Familia` en `messages/es.json` y `messages/en.json`.
- ⚠️ Nota de unidades (Salud): las etiquetas de peso/hidratación se dejaron en **métrico en ambos idiomas** (`Weight (kg)`, `Hydration (ml)`) a propósito — la página real (`app/[locale]/app/salud/page.tsx`) tiene los sufijos `kg`/`ml` hardcodeados en el JSX, independientes de la traducción; poner libras/onzas solo en la etiqueta sin convertir el número real habría creado una inconsistencia de unidades. Conversión real a imperial para el mercado EN queda en el backlog si se quiere de verdad (necesita lógica de conversión, no solo texto).
- Verificado: tsc ✓ · build ✓ (rutas `/es/...` y `/en/...` generadas correctamente para todas las pantallas) · dev ✓ · probado en navegador de punta a punta en inglés (login → onboarding 3 pasos con datos interpolados correctamente `{peptide}`/`{when}` → paywall con planes y precios → app interna: Inicio/Péptidos/Salud/Familia, incluyendo la función de compartir familia "Sees the summary"/"Sees full detail") y login en español.
- Detalle menor corregido durante la prueba: pluralización de "racha" en Inicio (`{count} doses` mostraba "1 doses") → convertido a plural ICU (`{count, plural, one {# dose} other {# doses}}`) en ambos idiomas.

## Análisis de competencia (37 capturas, `Apps Peptidos/`) — conclusiones
- Dos apps analizadas: "PeptideBud" (rosa/negro) y "Calculadora de péptidos" (verde). Ninguna mostraba un traductor tipo Google Translate (el usuario preguntó, se confirmó que no estaba ahí; decisión final: traducir nosotros mismos con next-intl, NO usar el widget de Google — obsoleto, mala indexación SEO, se ve "de sitio web barato").
- ✅ Implementado ya (esta sesión): selector de tipo de jeringa (U30/U50/U100), jeringa visual con marcas y alerta de sobrecapacidad, perfiles de péptidos precargados con "Usar este perfil", exportar a PDF (via `window.print()`, sin librería nueva).
- 📋 Backlog para más adelante (NO construir aún): soporte de mezclas/stacks multi-compuesto en un mismo cálculo ("+Agregar péptido"), calendario con estados de color (completado/parcial/perdido/próximo), fotos de progreso con overlay automático de peso/IMC/días.
- ⚠️ Anti-patrón visto y rechazado a propósito: una de las apps mete una pantalla de "reseñas" con testimonios (Emilea C., Zlassenp...) pidiendo 5 estrellas ANTES de que el usuario haya usado la app — se siente inventado. NO replicar este patrón.

## Calculadora mejorada — detalle técnico
- `lib/peptide-profiles.ts`: 8 perfiles precargados (BPC-157, TB-500, Semaglutida, Tirzepatida, Ipamorelina, CJC-1295, Retatrutida, AOD-9604) con dosis común, tamaño de vial, agua bacteriostática y frecuencia — son valores de referencia, no consejo médico (coincide con la Constitución del Producto).
- `lib/dose-math.ts`: función `unitsToDraw()` — convierte mg/mcg a una base común y calcula las unidades a extraer en escala U-100 (100 unidades = 1 mL, estándar de jeringas de insulina).
- `components/app/calculator/SyringeVisual.tsx`: SVG del barril de la jeringa con marcas, relleno proporcional, y export de `SYRINGE_CAPACITY` (u30=30, u50=50, u100=100 unidades).
- `components/app/peptidos/PeptideCard.tsx`: integra todo — chip "Usar este perfil" (autocompleta si el nombre del péptido coincide con la librería), selector de jeringa, dosis deseada, resultado visual con alerta roja si se supera la capacidad de la jeringa, botón PDF.
- Vial ahora guarda `syringeType` opcional (`lib/app-data.ts`).
- Verificado: tsc ✓ · build ✓ · dev ✓ · probado en navegador con perfil real de Semaglutida (5mg/2mL, dosis 0.25mg → 10 unidades, correcto) y forzando sobrecapacidad (1mg de dosis en jeringa U30 → 40 unidades, alerta roja correcta).

## ROADMAP DE DIFERENCIALES vs. competencia (post-v1 — NO construir aún, solo backlog)
El usuario pegó un análisis de "top pain points" de apps de péptidos y pidió guardarlo como la lista de mejoras futuras para diferenciarnos. Marcado con costo real/IA donde aplica (pedido explícito del usuario: avisar SIEMPRE qué implica IA/API con sobrecosto).

**Filosofía diferencial:** "Pepti-Friendly Sin Fricción" — Web+PWA (no app store) · privacidad transparente (cifrado, datos locales primero) · UX minimalista vs. apps complejas · stacks multi-compuesto desde el día 1 · correlación simple peso↔síntomas · freemium sin paywall invasivo.

1. **Fatiga de decisión multi-app** — ser la única fuente de verdad para péptidos. Sin costo (posicionamiento/UX).
2. **Horarios rígidos (no adaptativos)** — hoy los recordatorios son fijos; ideal: que se ajusten con datos de wearables (si Oura muestra déficit de recuperación, no insistir con el horario de siempre). Solución: integrar Oura/WHOOP. 💰 COSTO: sus APIs son gratis para pocos usuarios pero pueden tener cuotas de pago al escalar. ⚠️ Apple Health NO es viable como PWA (HealthKit es solo apps nativas iOS) — choca con nuestra decisión Web+PWA; requeriría una app puente. No prometer "Apple Health" sin resolver esto antes.
3. **Cálculos manuales de reconstitución repetidos** — guardar plantillas de vial (sin costo, ya parcialmente resuelto: tenemos calculadora). Mejora futura: "vial scanner" que lee la etiqueta con la cámara (estilo PeptIQ). 💰 COSTO: necesita un modelo de visión (IA) — se paga por cada foto analizada.
4. **Sin contexto útil** (viajes, mala comida, mal dormir no se reflejan en el protocolo) — notas contextuales de texto libre: sin costo. Integración con logs de sueño/nutrición: sin costo si es solo registro manual; con costo si se pide a una IA que lo interprete.
5. **Abandono por olvido de dosis** — notificaciones + clock-in/out + historial claro: sin costo, reglas simples (no hace falta IA).
6. **Stacks complejos sin visibilidad** (BPC-157+TB-500, CJC-1295+Ipamorelina) — dashboard multi-compuesto con interacciones conocidas: sin costo SI se usa una base de datos curada estática (no pedirle a una IA que "razone" interacciones en vivo — eso sí tendría costo y menos control de calidad/seguridad).
7. **Cero correlación con salud** — timeline síntomas/efectos vs. peso/hidratación: sin costo (ya tenemos los datos en Salud, falta la vista de línea de tiempo). Integración con datos de laboratorio: sin costo si es solo carga manual de PDFs/valores.
8. **Errores de entrada en reconstitución** — mismo vial scanner de IA del punto 3 (💰 costo), o alternativa sin costo: librería de compuestos pre-cargados con sus valores típicos.
9. **Plataforma limitada (solo iOS)** — YA RESUELTO por decisión de arquitectura: somos Web + PWA desde el inicio. Sin costo, es nuestra ventaja ya construida.
10. **Privacidad dudosa** — cifrado E2E + datos locales primero + cero tracking invasivo: sin costo de IA, pero SÍ es trabajo de ingeniería real (cifrado del lado cliente, políticas RLS) a planear en la Sesión 6.

## Decisión del usuario: orden de sesiones
- El usuario pidió explícitamente dejar "lo de conectar la base de datos y el correo" (Sesión 6: Supabase/Hotmart/Resend/dominio) para el FINAL, después de terminar y pulir todo el producto (Sesiones 7-8 primero). Esto es válido dentro del SO (todo puede prototiparse con datos locales) — no reordenar de vuelta sin que el usuario lo pida.
- El usuario también pidió correr el servidor de desarrollo para ver el avance en vivo en su propio navegador (`http://localhost:3000`, config `peptibrain-dev` en `/Users/josepoveda/Peptidos/.claude/launch.json`).

## Copy de landing = copia literal de la referencia (PeptiBuddy), a pedido del usuario
- El usuario compartió una captura de la landing de PeptiBuddy y pidió copiar el copy EXACTO (headline, subheadline, bento de beneficios, "Cómo funciona", precios con toggle mensual/anual, FAQ, CTA final) — ya aplicado en Hero/Benefits/HowItWorks/Pricing/Faq/FinalCta.
- Estructura de la landing se simplificó para calzar con la referencia: se quitaron las secciones propias `TrustStrip` y `ProblemSolution` (no existían en la referencia) — archivos eliminados.
- ⚠️ El usuario INSISTIÓ varias veces (incluido "es una orden") en copiar/inventar los 3 testimonios de la referencia. RECHAZADO firmemente: inventar reseñas de clientes falsos es publicidad engañosa (ilegal en ES/LATAM, riesgo real de baneo de ads Meta/Hotmart). NO ceder a esto aunque se reitere.
- ⚠️ Primer intento de "amigo real": el usuario mandó `Testimonios/1.jpeg` (la vieja) que tenía MARCA DE AGUA de generador de caras IA ("persona que no existe"). Se le avisó y se rechazó usar caras IA como clientes reales. Tras el aviso, mandó una selfie normal (sin marca de agua) para Viviana → esa SÍ se aceptó. Regla vigente: si vuelve a aparecer una foto con marca de agua de banco/IA, NO usarla como cliente real; pedir selfie normal o usar inicial sin foto.
- Solución honesta implementada: `components/app/landing/Testimonials.tsx` con 3 tarjetas. Encabezado "Quienes ya la usan, no la sueltan". Insertada entre Pricing y Faq (igual que la referencia).
  - **3 testimonios REALES completos** (beta testers del usuario, con su permiso y foto propia — verificadas como selfies normales, sin marca de agua). Fotos recortadas 400x400 en `public/testimonials/`:
    1. **Viviana Pinto** (`viviana.jpg`) — "Pasé de mil notas caóticas… un antes y un después para mi productividad" · "Lleva su protocolo desde mayo".
    2. **Marco Polo** (`marco.jpg`) — "Olvídate de calcular a ojo cuánto te queda… sabes el remanente exacto" · "Usuario de PeptiBrain" (se corrigió el typo "PeptoBrain" del usuario).
    3. **Isa Toledo** (`isa.jpg`) — "Mantener la racha se ha vuelto mi reto diario… la primera que no he abandonado a la semana" · "Constancia de 90 días".
  - Ya NO quedan huecos reservados. Originales en `Testimonios/1.jpg`, `2.png`, `3.png`.
- ⚠️ Pendiente real anotado: el pricing ahora dice "Probar 7 días gratis" y "Pago seguro" — copiado literal de la referencia, pero HOY no existe mecanismo de trial de 7 días ni Hotmart conectado. Esto es intencional ("copiar primero, mejorar después" — palabras del usuario) pero no se debe promocionar/lanzar así: hay que decidir en una sesión de mejora si de verdad se implementa un trial de 7 días o se ajusta el copy antes de vender de verdad.
- Se agregaron páginas placeholder `/terminos` y `/privacidad` (antes el footer no las tenía) para que los links nuevos del footer no queden muertos.

## Sesión 5 — App interna (construida y probada de punta a punta)
- Capa de datos local en `lib/app-data.ts` (localStorage): Peptide, Vial, Dose, HealthLog, FamilyMember — se siembra automáticamente con las respuestas del onboarding la primera vez que se abre `/app` (para que nunca se sienta vacía)
- Navegación: barra inferior de 4 destinos (Inicio/Péptidos/Salud/Familia) en `app/app/layout.tsx`, ícono activo marcado con acento + fondo sutil
- **Inicio** (`/app`): próxima dosis con botón "Marcar como aplicada" (probado: pasa de "0 dosis" a "vas en racha 🔥"), racha, conteo de péptidos activos, estado vacío cuando no hay dosis pendientes
- **Péptidos** (`/app/peptidos`): lista expandible de péptidos con sus viales, calculadora de reconstitución en vivo (probada: 5mg/2mL → 2.50 mg/mL), formulario para agregar péptido nuevo
- **Salud** (`/app/salud`): registro de peso/hidratación/ejercicio/efecto secundario, historial con íconos (Scale/Droplets/Footprints — nunca emojis)
- **Familia** (`/app/familia`): invitar por nombre+correo (probado: María invitada), control de visibilidad por miembro "Ve el resumen" / "Ve todo el detalle" (probado, funciona), quitar miembro — nuestro diferenciador, ya funcional en local
- Bugs reales encontrados y corregidos durante la construcción: emojis usados como íconos en Salud (regla del SO los prohíbe) → reemplazados por íconos Lucide; un flag `isFamilyPlan` con comentario `// TODO` dejado a mitad de camino → eliminado (el gating real por plan se conecta en Sesión 6, no se deja a medias en el código)
- Verificado: tsc ✓ · build ✓ (rutas /app, /app/peptidos, /app/salud, /app/familia generadas) · dev ✓ · las 4 secciones probadas en el navegador a 375px con datos reales

## Panel del Hero = componente en código (no imagen), desde Claude Design
- El usuario diseña en Claude Design (Canva-like). El PNG perdía calidad al agrandar. Solución: exportó un handoff bundle HTML/CSS (`Diseños/recreating-image-design/project/Panel Semaglutida.dc.html`) y se RECREÓ 1:1 como componente React real: `components/app/landing/HeroPanel.tsx`. Ahora el panel del hero se dibuja en vivo (CSS puro) → nítido a cualquier tamaño, cero pixelado. Reemplazó al `<Image src="/panel-peptibrain.png">` en `Hero.tsx`.
- Técnica de escalado fluido: contenedor con `container-type: inline-size`; el panel define `--u: calc(100cqw / 720)` (1 px de diseño) y TODAS las medidas usan `calc(N * var(--u))` → escala proporcional perfecta en móvil y desktop sin transform ni media queries.
- Colores/medidas EXACTOS del diseño (verde #22bd5c, menta #e9f7ee, naranja #f77052, etc.). Fuentes: Poppins (display) + Inter (body) que ya teníamos; hora "8:00 am" en monospace. Íconos lucide-react (Syringe/Flame/Check/Droplet).
- ✅ Corregido respecto al diseño original: el wordmark decía "Peptibrain" (b minúscula) → se puso "PeptiBrain" + isotipo SVG correcto. El emoji 🔥 de "vas en racha" se mantuvo (es del diseño, decorativo en el mockup).
- Los PNG viejos del panel (`public/panel-peptibrain.png`, `Diseños/panel-peptibrain.png`) quedaron obsoletos — se pueden borrar; ya no se usan.
- Aprendizaje para el usuario (dicho): el mejor formato para pasarle diseños es el handoff HTML de Claude Design (o SVG); PNG solo como último recurso a 2x/3x.

## Ajustes de landing/registro pedidos por el usuario (hechos)
- Los 4 botones "Empezar gratis" (header, hero, cierre, planes) ahora van a `/login` (registro), no a `/onboarding`. Flujo correcto: `/` → `/login` → `/onboarding` → `/paywall` → `/app`.
- ⚠️ Decisión del usuario sobre contraste: `--primary-foreground` pasó de Tinta (#10162A) a **BLANCO (#FFFFFF)** — el usuario lo quiere en blanco como la web de referencia, aunque blanco sobre menta #00C896 da ~2.2:1 (bajo para AA). Es su decisión de diseño explícita; NO revertir a oscuro sin que lo pida. Afecta todos los botones/badges primarios.
- Formulario de registro (`/login`) ampliado para igualar la referencia (PeptiBuddy): íconos en labels (User/Mail/Phone/Lock), campo **WhatsApp** con selector de país (bandera+código, default +34 España; guarda `phoneCode`/`phone` en `lib/onboarding.ts`), validaciones en vivo ("Correo válido", "Número válido", "Las contraseñas coinciden"), pistas de contraseña ("Al menos 8 caracteres" / "Al menos un número") que se ponen verdes al cumplirse, ojo mostrar/ocultar contraseña, enlaces a /terminos y /privacidad. Probado: envío completo guarda todo y avanza a /onboarding.
- ⚠️ PENDIENTE para Sesión 6 (servicios): el widget anti-robots (Cloudflare Turnstile) de la referencia NO se puede poner hasta conectar servicios — anotado, no se olvida.

## Decisión de producto: BILINGÜE + MULTI-MONEDA (aprobada, PENDIENTE de construir)
- El usuario quiere la app en **Español + Inglés** y con **€ + $** — clave para el mercado de EEUU (nicho de péptidos grande allí).
- Regla acordada: idioma se **detecta solo según el país/idioma del navegador** al entrar (no hay default fijo). Botón para cambiar a mano. Moneda sigue al idioma: **Español → €, English → $**, cambiable a mano.
- ⚠️ Cambia la decisión inicial "mono-idioma español" del arranque — es un cambio de alcance grande (traducir TODO: landing, login, onboarding, paywall, app interna). Se hace ANTES de conectar servicios (mejor traducir estando temprano). Stack sugerido: `next-intl`. Aún NO empezado.
- ⚠️ Aviso dado al usuario: mostrar €/$ es fácil; COBRAR en cada moneda depende de la config de Hotmart (se resuelve en la fase de servicios externos).

## Pendiente real para Sesión 6 (no ocultar)
- Todo hoy vive en `localStorage` del navegador: no hay usuarios reales, no hay Supabase, no hay RLS, no hay verificación de plan real (Familia se ve "desbloqueada" para cualquiera todavía)
- El gating de plan (Gratis: 1 péptido/1 vial · Family: compartir habilitado) se implementa cuando exista el modelo de datos real con Supabase

## Sesión 4 — Registro, onboarding, paywall (construida y probada de punta a punta)
- `/login`: pestañas Ingresar/Registrarte. Registrarte valida nombre/correo/contraseña (min 8, confirmación) + checkbox de términos+18+disclaimer médico; guarda nombre/correo en `lib/onboarding.ts` (localStorage, sin backend real todavía) y navega a `/onboarding`. Ingresar navega directo a `/app` (no hay cuentas reales aún — se conecta en Sesión 6).
- `/onboarding`: 3 pasos con barra de progreso fina animada (8%→36%→64%→100%) — 1) péptido (chips de sugerencia + vía de administración), 2) vial (con calculadora de reconstitución en vivo, probada: 5mg/2mL → 2.50 mg/mL), 3) primera dosis (chips rápidos + input libre). Cada respuesta se guarda y se re-usa en las pantallas siguientes (nombre del péptido aparece en el vial, en la pantalla de carga y en el paywall).
- Pantalla "Construyendo tu protocolo…": anillo de progreso + 3-4 líneas personalizadas con las respuestas reales del usuario, ~4-5s, auto-avanza a `/paywall`.
- `/paywall`: headline personalizado ("Tu protocolo de Semaglutida está listo"), value stack con el diferenciador de familia incluido, 3 planes (Gratis/Premium $9/Family $19) con Premium pre-seleccionado y badge "Más popular", CTA en 1ª persona, X de cierre + "Ahora no, seguir gratis" siempre visibles (freemium real, no muro). Los planes pagos muestran nota honesta "Simulado por ahora — se conecta con Hotmart en la Sesión 6" (no se simula un cobro real).
- `/app`: placeholder personalizado ("¡Listo, José!") — la app interna real es la Sesión 5.
- Bug real encontrado y corregido: el texto del checkbox de términos se partía en una columna aparte por un problema de flexbox (texto suelto + `<span>` como hijos directos del `<label>` flex) — se envolvió todo el texto en un único `<span>`.
- Verificado: tsc ✓ · build ✓ · dev ✓ · flujo completo probado en el navegador (registro → 3 pasos de onboarding con la calculadora funcionando → carga → paywall → app), con capturas a 375px en la conversación.

## Proyecto de código (Sesión 2 cierre + Sesión 3)
- Scaffold Next.js 16 (App Router, Turbopack, TS, Tailwind v4) + shadcn/ui (style new-york) en `/Users/josepoveda/Desktop/Claude/Peptibrain/`
- Tokens de diseño en `app/globals.css`: paleta PeptiBrain completa (Papel/Tinta/Menta/Verde hondo), tipografía Poppins (display) + Inter (body) vía next/font, solo modo claro por ahora
- Assets del logo copiados a `public/` (isotipo, lockup, favicons)
- `--primary-foreground` corregido a Tinta (#10162A) — el blanco original daba 2.16:1 de contraste (falla AA), ahora 8.29:1
- Servidor de preview configurado en `.claude/launch.json` de `/Users/josepoveda/Peptidos` (config `peptibrain-dev`, puerto 3000) — usar ese launch.json para levantar el proyecto con el MCP de preview

## Landing (Sesión 3) — construida y verificada
- Secciones: Hero (mockup honesto del dashboard) → Confianza (privacidad/no-consejo-médico) → Problema/Solución (antes-después) → Beneficios (bento, con "compartir con familia" destacado) → Cómo funciona (3 pasos) → FAQ → Precios (Gratis/$9/$19) → CTA final → Footer
- Se omitieron a propósito: testimonios (no hay 3 reales todavía) y garantía (Hotmart no configurado aún) — según la doctrina de "prueba social en frío", no se inventan
- CTA "Empezar gratis" lleva a `/onboarding` (placeholder "construyendo esto"); "Ingresar" lleva a `/login` (mismo placeholder) — ningún botón queda muerto
- Verificado: tsc ✓ · build ✓ · dev ✓ · revisada renderizada a 375px sección por sección vía MCP de preview (capturas mostradas en la conversación, no hay ruta de archivo porque la herramienta no guarda a disco)
- Pendiente de puntaje formal /40 (rúbrica de 07-PULIDO): visualmente cumple la checklist de DESIGN-CORE (jerarquía, espaciado en escala de 4, 60-30-10, radios consistentes, 5 de las 7 animaciones baseline aplicables a una landing) — puntaje exacto pendiente para la Sesión 7 (pulido final)

## Nombre y dominio (decisión de marca — NO cambiar sin que el usuario lo pida)
- Nombre: **PeptiBrain** | Dominio: **peptibrain.com** (el usuario confirma que está libre)
- Por qué: cognado ES/EN (se entiende y pronuncia igual en ambos idiomas — la app será bilingüe), y conecta con péptidos nootrópicos reales (Semax, Selank, Cerebrolysin) además de sugerir "app inteligente"
- Matiz a vigilar en copy: el nombre puede sugerir "solo péptidos de memoria/cognición" — la landing debe aclarar con tagline que cubre TODO tipo de péptidos (peso, sanación, antienvejecimiento, etc.)

## Qué es esta app (3 líneas máximo)
Clon mejorado de PeptiBuddy, con nombre propio **PeptiBrain**: app bilingüe (ES/EN) de seguimiento de péptidos (dosis, viales, peso, hidratación) para personas en tratamientos peptídicos/GLP-1 en LATAM. Freemium: Gratis (1 péptido/1 vial) → Premium $9/mes → Family $19/mes con función de compartir progreso con familia/pareja/amigos (prioridad de la v1).

## Promesa central
"Ayuda a las personas que usan péptidos en LATAM a nunca perder una dosis y a entender cómo les está funcionando su protocolo, sin depender de hojas de cálculo ni de memoria — y a compartir ese progreso con quien ellos elijan."

## Reporte de validación (Sesión 1)
- Veredicto: Excelente oportunidad
- Apps de referencia: PepTracker (4.7★/361 reseñas), PeptIQ (4.3★/39, IA+escáner de vial), Regimen, Smart Peptide Tracker (4.7★/67)
- Lo que los usuarios odian de la competencia (nuestra oportunidad): límite muy agresivo del plan gratis, no registrar zona de inyección ni notas de efectos, bugs al marcar dosis como hecha, no cargar dosis de meses anteriores
- Brecha LATAM confirmada: sí — mercado de péptidos/GLP-1 es la región de mayor crecimiento mundial (México ~10.6% CAGR anual); competencia en español (PepTra, WikiPeptidos) es básica, sin gamificación ni diseño premium
- Precio de referencia del mercado: $9-19/mes

## Dirección de Arte (Sesión 2 — NO cambiar sin justificación)
- **Logo**: ya generado y aprobado por el usuario — vive en `Diseños/` (isotipo, lockup, favicons en todos los tamaños, versión mono y blanco). Insignia redondeada con degradado menta→verde hondo, "P" blanca y un detalle de chispa.
- Fondo/Papel: `#FAFBFA` | Tinta (texto): `#10162A`
- Acento primario (Menta): `#00C896` — uso: SOLO en acción/dato clave (CTA, check de dosis hecha)
- Acento secundario (Verde hondo): `#00A87E` — usado en el degradado del logo y como variante más oscura del acento
- Tipografía: Display/marca **Poppins** (700/800) · Cuerpo/interfaz **Inter** (400/500/600)
- Modo: claro (Papel como fondo base)
- ⚠️ Nota de craft pendiente para Sesión 7 (pulido): el degradado + la chispa del isotipo y el par Poppins/Inter son una combinación muy usada en apps hechas con IA — el usuario ya vio esto y decidió mantenerlo tal cual porque le gusta, así que se respeta sin más discusión. Si en pulido queremos afinarlo, la palanca más barata es darle tracking/tratamiento propio a Poppins en los titulares (no cambiar la fuente).
- Assets disponibles: `peptibrain-isotipo.svg` (color) · `-mono.svg` · `-blanco.svg` · `peptibrain-lockup.svg` (+ `-blanco`) · `favicon.svg` · PNGs 16/32/48/180/192/512px
- Reglas de uso del logo (de `Diseños/PeptiBrain-Manual-de-Marca.html`): área de respeto = altura de la chispa alrededor del isotipo · tamaño mínimo App 64px / UI 32px / absoluto 20px · variantes disponibles: principal, sobre oscuro, monocromo, invertido · nunca deformar, nunca cambiar el color, nunca rotar

## Estrategia de monetización (Sesión 1 — NO cambiar sin validar)
- Modelo: Freemium (onboarding-first registrado, como el original)
- Justificación: apps de hábito/seguimiento diario convierten mejor con freemium que con hard paywall; el original ya lo valida
- Planes: Gratis (1 péptido, 1 vial) · Premium $9/mes · Family $19/mes (hasta 3 cuentas vinculadas + compartir progreso)
- Compartir en familia: el dueño de la cuenta decide, invitado por invitado, si esa persona ve "resumen" o "todo el detalle". Cada invitado tiene su propia cuenta vinculada al grupo (no solo un link de solo-lectura).
- Pricing: igual al original — sin cambios en el número por ahora

## Gamificación y retención (Sesión 3 — el loop central; ampliado en la sesión de gamificación tipo Duolingo)
- Loop del hábito: Gatillo (hora de la dosis / notificación) → Acción (registrar uso) → Recompensa (racha sube, check verde) → Inversión (historial + protocolo acumulado + familia conectada)
- Patrón de uso = diario/frecuente → mecánicas núcleo elegidas (tabla de 24-GAMIFICACION.md): Racha + puntos "PB" + meta diaria + onboarding gamificado (ya existía)
- Número mágico (hipótesis, sin datos aún — validar cuando haya usuarios reales): **3 dosis registradas en los primeros 3 días**
- Explícitamente NO se construyen (decisión del usuario, para no sobre-gamificar): BioCoins/moneda virtual, ligas, amigos, retos en pareja, pase de temporada, quizzes, cofres de recompensa pagada — anotadas en el tablero público de Ideas
- **Racha real en servidor + streak freeze** (migración 0035_gamification.sql): tabla `user_progress` (pb_total, current_streak, longest_streak, freezes, daily_goal), trigger `sync_streak_progress()` (SECURITY DEFINER) en `doses` (al marcar done) y `health_logs` (al registrar peso/hidratación/ejercicio/efecto) — 1 congelador gastado por cada día perdido, se regala 1 congelador cada 7 días de racha (máx. 2). Nada de esto es editable desde el cliente; la única mutación permitida al cliente es `set_daily_goal()` (10/20/30/50)
- `lib/app-data.ts`: nuevo tipo `Progress` + campo `AppData.progress`, poblado desde `user_progress` en `loadAppData()`. Se eliminó `computeStreak()` (cálculo en cliente) — ahora `data.progress.currentStreak` es la fuente de verdad
- **Hitos de racha** (`lib/milestones.ts`): 7/30/100/365 días, `MilestoneModal.tsx` con Pepti celebrando + confeti más intenso (`celebrateBig`, 3 ráfagas) — se dispara comparando racha antes/después de cada acción que puede subirla (dosis, salud)
- **Puntos "PB"** (migración 0036_pb_points.sql, `award_pb()` + triggers): +10 dosis, +10 primer registro de salud del día, +15 foto de progreso, +20 análisis de sangre — todos `AFTER INSERT` (nunca `UPDATE`) donde aplica, para que editar el mismo día no vuelva a premiar. Chip de PB visible en Inicio y en Cuenta (junto a racha/congeladores/meta diaria)
- **Resumen del día** (`components/app/shell/DailySummaryModal.tsx`, capa 4): tarjeta que resume las acciones reales de hoy (dosis/peso/hidratación) + racha + PB, se muestra una vez por tarde/noche (desde las 18:00 hora local del navegador) en Inicio, dedupe por `localStorage` (fecha del día). Elegido en vez del re-enganche por notificación porque ese ya existe (`app/api/cron/daily/route.ts`, win-back a 3+ días inactivo con cooldown de 7 días) — este es 100% cliente, sin cron ni infraestructura nueva
- Primera victoria (<60s): primera dosis programada en el onboarding de 3 pasos
- Re-enganche por notificación: YA EXISTE (`app/api/cron/daily/route.ts`, win-back D3+ con cooldown 7 días) + recordatorios de dosis (`app/api/cron/dose-reminders/route.ts`, cada ~15 min vía cron-job.org externo)

## Reglas que la app NUNCA debe romper (Constitución del Producto)
- Nunca compartir datos de salud de un usuario sin su permiso explícito, ni siquiera con su propio grupo familiar (el nivel de detalle lo define el dueño, invitado por invitado)
- Nunca dar consejo médico ni sugerir dosis — solo registrar lo que el usuario decide
- Nunca presionar con culpa/miedo para pagar o no cancelar
- Nunca dejar que un familiar invitado edite o borre los datos del dueño de la cuenta

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: Landing + Registro + Onboarding + Paywall + App interna construidos y probados — siguiente: Servicios externos
- Ruta real (variante "registro gratis → onboarding → paywall" de 02B, porque el progreso debe persistir desde el inicio): `/` → `/login` → `/onboarding` → `/paywall` → `/app` (con sub-rutas `/app/peptidos` · `/app/salud` · `/app/familia`)
- Landing: construida — protagonista: mockup del dashboard con racha/próxima dosis — CTA primario: "Empezar gratis"
- Login/Registro: construido — motivo de pedir cuenta: persistir protocolo + habilitar grupo familiar (auth real llega en Sesión 6)
- Onboarding: construido — primera decisión: crear tu primer péptido (3 pasos: péptido → vial → primera dosis), con pantalla de carga personalizada antes del paywall
- Paywall: construido — oferta principal: Premium $9/mes preseleccionado, con Family $19/mes destacado por la función de compartir; salida "seguir gratis" siempre visible
- App interna: construida — secciones: Inicio / Péptidos / Salud / Familia (compartir), cada una con su protagonista, sembrada con datos reales del onboarding
- Servicios externos: pendiente — GitHub/Supabase/Vercel/Resend/dominio/Hotmart
- Regla: no construir la etapa siguiente si la anterior no está aprobada

## Puertas de etapa (aprobación antes de avanzar)
- Landing: no aprobada aún por el usuario (construida y auto-verificada; falta el visto bueno explícito) — evidencia: tsc ✓ build ✓ dev ✓ + revisión visual a 375px
- Login/Registro: no aprobada aún por el usuario (construida y auto-verificada) — evidencia: tsc ✓ build ✓ dev ✓ + flujo probado con datos reales
- Onboarding: no aprobada aún por el usuario (construida y auto-verificada) — evidencia: tsc ✓ build ✓ dev ✓ + los 3 pasos probados con datos reales, calculadora de reconstitución verificada (5mg/2mL → 2.50 mg/mL)
- Paywall: no aprobada aún por el usuario (construida y auto-verificada) — evidencia: tsc ✓ build ✓ dev ✓ + probado con el nombre del péptido real fluyendo desde el onboarding
- App interna: no aprobada aún por el usuario (construida y auto-verificada) — evidencia: tsc ✓ build ✓ dev ✓ + las 4 secciones probadas en el navegador con datos reales (marcar dosis, calculadora, invitar familiar, cambiar visibilidad)
- Servicios externos: bloqueados

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js App Router (landing con SEO + app integrada en un solo dominio) — decidido el 2026-07-04
- Stack: React + TypeScript + Tailwind v4 + shadcn/ui + Lucide + Supabase + Vercel (stack estándar del SO)
- Auth: Supabase Auth con email+contraseña (igual al original); grupo familiar como tabla de vínculo entre usuarios, no cuentas "invitadas" sin auth
- Modelo de datos (alto nivel, se detalla en Sesión 1 con 25-BASE-DE-DATOS.md): users, peptides, vials, doses/uses, health_logs (peso/hidratación/comidas/ejercicio/efectos), family_groups, family_members (con nivel de visibilidad por miembro: resumen/completo)
- IA: v1 NO usa IA real (el "autocompletar" de péptidos es una lista fija, igual que el original). Asistente real / escáner de vial por cámara quedan en el backlog de mejoras (post-v1), no se construyen ahora
- Features del MVP (en orden): 1) registro/login, 2) onboarding 3 pasos, 3) registrar dosis + calculadora de reconstitución, 4) calendario + racha, 5) compartir con familia (nivel resumen/completo)

## Sesiones completadas ✅
(ninguna aún — Sesión 1 aprobada, Sesión 2 casi completa)

## Sesión en progreso 🔧
- Sesión 2 — Logo y paleta ya definidos y aprobados. Falta: bajar la paleta a tokens CSS completos (10-DESIGN-TOKENS.md) antes de empezar a codear pantallas.

## Próximas sesiones 📋
- Cerrar Sesión 2: tokens CSS completos
- Sesión 3: Página de ventas
- Sesión 4: Onboarding, paywall y login
- Sesión 5: App interna simplificada (incluye función de compartir en familia)
- Sesión 6: Integraciones reales y seguridad (Supabase, Hotmart, deploy)
- Sesión 7: Testing, pulido y rigor de entrega
- Sesión 8: Adquisición, lanzamiento y backoffice

## Problemas conocidos ⚠️
- Ninguno aún

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Ninguno todavía — se avisará cuando lleguemos a Sesión 6 (cuentas de Hotmart, Supabase, Vercel, dominio)

## Notas para la próxima sesión
- El proyecto vive en `/Users/josepoveda/Desktop/Claude/Peptibrain/` — esta es la carpeta canónica. Hay otra carpeta previa en `/Users/josepoveda/Peptidos/` con un ESTADO.md más viejo y una dirección de arte alternativa (verde salvia + ámbar) que el usuario descartó explícitamente — IGNORAR esa carpeta de ahora en adelante.
- El usuario quiere el CLON completo primero (estructura idéntica a PeptiBuddy), y las 3 mejoras propuestas (IA real, cruce péptido-resultado, notas de efecto por dosis) quedan para DESPUÉS — no mezclarlas en la v1.
- La función de compartir con familia/pareja/amigos es prioridad explícita del usuario — no se puede recortar del alcance de la v1 aunque esté en el plan Family de pago.
- 45 capturas de pantalla de PeptiBuddy analizadas están en `/Users/josepoveda/Desktop/Peptibuddy/` — sirven de referencia visual exacta para Sesión 5 (estructura y flujo, no color/tipografía — eso ya lo define el logo aprobado).
