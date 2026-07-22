# ESTADO — PeptiBrain
Última actualización: 2026-07-22 | Sesión 9 (seguridad + retención + certificación + Gemini + panel: logo/integraciones). TODO commiteado y desplegado. Migraciones 0003-0028 corridas y confirmadas; **0029 (`app_settings`) PENDIENTE de correr**.

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

## Gamificación y retención (Sesión 3 — el loop central)
- Loop del hábito: Gatillo (hora de la dosis / notificación) → Acción (registrar uso) → Recompensa (racha sube, check verde) → Inversión (historial + protocolo acumulado + familia conectada)
- Mecánicas: racha diaria, resumen semanal, próxima dosis destacada
- Primera victoria (<60s): primera dosis programada en el onboarding de 3 pasos
- Pendiente definir notificaciones de re-enganche en Sesión 3-4

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
