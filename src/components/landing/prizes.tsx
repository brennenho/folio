import { AnimationWrapper } from "@/components/animation";
import { Prizes } from "@/components/icons";

export function PrizeBoard() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h2 className="mb-10 mt-8 text-2xl font-semibold tracking-wide md:mt-12 md:text-4xl">
        Live Leaderboard and Cash Prize
      </h2>
      <AnimationWrapper className="flex w-full max-w-4xl items-center justify-center gap-10 pb-16 sm:flex-col sm:gap-6">
        <Prizes />
      </AnimationWrapper>
    </div>
  );
}
