import { Folio } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex h-24 w-full items-center justify-center border-b-[0.2px]">
      <div className="flex w-3/4 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <Folio className="w-8" />
          </div>
          <h1 className="text-xl font-medium">Folio</h1>
        </Link>
        <div className="flex flex-row">
          <Button variant="link" size="lg">
            Contact Us
          </Button>
          <Button size="lg">Join Waitlist</Button>
        </div>
      </div>
    </div>
  );
}
