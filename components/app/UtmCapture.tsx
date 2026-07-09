"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/utm";

// Captura el origen del tráfico (de dónde llegó el visitante) al cargar la landing.
export function UtmCapture() {
  useEffect(() => {
    captureUtm();
  }, []);
  return null;
}
