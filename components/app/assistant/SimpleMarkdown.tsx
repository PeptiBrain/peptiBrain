// El asistente escribe en markdown ("**6 péptidos**", listas con guiones) pero
// la respuesta se pintaba en un <div> tal cual, así que el usuario veía los
// asteriscos crudos (bug #10 del QA).
//
// Renderizador mínimo a propósito: solo negritas, listas y párrafos, y todo
// con elementos de React — NUNCA dangerouslySetInnerHTML. El texto viene de un
// modelo de IA, es decir, de una fuente que no controlamos: meter su salida
// como HTML sería abrir la puerta a inyección. Tampoco se añade una librería
// de markdown por 3 reglas (peso de bundle en móvil de gama media).

function renderBold(text: string, keyPrefix: string) {
  // Divide por **negrita** conservando los delimitadores en los impares.
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`${keyPrefix}-b${i}`} className="font-semibold">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  function flushList() {
    if (listBuffer.length === 0) return;
    const items = [...listBuffer];
    listBuffer = [];
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="ml-4 list-disc space-y-0.5">
        {items.map((item, i) => (
          <li key={i}>{renderBold(item, `li-${blocks.length}-${i}`)}</li>
        ))}
      </ul>
    );
  }

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    const listMatch = line.match(/^\s*[-*]\s+(.*)$/);
    if (listMatch) {
      listBuffer.push(listMatch[1]);
      return;
    }
    flushList();
    if (!line.trim()) return;
    // Los encabezados (#, ##) se muestran como texto destacado, no como <h1>:
    // dentro de una burbuja de chat un h1 rompería la jerarquía de la pantalla.
    const heading = line.match(/^#{1,6}\s+(.*)$/);
    if (heading) {
      blocks.push(
        <p key={`h-${i}`} className="font-semibold">
          {renderBold(heading[1], `h-${i}`)}
        </p>
      );
      return;
    }
    blocks.push(<p key={`p-${i}`}>{renderBold(line, `p-${i}`)}</p>);
  });
  flushList();

  return <div className="space-y-1.5">{blocks}</div>;
}
