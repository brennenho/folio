import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <div className="flex h-[calc(100vh-220px)] w-full flex-col items-center justify-center gap-6 p-16 text-center">
      <h1 className="text-7xl">Custom Portfolio Management</h1>
      <h2 className="text-muted-foreground px-48 text-2xl">
        Purpose-built financial AI that transforms complex stock research into
        clear, actionable insights for smarter investing.
      </h2>
      <div className="flex flex-col gap-2">
        <Button size="lg" className="pl-6">
          <ArrowRight /> Join Waitlist
        </Button>
        <p className="text-muted-foreground text-sm opacity-80">
          Learn more + no obligations
        </p>
      </div>
    </div>
  );
}
