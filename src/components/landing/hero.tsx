import { AnimationWrapper } from "@/components/animation";
import { WaitlistButton } from "@/components/landing/waitlist";

export function Hero() {
  return (
    <div className="flex h-[calc(100vh-96px)] w-full flex-col items-center justify-center gap-6 text-center">
      <div className="text-[64px] leading-tight tracking-[1.92px]">
        <AnimationWrapper className="font-medium">
          A New Way to Invest.
        </AnimationWrapper>
        <AnimationWrapper className="font-semibold text-[#C5D9AE]">
          Powered by People.
        </AnimationWrapper>
      </div>
      <AnimationWrapper className="max-w-[75%] text-muted-foreground md:text-2xl">
        Automatically copy expert trades with verified performance. Folio is an
        ecosystem that rewards both investors and copy traders.
      </AnimationWrapper>
      <AnimationWrapper className="flex flex-col gap-1">
        <div>
          <WaitlistButton arrow={true} />
        </div>
        <div className="text-[#383838CC] opacity-80">
          Learn more + no obligations
        </div>
      </AnimationWrapper>
    </div>
  );
}
