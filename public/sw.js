const CACHE_NAME = "peptibrain-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

self.addEventListener("push", (event) => {
  let data = { title: "PeptiBrain", body: "Tienes una dosis pendiente.", url: "/app" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    // ignore, use defaults
  }
  // Si el aviso trae un doseId, añadimos un botón "✓ Hecho" para registrar la
  // dosis en 1 toque sin abrir la app.
  const actions = data.doseId ? [{ action: "mark-done", title: "✓ Hecho" }] : [];
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/peptibrain-isotipo.svg",
      badge: "/peptibrain-isotipo.svg",
      actions,
      data: { url: data.url, doseId: data.doseId },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  const doseId = event.notification.data?.doseId;
  const url = event.notification.data?.url || "/app";
  event.notification.close();

  // Botón "✓ Hecho": marca la dosis sin abrir la app (la cookie de sesión viaja
  // con la petición al ser mismo origen). Si algo falla, abre la app como respaldo.
  if (event.action === "mark-done" && doseId) {
    event.waitUntil(
      fetch("/api/doses/mark-done", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ doseId }),
      })
        .then((res) => {
          if (res.ok) {
            return self.registration.showNotification("✓ Dosis registrada", {
              body: "¡Bien! Queda guardada en tu historial.",
              icon: "/peptibrain-isotipo.svg",
              badge: "/peptibrain-isotipo.svg",
            });
          }
          throw new Error("mark-done failed");
        })
        .catch(() => {
          if (self.clients.openWindow) return self.clients.openWindow(url);
        })
    );
    return;
  }

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
