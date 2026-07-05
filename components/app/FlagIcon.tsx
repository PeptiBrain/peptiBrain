export function FlagIcon({ locale, className }: { locale: string; className?: string }) {
  if (locale === "en") {
    // Bandera de EE.UU. simplificada (el inglés apunta al mercado estadounidense)
    return (
      <svg viewBox="0 0 24 16" className={className} role="img" aria-label="English (US)">
        <rect width="24" height="16" fill="#B22234" />
        {[1, 3, 5, 7, 9, 11, 13].map((y) => (
          <rect key={y} y={y} width="24" height="1.23" fill="#FFFFFF" />
        ))}
        <rect width="10" height="8.6" fill="#3C3B6E" />
      </svg>
    );
  }
  // Bandera de España simplificada
  return (
    <svg viewBox="0 0 24 16" className={className} role="img" aria-label="Español">
      <rect width="24" height="16" fill="#AA151B" />
      <rect y="4" width="24" height="8" fill="#F1BF00" />
    </svg>
  );
}
