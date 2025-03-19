export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background flex items-center gap-2 border-t p-16">
      <h1 className="text-3xl tracking-wide">[name]</h1>
      <p className="tracking-tight">&copy; copyright [name] {year}</p>
    </footer>
  );
}
