export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex w-full items-center justify-center gap-2 border-t bg-foreground p-8 text-background md:justify-start md:p-16">
      <h1 className="text-3xl tracking-wide">folio</h1>
      <p className="text-sm tracking-wider">
        &copy; copyright {year}. All rights reserved.
      </p>
    </footer>
  );
}
