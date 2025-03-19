import { AnimationWrapper } from "@/components/animation";

export function Steps() {
  return (
    <div className="my-24 flex w-full flex-col items-center text-center">
      <div className="flex w-5/6 flex-col items-center gap-8 md:w-3/4">
        <AnimationWrapper className="text-3xl font-medium tracking-wide">
          Get Started in 3 Simple Steps
        </AnimationWrapper>
        <div className="md: flex flex-col gap-8 md:flex-row">
          <Step
            num={1}
            title="Search"
            description="Describe your investment goal, interest, or theme and our AI will find relevant, diversified stocks."
          />
          <Step
            num={2}
            title="Customize"
            description="Fine-tune your portfolio by adjusting allocations, backtesting performance, and setting risk preferences."
          />
          <Step
            num={3}
            title="Execute"
            description="Sync with your brokerage account to seamlessly trade and manage your portfolio."
          />
        </div>
        <AnimationWrapper className="text-muted-foreground text-xl opacity-50 md:px-16">
          The platform then continuously analyzes performance, market
          conditions, and macroeconomic events to suggest re-balancing our new
          investment opportunities.
        </AnimationWrapper>
      </div>
    </div>
  );
}

function Step({
  num,
  title,
  description,
}: {
  num: number;
  title: string;
  description: string;
}) {
  return (
    <AnimationWrapper className="flex w-full flex-row items-center gap-6 md:w-1/3 md:flex-col">
      <div className="bg-primary flex aspect-square h-12 items-center justify-center rounded-full text-xl font-semibold text-white md:h-16">
        {num}
      </div>
      <div className="flex flex-col items-start text-left md:items-center md:text-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground opacity-80">{description}</p>
      </div>
    </AnimationWrapper>
  );
}
