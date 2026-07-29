// IndexNow: protocolo real (soportado por Bing, Yandex, Naver, Seznam, Yep — Google
// NO lo soporta) para avisar de URLs nuevas/actualizadas sin esperar a que rastreen
// el sitemap por su cuenta. Reemplaza al viejo "ping" de sitemap que Google y Bing
// apagaron en 2023 (ambos devuelven 404/410 ahora). La clave es pública por diseño:
// el protocolo exige publicarla en un archivo de texto en la raíz del dominio para
// que el buscador la valide contra la que se envía en cada aviso.
const INDEXNOW_KEY = "4d377d75f7997118a9ff7658b849b99f";
const BASE_URL = "https://peptibrain.com";

export async function pingIndexNow(urls: string[]): Promise<{ ok: boolean; status?: number }> {
  if (urls.length === 0) return { ok: true };
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "peptibrain.com",
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false };
  }
}
