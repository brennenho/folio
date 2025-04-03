"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function BetaButton() {
  return (
    <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
      <Link href="/chat">Try Beta</Link>
    </Button>
  );
}

export function BetaSection() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <BetaButton />
    </div>
  );
}
