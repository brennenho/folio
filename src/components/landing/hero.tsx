import { AnimationWrapper } from "@/components/animation";
import { RegisterButton } from "./registerButton";

export function Hero() {
  return (
    <div className="-mb-8 -mt-8 flex h-[calc(100vh-80px)] w-full items-center justify-center text-center md:h-[calc(100vh-120px)]">
      <div className="flex w-5/6 flex-col items-center justify-center gap-6 md:w-3/4">
        <AnimationWrapper className="text-3xl font-medium tracking-wider md:text-4xl lg:text-6xl">
          Real-Time Stock Competition
        </AnimationWrapper>
        <AnimationWrapper className="max-w-[85%] text-muted-foreground md:text-2xl">
          Start with $10,000 in virtual cash. Compete to win $250 in real money.
        </AnimationWrapper>
        <AnimationWrapper className="flex flex-col gap-1">
          <RegisterButton />
        </AnimationWrapper>
      </div>
    </div>
  );
}
