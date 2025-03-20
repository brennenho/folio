export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background flex w-full items-center justify-center gap-2 border-t p-8 md:justify-start md:p-16">
      <h1 className="text-3xl tracking-wide">folio</h1>
      <p className="text-sm tracking-wider">
        &copy; copyright {year}. All rights reserved.
      </p>
    </footer>
  );
}
