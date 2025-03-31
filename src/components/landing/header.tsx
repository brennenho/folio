import { Folio } from "@/components/icons";
import { WaitlistButton } from "@/components/landing/waitlist";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex h-24 w-full items-center justify-center border-b-[0.2px]">
      <div className="flex w-5/6 items-center justify-between md:w-3/4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <Folio className="w-8" />
          </div>
          <h1 className="text-xl font-medium">folio</h1>
        </Link>
        <div className="flex flex-row items-center">
          <Link href="#contact">
            <Button variant="link" size="lg" className="hidden md:block">
              Contact Us
            </Button>
            <Button variant="link" className="block md:hidden">
              Contact Us
            </Button>
          </Link>
          <WaitlistButton arrow={false} />
        </div>
      </div>
    </div>
  );
}
