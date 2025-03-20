import { WaitlistButton } from "@/components/landing/waitlist";
import { AnimationWrapper } from "../animation";

export function Hero() {
  return (
    <div className="flex h-[calc(100vh-220px)] w-full items-center justify-center text-center">
      <div className="flex w-5/6 flex-col items-center justify-center gap-6 md:w-3/4">
        <AnimationWrapper className="text-2xl tracking-wider md:text-5xl lg:text-7xl">
          Retail Investing, Reimagined
        </AnimationWrapper>
        <AnimationWrapper className="mb-10 max-w-[1150px] text-muted-foreground md:text-2xl lg:px-48">
          folio&rsquo;s financial AI curates custom portfolios based on your
          investment goals, market trends, and real financial data.
        </AnimationWrapper>
        <AnimationWrapper className="flex flex-col gap-2">
          <WaitlistButton />
          <p className="text-sm text-muted-foreground opacity-80">
            Learn more + no obligations
          </p>
        </AnimationWrapper>
      </div>
    </div>
  );
}
