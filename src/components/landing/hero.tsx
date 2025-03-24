import { AnimationWrapper } from "@/components/animation";
import { WaitlistButton } from "@/components/landing/waitlist";

export function Hero() {
  return (
    <div className="flex h-[calc(100vh-220px)] w-full items-center justify-center text-center">
      <div className="flex w-5/6 flex-col items-center justify-center gap-6 md:w-3/4">
        <AnimationWrapper className="text-3xl font-medium tracking-wider md:text-4xl lg:text-6xl">
          From Idea to Investment - Instantly
        </AnimationWrapper>
        <AnimationWrapper className="mb-10 max-w-[85%] text-muted-foreground md:text-2xl">
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
