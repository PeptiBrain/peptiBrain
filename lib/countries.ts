// Nombre de país (y bandera) a partir del código de teléfono capturado en el registro.
const BY_CODE: Record<string, { name: string; flag: string }> = {
  "+34": { name: "España", flag: "🇪🇸" },
  "+52": { name: "México", flag: "🇲🇽" },
  "+54": { name: "Argentina", flag: "🇦🇷" },
  "+57": { name: "Colombia", flag: "🇨🇴" },
  "+56": { name: "Chile", flag: "🇨🇱" },
  "+51": { name: "Perú", flag: "🇵🇪" },
  "+58": { name: "Venezuela", flag: "🇻🇪" },
  "+593": { name: "Ecuador", flag: "🇪🇨" },
  "+502": { name: "Guatemala", flag: "🇬🇹" },
  "+503": { name: "El Salvador", flag: "🇸🇻" },
  "+504": { name: "Honduras", flag: "🇭🇳" },
  "+505": { name: "Nicaragua", flag: "🇳🇮" },
  "+506": { name: "Costa Rica", flag: "🇨🇷" },
  "+507": { name: "Panamá", flag: "🇵🇦" },
  "+591": { name: "Bolivia", flag: "🇧🇴" },
  "+595": { name: "Paraguay", flag: "🇵🇾" },
  "+598": { name: "Uruguay", flag: "🇺🇾" },
  "+1": { name: "EE.UU./Canadá", flag: "🇺🇸" },
  "+55": { name: "Brasil", flag: "🇧🇷" },
  "+44": { name: "Reino Unido", flag: "🇬🇧" },
  "+33": { name: "Francia", flag: "🇫🇷" },
  "+49": { name: "Alemania", flag: "🇩🇪" },
  "+39": { name: "Italia", flag: "🇮🇹" },
  "+351": { name: "Portugal", flag: "🇵🇹" },
};

export function countryFromPhoneCode(code: string | null | undefined): { name: string; flag: string } {
  if (!code) return { name: "Desconocido", flag: "🌐" };
  return BY_CODE[code.trim()] || { name: code.trim(), flag: "🌐" };
}
