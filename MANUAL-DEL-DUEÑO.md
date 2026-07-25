# Manual del dueño — PeptiBrain

Guía en simple para operar la app sin necesitar ayuda técnica para cada cosa. Guárdala, no hace falta que la entiendas toda de una vez — vuelve a ella cuando la necesites.

## 1. Cuentas que necesitas (y para qué sirve cada una)

| Cuenta | Para qué | Dónde |
|---|---|---|
| **Supabase** | La base de datos: usuarios, péptidos, dosis, pagos | supabase.com |
| **Vercel** | Donde vive la app en internet (el "hosting") | vercel.com |
| **Hotmart** | Donde la gente paga y se genera el acceso | hotmart.com |
| **Cloudflare** | Dueño del dominio `peptibrain.com` y protección anti-bots | cloudflare.com |
| **Resend** | Envía los correos (bienvenida, confirmación) | resend.com |
| **Google Gemini** | Le da "cerebro" al Asistente IA (gratis, plan `gemini-flash-latest`) | aistudio.google.com |
| **Mixpanel** | Estadísticas de uso de la app | mixpanel.com |

Todas las claves de estas cuentas viven en **Vercel → tu proyecto → Settings → Environment Variables**. Si alguna vez cambias una clave (por ejemplo, la regeneras porque se expuso), la actualizas ahí y le das **Redeploy** al último deploy para que tome el cambio.

## 2. Cómo desplegar / poner cambios en producción

Cada vez que se sube código nuevo al repositorio (a la rama principal), Vercel lo despliega solo — no tienes que hacer nada manualmente. Si algo se ve mal después de un despliegue, en **Vercel → Deployments** puedes volver a un despliegue anterior con un clic ("Redeploy" en la versión de antes).

## 3. Cómo ver qué está pasando

PeptiBrain **sí tiene un panel de administración propio**: entra a `https://peptibrain.com/panel` con tu cuenta (`josepovedaedinar@gmail.com`, la única marcada como `role='admin'`). Ahí ves de un vistazo: ventas/altas/churn, actividad real de la app (usuarios activos, adherencia, dinero rastreado por los usuarios), uso y costo del Asistente IA, salud del sistema (errores recientes agrupados), e Integraciones (Google Analytics, Mixpanel). Úsalo como primera parada antes de ir a Supabase/Hotmart directamente.

Si necesitas algo que el panel no muestra, o corregir un dato puntual, entras directo a los paneles de cada proveedor:

- **Ventas y pagos (detalle exacto)**: tu cuenta de **Hotmart** → cada compra, reembolso, y el estado de cada cliente.
- **Usuarios de la app**: en **Supabase → Table Editor → tabla `profiles`** — ahí ves cada persona registrada, su plan (`free`/`premium`/`family`) y su estado (`plan_status`).
- **Dar acceso Premium manualmente** (por ejemplo, si alguien pagó pero el sistema no lo activó solo): en Supabase, busca a esa persona en `profiles` por su correo, y cambia la columna `plan` a `premium` (o `family`) y `plan_status` a `active`.
- **Procesar un reembolso**: lo inicias desde Hotmart. El sistema debería bajar el plan de esa persona a `free` automáticamente (vía el webhook) — si no lo hizo, cámbialo tú a mano igual que arriba.
- **Uso del Asistente IA**: en Supabase → Table Editor → tabla `assistant_usage` (por persona) o `assistant_global_usage` (total de todos, por día) — o directo en el panel, pestaña "Actividad".

**Nota para sesiones futuras con Claude Code**: este proyecto tiene conectado un MCP de Supabase (herramientas `mcp__supabase__*`) que le permite a Claude ver tablas, corridas de seguridad/rendimiento, y aplicar migraciones directo, sin que tengas que pegar SQL tú mismo en el dashboard. Si en una sesión nueva esas herramientas no aparecen, basta con cerrar y volver a abrir Claude Code.

## 4. Tareas comunes, paso a paso

**Cambiar el precio**: se hace en el panel de Hotmart, en la configuración del producto/oferta. No requiere tocar código.

**Dar acceso manual a alguien** (compró por otro medio, o hubo un error): ver punto 3 de arriba.

**Pausar/cancelar a un usuario problemático**: en Supabase, tabla `profiles`, cambia su `plan_status` a `canceled`.

**Ver por qué se fue un usuario**: hoy no hay una encuesta de cancelación automática — Hotmart a veces pregunta el motivo al cancelar, revisa ahí.

## 5. RUNBOOK — "si pasa X, haz Y"

**El sitio está caído / no carga**:
1. Entra a vercel.com → tu proyecto → mira si el último deploy dice "Error" (rojo).
2. Si hay un deploy roto, dale "Redeploy" a la versión anterior que sí funcionaba (verde).
3. Si Vercel está bien pero igual no carga, revisa el status de Supabase (status.supabase.com) — puede ser un problema de ellos, no tuyo.

**Alguien pagó pero no le dieron acceso**:
1. Revisa en Hotmart que el pago diga "Aprobado".
2. Ve a Supabase → tabla `profiles`, busca su correo. Si no aparece con plan premium/family, dáselo manualmente (ver punto 3).
3. Si el correo con el que compró es distinto al que usó para registrarse en la app, ese es el problema más común — pídele que use el mismo correo, o actualízalo tú a mano.

**La factura de la IA (Gemini) se ve alta / quieres pausarla ya** (hoy el modelo configurado es gratis, así que no debería pasar, pero por si cambias de modelo):
1. El Asistente tiene un tope diario automático (`ASSISTANT_GLOBAL_DAILY_LIMIT`, hoy en 500 mensajes/día entre todos) que lo pausa solo si se supera — y si configuraste `RESEND_API_KEY` + `OWNER_ALERT_EMAIL`, te llega un correo cuando eso pasa.
2. Para pausarlo tú manualmente ya mismo: en Vercel, borra el valor de `GEMINI_API_KEY` (o pon uno inválido) y redeploy — el Asistente mostrará "no disponible" pero el resto de la app sigue funcionando normal.
3. Para bajar el tope diario, cambia `ASSISTANT_GLOBAL_DAILY_LIMIT` a un número menor en Vercel y redeploy.

**Un cliente dice que no puede entrar (login)**:
1. Pregúntale si le llegó el correo de confirmación al registrarse (revisa spam). Sin confirmar el correo, no puede entrar.
2. Si dice "contraseña incorrecta" pero está seguro que es la correcta, puede usar "¿Olvidaste tu contraseña?" en la pantalla de login.
3. Si nada de esto funciona, en Supabase → Authentication → Users puedes buscar su correo y ver si la cuenta existe y está confirmada.

**El webhook de Hotmart no está funcionando** (las compras no activan el plan solas):
1. En Hotmart → configuración del producto → Webhook, revisa que la URL apunte a `https://peptibrain.com/api/webhooks/hotmart` y que el token (`hottok`) coincida con el que está en `HOTMART_HOTTOK` en Vercel.
2. Hotmart guarda un historial de intentos de envío del webhook (con el código de respuesta) — revísalo ahí para ver el error exacto.

## 6. Mantenimiento — lo que hay que recordar hacer

- **Rotar claves/API keys**: cada vez que una se exponga (por ejemplo, si se pegó por error en un chat), regenérala en el panel del proveedor y actualízala en Vercel.
- **Renovar el dominio**: revisa la fecha de vencimiento en Cloudflare/tu registrador — si se vence, se cae la app y el correo.
- **Backups**: confirmado que el plan **Free** de Supabase (el que usa hoy PeptiBrain) **NO incluye backups** ni restauración — si se borra o corrompe algo, no hay forma de recuperarlo. Decisión anotada: subir a **Supabase Pro (~$25/mes)** justo antes de tener clientes reales pagando (da backups diarios + quita la pausa automática por 7 días de inactividad). Mientras solo haya cuentas de prueba, se puede dejar en gratis — pero antes de cobrarle al primer cliente real, esto debería estar resuelto.
- **Actualizar dependencias**: cada tanto (cada 2-3 meses) pide que se revisen actualizaciones de seguridad (`npm audit`).
- **Revisar costos vs ingresos**: una vez al mes, compara lo que gastas en Supabase + Vercel + OpenRouter + Hotmart contra lo que factura la app.
- **Revisar péptidos nuevos**: cada 2-3 meses, pide que se investigue si hay péptidos nuevos populares para agregar a la base de datos de la app.

## 7. Lo que TODAVÍA no está construido (para que no asumas que sí)

- **Encuesta de cancelación** (por qué se fue el usuario) — no existe todavía. A veces Hotmart la pregunta al cancelar, revisa ahí.
- **Backups de la base de datos** — ver punto 6, requiere subir a Supabase Pro antes de vender en serio.

## 8. ⚠️ Antes de cobrarle al primer cliente real

- **Nunca se probó un pago real de punta a punta** (pagar de verdad en Hotmart → que el plan se active solo → que las funciones Premium se desbloqueen). El código está listo, pero nadie hizo la prueba con una tarjeta real. Antes de anunciar el lanzamiento, hazla tú mismo (comprando tu propio plan y pidiendo el reembolso después) para confirmar que todo el camino funciona.
- **Backups desactivados** (ver punto 6) — considera subir a Supabase Pro antes de tener clientes de verdad.
