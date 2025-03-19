export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background flex items-center gap-2 border-t p-16">
      <h1 className="text-3xl tracking-wide">Folio</h1>
      <p className="tracking-wider">&copy; copyright Folio {year}</p>
    </footer>
  );
}
