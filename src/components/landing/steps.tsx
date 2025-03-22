import { AnimationWrapper } from "@/components/animation";
import { Build, Customize, Execute } from "@/components/icons";

export function Steps() {
  return (
    <div className="w-full bg-foreground">
      <div className="flex w-full flex-col items-center rounded-b-3xl bg-background py-24 text-center">
        <div className="flex w-5/6 flex-col items-center gap-16 md:w-3/4">
          <AnimationWrapper className="text-4xl font-semibold tracking-wide">
            Get Started in 3 Simple Steps
          </AnimationWrapper>
          <div className="flex w-full flex-col gap-16">
            <Step
              title="Build"
              description="Define your investment goals, interests, or themes, and let our
                AI curate a diversified selection of stocks. Create a custom ETF
                tailored to your strategy."
              icon={<Build className="w-2/3" />}
            />

            <Step
              title="Customize"
              description="Refine your portfolio by adjusting allocations, backtesting
                performance, and setting risk preferences to align with your
                investment approach."
              icon={<Customize className="w-2/3" />}
              reverse
            />

            <Step
              title="Execute"
              description="With bank-level security, seamlessly link folio to one or more of your brokerages and bring your portfolio to life."
              icon={<Execute className="w-2/5" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  title,
  description,
  icon,
  reverse,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={`flex w-full flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
    >
      <AnimationWrapper className="flex w-full items-center justify-center md:w-1/2">
        {icon}
      </AnimationWrapper>
      <AnimationWrapper
        className={`flex w-full flex-col justify-center p-8 text-left tracking-tight md:w-1/2 md:p-16`}
      >
        <h1 className="text-2xl font-semibold md:text-4xl">{title}</h1>
        <p className="text-base md:text-[1.2vw] md:leading-normal">
          {description}
        </p>
      </AnimationWrapper>
    </div>
  );
}
