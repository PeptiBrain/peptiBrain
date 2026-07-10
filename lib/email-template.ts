// Plantilla base para los correos de PeptiBrain (logo + colores de marca).
// Estilos en línea a propósito: los clientes de correo (Gmail, Outlook...)
// ignoran o rompen las hojas de estilo externas y muchas reglas modernas.
export function emailShell(bodyHtml: string): string {
  return `
<!doctype html>
<html lang="es">
  <body style="margin:0;padding:32px 16px;background-color:#FAFBFA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#FFFFFE;border-radius:16px;overflow:hidden;border:1px solid #EEE9E0;">
            <tr>
              <td style="padding:28px 32px 20px 32px;border-bottom:1px solid #F4F0E9;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="https://peptibrain.com/icon-512.png" width="32" height="32" alt="" style="display:block;border-radius:8px;" />
                    </td>
                    <td style="font-size:18px;font-weight:700;color:#10162A;">PeptiBrain</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;color:#10162A;font-size:15px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 28px 32px;border-top:1px solid #F4F0E9;color:#5B6478;font-size:12px;line-height:1.5;">
                PeptiBrain — tu diario personal de péptidos y bienestar.<br />
                Si no esperabas este correo, puedes ignorarlo.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// Los correos meten nombres que el usuario escribió libremente (el suyo o el
// de un familiar) directo en el HTML — hay que escaparlos para que nadie
// pueda inyectar etiquetas raras en un correo que sale con nuestro dominio.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function emailButton(url: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr><td style="border-radius:10px;background-color:#00C896;"><a href="${url}" target="_blank" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:10px;">${label}</a></td></tr></table>`;
}
