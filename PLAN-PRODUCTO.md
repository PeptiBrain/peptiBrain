# PLAN DE PRODUCTO — PeptiBrain

> Creado 2026-07-25 a partir del análisis estratégico posterior al QA de 84 hallazgos.
> Este archivo es el ORDEN DE TRABAJO. `ESTADO.md` tiene el backlog de bugs; aquí está el porqué.

---

## ⚠️ LA TENSIÓN QUE HAY QUE RESOLVER PRIMERO

El análisis estratégico describe un roadmap de **2 a 4 meses**. El lanzamiento está fijado en
**7 días** (2 de agosto de 2026). Ese conflicto no se resuelve trabajando más rápido: se resuelve
decidiendo qué es "lanzable".

Estado real hoy:
- 23 de 84 hallazgos del QA cerrados. Los que podían inducir a un error de dosis, resueltos.
- **Nunca se ha probado un pago real de punta a punta.** Único bloqueante duro para cobrar.
- **Cero tests automatizados.** Cada cambio se verifica a mano.
- Sin observabilidad: los errores 400/500 solo existen en la consola del navegador del usuario.

**Recomendación honesta**: lanzar el 2 de agosto es posible SOLO si se completa el Bloque A entero.
Si no se completa, mover la fecha 2 semanas cuesta mucho menos que quemar a los primeros clientes:
en esta categoría el usuario que se va por un fallo de dosis o por perder datos no vuelve, y encima
lo cuenta.

---

## CORRECCIONES AL ANÁLISIS (verificadas contra el código)

No dar por buenas estas tres afirmaciones del documento estratégico:

1. **Las notificaciones push YA están construidas** — service worker (`public/sw.js`), claves VAPID,
   `/api/push/subscribe`, cron cada 15 min vía cron-job.org. Lo que es una página de instrucciones
   manuales es `/descargar`, que sirve para INSTALAR la PWA, no para las notificaciones.
2. **La calculadora YA es pública y gratuita sin registro** (`/calculadora`,
   `/calculadora-semaglutida`, `/comparador`, `/protocolos`, cero checks de sesión). La estrategia
   de adquisición que propone el documento ya está ejecutada. Lo que falla es un texto: el Centro de
   ayuda (`Help.tools1A`) dice "Calculadora (Premium)".
3. **Proveedores ya es una agenda estrictamente privada** (RLS `user_id = auth.uid()`, sin
   descubrimiento ni ranking ni afiliación). El riesgo de cierre de pasarela es real pero es una
   línea roja a no cruzar en el futuro, no un problema actual.

---

## BLOQUE A — ANTES DE COBRARLE AL PRIMER CLIENTE (no negociable)

- [ ] **A1. Prueba de pago real de punta a punta.** Pagar de verdad en Hotmart → comprobar que el
      plan se activa solo → comprobar que las funciones Premium se desbloquean → pedir reembolso y
      comprobar que el plan baja. **Solo lo puede hacer el dueño.** Sin esto no se puede vender.
- [ ] **A2. Motor de validación clínica centralizado** (mejora estructural nº2 del análisis, y la
      más importante porque es una app de dosificación). Existe ya `lib/plausible.ts` con rangos;
      falta unificarlo con la calculadora y el importador CSV, y aplicar los 3 niveles: bloquear lo
      imposible · avisar de lo inusual · aceptar lo normal.
      Parcialmente hecho: rangos de salud ✅, `Infinity` ✅, dosis>vial ✅, dosis no medible ✅.
- [ ] **A3. Cerrar los fallos silenciosos que quedan.** Cinco formularios devolvían 400 sin decir
      nada; arreglados péptido y vial. Faltan los demás y el patrón común.
- [ ] **A4. Observabilidad mínima.** Hoy un error de un cliente solo existe en su consola. Existe
      `error_log` + Error Boundaries; falta que capture también los 400/500 de las mutaciones.
- [ ] **A5. Backups de la base de datos.** El plan gratuito de Supabase NO tiene backups ni
      restauración. Antes del primer cliente real: subir a Pro (~25 $/mes).
- [ ] **A6. Limpiar los datos de prueba** de la cuenta real (ya es posible desde Salud tras la capa 3):
      peso 500 kg del 1900, ejercicio 99.999 min, hidratación 999.999 ml, sueño, "Náusea severa QA",
      y las 59 dosis del protocolo de prueba.
- [x] **A7. Rutas en inglés — decidido: NO traducir por ahora (2026-07-26).** Se mantiene
      `/en/app/peptidos` (mismo segmento en ambos idiomas) en vez de `/en/app/peptides`. Razón: a 6
      días del lanzamiento el sitio no tiene enlaces externos ni posicionamiento que proteger todavía
      — el riesgo real hoy es romper la generación de `<Link>` de next-intl (requiere un mapa
      `pathnames` completo) sin ganar nada a cambio. Backlog post-lanzamiento (Bloque C): añadir
      `pathnames` a `i18n/routing.ts` con el mapa es→en ANTES de que existan enlaces indexados.
- [x] **A8. Corregido el texto "Calculadora (Premium)"** del Centro de ayuda (`Help.tools1A`, es/en):
      ahora aclara que hay una calculadora pública gratis en `/calculadora` sin cuenta, y que la de
      dentro de la app (Péptidos → Calculadora) está incluida en Premium.

## BLOQUE B — PRIMERAS 2 SEMANAS (calidad percibida)

- [ ] **B1. Sistema único de formularios** (estructural nº1): un hook común con esquema compartido y
      4 estados (reposo · guardando · error inline · éxito). Copiar el patrón del importador CSV,
      que es el único que hoy valida y explica bien.
- [ ] **B2. Capa de datos con caché** (estructural nº3): hoy cada pantalla pide las 12 tablas por su
      cuenta y por duplicado (~24 peticiones por navegación). Causa los 503, la lentitud de 5-8 s y
      el badge desactualizado. React Query o SWR, una sola fuente de verdad, invalidación al mutar.
- [ ] **B3. Utilidad única de fechas** (estructural nº4): parcialmente hecho (`formatDateOnly`).
      Falta aplicarlo en todas las pantallas y arreglar las fechas en español dentro de la UI inglesa.
- [ ] **B4. CRUD completo** (estructural nº5): hecho para Salud. Faltan las dosis de protocolo
      (no se pueden borrar) y la regla general: reversible → "Deshacer" en toast; destructivo →
      confirmación.
- [ ] **B5. Tests de los 5 flujos críticos** + unitarios de la calculadora con casos límite. Habrían
      detectado casi todo el QA en segundos. Meterlos EN PARALELO, no al final.
- [ ] **B6. Resto de bugs cosméticos del QA** (~35): plurales, alineaciones, avisos de descarga,
      emojis de ánimo, header sticky que solapa, móvil a 372 px.

## BLOQUE C — MES 1 A 3 (lo que hace que paguen y se queden)

Orden por impacto en retención, según el análisis. Ninguno se empieza antes de cerrar A y B.

- [ ] **C1. Motor de titulación y protocolos preconfigurados.** Lo que más falta. Los esquemas de
      GLP-1 son escalonados; hoy hay que crear 60 dosis a mano y luego no se pueden editar ni borrar.
      Es el ancla natural del plan de pago.
- [ ] **C2. Tarjeta "hoy toca esto".** Una pantalla que responda la única pregunta diaria: cuántas
      unidades cargo, en qué marca de la jeringa, en qué zona. Hoy está repartido en tres sitios.
- [ ] **C3. Prevención de desperdicio de viales.** Caducidad tras reconstituir, unidades restantes
      reales, días de autonomía, aviso de recompra. Argumento de venta directo: "se paga solo la
      primera vez que no tiras un vial". La app YA tiene todos los datos; solo falta cerrar el bucle.
- [ ] **C4. Informe para el médico** (PDF de una página). Da legitimidad, genera razón recurrente de
      pago y es lo que provoca recomendación orgánica.
- [ ] **C5. Inteligencia de efectos secundarios.** Cruzar efectos × dosis × sueño × hidratación y
      devolver patrones en lenguaje llano. Necesita historial acumulado → es la mejor arma
      anti-churn, porque cuanto más tiempo lleva el usuario más le cuesta irse.
- [ ] **C6. Analíticas con rangos de referencia y tendencias.**
- [ ] **C7. Estadísticas robustas a datos raros** (un registro de 1800 dejó el gráfico en blanco).
- [ ] **C8. Resumen semanal (push + email los domingos).** El análisis lo señala como la mecánica de
      mejor retorno del sector, y los datos ya existen. ~1 semana de trabajo.
- [ ] **C9. Fotos de progreso con guías y comparador.**
- [ ] **C10. Inteligencia de coste** (coste por mg, por semana, proyección anual). Además de útil,
      reencuadra el precio: ante "llevas 1.240 € invertidos", 49 €/año deja de ser una decisión.
- [ ] **C11. Asistente: o se arregla o se esconde.** Hoy devuelve markdown crudo, respuestas
      truncadas y números que no cuadran con el dashboard. Resta más de lo que suma.
- [ ] **C12. Tour guiado real** (señalar elementos, no 9 pantallas de texto) y "Primeros pasos" que
      se colapse solo al completarse.
- [ ] **C13. Widget + sincronización con Apple Health / Google Fit.** Requiere apps nativas — ya
      anotado como futuro en ESTADO.md.

## BLOQUE D — LÍNEAS ROJAS PERMANENTES (no son tareas: son reglas)

- [ ] **D1. Proveedores se queda como agenda PRIVADA.** Nunca directorio, ranking, buscador ni
      afiliación. Hoy ya cumple (RLS own-only). Cruzar esta línea expone a cierre de la pasarela de
      pago, que es muerte súbita del negocio.
- [ ] **D2. La app EJECUTA el protocolo del usuario, nunca lo sugiere.** Ni qué tomar ni cuánto.
      Avisos médicos visibles, no enterrados en el pie.
- [ ] **D3. Privacidad como función de conversión.** Peso, fotos del cuerpo, analíticas y consumo
      son de lo más sensible que existe. Fotos privadas por defecto, borrado granular real (ya
      posible en Salud), página de privacidad clara.

---

## LA TESIS DE NEGOCIO (vale la pena tenerla presente)

> "La gente no paga por registrar cosas: paga por **no equivocarse, no desperdiciar dinero y ver que
> está funcionando**."

El usuario ya gasta 100-300 €/mes en compuestos: cobrar 9 € es el 3 %. El precio no es el problema.
El problema es que hoy la app no le ahorra un euro ni le quita una ansiedad concreta. C1, C3 y C5
son exactamente los tres bolsillos de esa frase.

**Empaquetado**: calculadora pública gratis como canal de adquisición (YA hecho); plan gratis que
deje registrar de verdad (hoy: 1 péptido, 1 vial); el plan de pago se justifica con C1-C6.
**Precio**: empujar el anual con 2 meses gratis; y poner el muro de pago en el MOMENTO DE VALOR
(tras el primer cálculo o la tercera dosis), no en el registro.

**Métrica obsesión**: cuántas dosis registra el usuario en su PRIMERA SEMANA. Es el mejor predictor
de que siga ahí en el mes 3. Todo el onboarding debería optimizar ese número, no enseñar funciones.
