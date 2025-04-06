import { Folio } from "@/components/icons";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex h-24 w-full items-center justify-center">
      <div className="flex w-5/6 items-center justify-between md:w-3/4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-15 w-15 flex items-center justify-center rounded-full bg-white">
            <Folio className="w-20" />
          </div>
        </Link>
        <div className="flex flex-row items-center">
          <h1 className="text-xl font-medium">folio</h1>
        </div>
      </div>
    </div>
  );
}
