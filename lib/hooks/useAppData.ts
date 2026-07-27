"use client";

import useSWR, { useSWRConfig } from "swr";
import { loadAppData, type AppData } from "@/lib/app-data";

// Antes cada pantalla (Inicio, Péptidos, Salud, Estadísticas, Familia, Cuenta,
// Informe, y el widget del header) llamaba loadAppData() por su cuenta al
// montar — ~24 peticiones duplicadas por navegación (CR-3 del QA), la
// lentitud de 5-8s y el badge de dosis pendientes que no se actualizaba hasta
// que el widget volvía a montarse. Con una sola clave de caché compartida,
// todas las pantallas leen y escriben la MISMA copia: al marcar una dosis en
// una pantalla, el header se entera al instante, sin refetch.
const APP_DATA_KEY = "app-data";

export function useAppData() {
  const { mutate: globalMutate } = useSWRConfig();
  const { data, isLoading } = useSWR<AppData>(APP_DATA_KEY, loadAppData, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  // Misma firma que el `setData` local de antes: los ~15 componentes que ya
  // hacen `onChange={(next) => setData(next)}` tras guardar/borrar no
  // necesitan cambiar nada — solo que ahora ese cambio es instantáneo en
  // TODAS las pantallas abiertas, no solo en la que lo disparó.
  function setData(next: AppData) {
    globalMutate(APP_DATA_KEY, next, { revalidate: false });
  }

  // Fuerza un refetch completo (para las pantallas que hoy llaman loadAppData()
  // de nuevo tras una acción que no devuelve el AppData completo, ej. exportar).
  function refresh() {
    return globalMutate(APP_DATA_KEY);
  }

  return { data: data ?? null, isLoading, setData, refresh };
}
