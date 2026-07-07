# ESTADO — PeptiBrain
Última actualización: 2026-07-07 | Sesión actual: 6 (servicios externos) — EN PAUSA para clonar PeptiBuddy exacto (ver bloque siguiente) — bloque de prioridad MUY ALTA ✅ + páginas legales ✅ + producto de Hotmart PUBLICADO (ya se puede vender de verdad)

## 🎯 INICIATIVA ACTUAL — Clonar PeptiBuddy exacto (2026-07-07, decisión explícita del usuario: "todo, exacto")
El usuario mostró `/Users/josepoveda/Desktop/Peptibuddy/` (24 capturas numeradas, 1.png-24.png) de una app de referencia y pidió que PeptiBrain iguale su estructura COMPLETA, no solo el copy de la landing (que ya se había copiado en Sesión 3). Diferencias grandes encontradas: PeptiBuddy es de ESCRITORIO (nav arriba, no bottom-nav), tiene sub-pestañas dentro de Péptidos (Usos/Péptidos/Viales/Calculadora) y Salud (Peso/Comidas/Hidratación/Efectos), candados de plan de pago visibles (Calculadora, "Asistente" IA, Hidratación, Efectos secundarios), modo oscuro, tour de 9 pasos (el actual de PeptiBrain es de 4), base de datos de péptidos con autocompletado+descripción al escribir, selector de fecha/hora real con atajos para la primera dosis (hoy es texto libre), pantalla "¡Ya casi está!" tras registro + correo de confirmación con diseño propio, y "¿Olvidaste tu contraseña?".

**Plan de 6 fases acordado con el usuario** (ejecutar en orden, verificar cada una antes de la siguiente):
1. ✅ **HECHO (2026-07-07)** — Registro/login exactos: pantalla "¡Ya casi está!" tras registro (`app/[locale]/login/page.tsx`, estado `justRegistered`, solo se activa si Supabase exige confirmación de correo), página `/restablecer-password` nueva (maneja el enlace de recuperación + detecta enlace caducado), enlace "¿Olvidaste tu contraseña?" en el login, `components/app/Header.tsx` convertido a Server Component que lee la sesión real y muestra "Ir a mi app" en vez de "Empezar gratis" si hay sesión. Plantilla de correo de confirmación con marca propia guardada en `supabase/email-templates/confirm-signup.html` (pendiente de que el usuario la pegue en Supabase → Authentication → Emails → Templates → Confirm signup).
   - ⚠️ **Pendiente del usuario**: activar "Confirm email" en Supabase → Authentication → Sign In/Providers → User Signups (hoy está apagado a propósito desde antes; el código ya soporta ambos casos, pero sin esto la pantalla "¡Ya casi está!" nunca se activa porque el registro siempre devuelve sesión inmediata).
2. ✅ **HECHO (2026-07-07)** — Onboarding mejorado: `lib/peptide-profiles.ts` ahora tiene campo `description` en los 8 perfiles originales + 4 nuevos (Cagrilintide, Adipotide (FTPP), 5-Amino-1MQ, MK-677/Ibutamoren) para calzar con los chips "Más comunes" de PeptiBuddy. `StepPeptide.tsx` muestra sugerencias en vivo (filtro por substring, ≥2 caracteres) con descripción y "Encontré N sugerencias"/"Ocultar", clic autocompleta nombre+vía. `StepDose.tsx` cambió de texto libre a `<input type="datetime-local">` real + los 3 atajos ("En 1 hora"/"Mañana 8am"/"Mañana 8pm") ahora calculan una fecha real y la formatean a un label humano (`Intl.DateTimeFormat`) que se sigue guardando como texto en `doses.when_label` (sin tocar el esquema de Supabase — decisión: evitar migración de esquema arriesgada con usuarios reales ya usando la app; si más adelante se quiere una agenda de dosis 100% ordenable por fecha real, es una migración aparte a evaluar).
3. ✅ **HECHO (2026-07-07)** — App interna reestructurada a escritorio: `TopNav.tsx` (nav de arriba, 4 pestañas Inicio/Péptidos/Salud/Familia — se mantuvo Familia aunque PeptiBuddy no la tiene, porque es diferenciador explícito de PeptiBrain) reemplaza a `BottomNav.tsx` (borrado). `ThemeToggle.tsx` + `lib/theme.ts` agregan modo oscuro real (clase `.dark` en `<html>`, persistido en localStorage, sin parpadeo gracias a un script inline en `app/[locale]/layout.tsx`). `ProfileMenu.tsx` (menú desplegable con avatar+nombre real desde Supabase, "Mi cuenta"/"Cerrar sesión") reemplaza los íconos sueltos de antes (`SignOutButton.tsx` borrado, absorbido en ProfileMenu). Paleta oscura completa en `app/globals.css`.
   - ⚠️ **Hallazgo técnico importante**: un bloque `.dark { --background: ...; }` escrito como selector de clase simple desaparecía SILENCIOSAMENTE al compilar con Tailwind v4/Lightning CSS (bug o comportamiento no documentado — probablemente relacionado con el `@custom-variant dark (&:is(.dark *))` ya presente en el archivo). Se resolvió usando el selector `html.dark { ... }` en vez de `.dark { ... }` — con eso sí compila y aplica correctamente. **Si en el futuro se necesita agregar más overrides de tema, usar SIEMPRE `html.dark`, nunca `.dark` a secas.**
   - Verificado con una cuenta de prueba real: registro → onboarding → header con nombre real + modo oscuro funcionando + las 4 pestañas navegando correctamente, en modo claro Y oscuro.
4. ⬜ Sub-pestañas dentro de Péptidos (Usos/Péptidos/Viales/Calculadora) y Salud (Peso/Comidas/Hidratación/Efectos secundarios), tarjetas de dashboard con filtros de rango de fecha (Hoy/7 días/mes/histórico).
5. ⬜ Candados de plan de pago visibles en Calculadora/Asistente/Hidratación/Efectos secundarios (el "Asistente" de IA se replica primero SOLO como botón bloqueado "próximamente" — si más adelante se quiere que funcione de verdad, esa es una decisión aparte de arquitectura de IA, no incluida en este alcance).
6. ⬜ Recorrido guiado de 9 pasos (reemplaza el de 4 pasos ya construido en `components/app/shell/AppTour.tsx`).

## Bloque de prioridad ALTA (Sesión 6, servicios externos) — progreso, EN PAUSA mientras se hace el clon de arriba
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
