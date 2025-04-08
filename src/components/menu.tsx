import { Folio } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { House, Medal } from "lucide-react";
import Link from "next/link";

export function Menu() {
  return (
    <div className="fixed left-2 top-1/2 flex -translate-y-1/2 transform flex-col items-center justify-center gap-2 rounded-3xl border-[0.3px] p-2">
      {/* <Link href="/search">
        <Button variant="ghost" className="rounded-3xl">
          <Search className="h-8 w-8" />
        </Button>
      </Link> */}
      <Link href="/leaderboard">
        <Button variant="ghost" className="rounded-3xl">
          <Medal className="h-8 w-8" />
        </Button>
      </Link>
      <Link href="/dashboard">
        <Button variant="ghost" className="rounded-3xl">
          <House className="h-8 w-8" />
        </Button>
      </Link>
      <Link href="/trade">
        <Button variant="ghost" className="rounded-3xl">
          <Folio className="h-8 w-8" />
        </Button>
      </Link>
    </div>
  );
}
