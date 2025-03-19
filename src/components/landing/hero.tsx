import { WaitlistButton } from "@/components/landing/waitlist";

export function Hero() {
  return (
    <div className="flex h-[calc(100vh-220px)] w-full items-center justify-center text-center">
      <div className="flex w-5/6 flex-col items-center justify-center gap-6 md:w-3/4">
        <h1 className="text-2xl tracking-wider md:text-5xl lg:text-7xl">
          Custom Portfolio Management
        </h1>
        <h2 className="text-muted-foreground md:text-2xl lg:px-48">
          Purpose-built financial AI that transforms complex stock research into
          clear, actionable insights for smarter investing.
        </h2>
        <div className="flex flex-col gap-2">
          <WaitlistButton />
          <p className="text-muted-foreground text-sm opacity-80">
            Learn more + no obligations
          </p>
        </div>
      </div>
    </div>
  );
}
