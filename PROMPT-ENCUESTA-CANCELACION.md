# Prompt: Encuesta de cancelación (capa 1 de retención)

> Origen: idea compartida en un post de #TipsValiosos sobre encuestas de cancelación,
> adaptada a las restricciones reales de PeptiBrain (Hotmart gestiona el cobro, no la app).
> Implementado el 2026-07-27.

## El problema

Hoy, cuando alguien pulsa "Cancelar suscripción" en `/app/cuenta`, ve una oferta de
descuento (`CancelOfferModal`) y, si la rechaza, va directo a instrucciones de cómo
cancelar por email en Hotmart. **No se registra por qué se va.** Cada cancelación sin
motivo es una oportunidad perdida de aprendizaje: no sabemos si el problema es precio,
onboarding, comunicación o expectativa.

## La solución

Insertar una encuesta de un clic ENTRE "rechazó la oferta" y "instrucciones de
cancelar", con motivos de opción única (sin texto obligatorio):

- No era lo que esperaba
- El plan gratis me basta
- No entendí cómo usarla
- Me dio miedo el cobro
- Es muy caro
- No tengo tiempo
- Otro (con campo de texto opcional)

**Ruteo por motivo** (solo con lo que la app puede cumplir de verdad):
- "Es muy caro" → antes de ir a instrucciones, se le recuerda la oferta de descuento
  que ya existe (reabre `CancelOfferModal`) en vez de dejarlo ir sin más.
- "No entendí cómo usarla" → se le ofrece un atajo a soporte (mailto) antes de
  continuar con la baja.
- El resto → se registra el motivo y sigue directo a instrucciones.

**⛔ Lo que NO se promete**: pausar la suscripción o aplicar un descuento automático
vía cobro. Hotmart no expone esas acciones por API — solo cancelar. Prometerlas sería
un cobro que sigue llegando igual, generando reembolsos y reseñas negativas.

**⛔ La encuesta NUNCA es obligatoria para cancelar.** La primera versión SÍ tenía este
bug: el botón "Cancelar" del modal cerraba TODO el intento de baja, así que la única
forma de llegar a las instrucciones era eligiendo un motivo — exactamente el dark
pattern de fricción que este mismo sistema prohíbe (`PROMPT-RETENER-INGRESOS.txt`:
"cancelar debe ser FÁCIL, cero dark patterns"). Corregido el mismo día: existe
"Prefiero no decirlo, solo quiero cancelar", que sigue a las instrucciones sin exigir
respuesta. La X/Escape/clic fuera siguen abandonando el intento completo.

## Qué se guarda

Cada respuesta se inserta en una tabla nueva `cancellation_feedback` (motivo + nota
opcional + usuario), servidor-only vía `service_role` (mismo patrón que
`hotmart_events`/`ai_calls`: RLS activo, sin políticas, solo el backend escribe/lee).
El panel de admin (`/app/admin`) muestra un conteo por motivo de los últimos 30 días,
para que el dueño vea de un vistazo por qué se le va la gente sin entrar a Hotmart.

## Alcance de esta capa

Solo la encuesta + ruteo + registro + visibilidad en admin. Fuera de alcance (quedan
para cuando se decida activar la capa 2/3/4 de `docs/sistema/PROMPT-RETENER-INGRESOS.txt`):
dunning de pagos fallidos, emails de win-back, y recordatorio de renovación anual.
