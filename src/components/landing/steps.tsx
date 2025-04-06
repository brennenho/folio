import { AnimationWrapper } from "@/components/animation";
import { LogTrades, LeaderBoard, InvestCompanies } from "@/components/icons";

export function Steps() {
  return (
    <div className="w-full bg-foreground">
      <div className="flex w-full flex-col items-center bg-background py-24 text-center">
        <div className="flex w-5/6 flex-col items-center gap-16 md:w-3/4">
          <AnimationWrapper className="text-2xl font-semibold tracking-wide md:text-4xl">
            How to Compete
          </AnimationWrapper>
          <div className="flex w-full flex-col gap-16">
            <Step
              title="Invest"
              description="Pick your plays, build your strategy, and drop your picks. You’ve got $10,000 in virtual cash and one week to prove you’re the smartest investor in the room. Be ready on Tuesday Morning, April 8th. "
              icon={<InvestCompanies className="w-3/5" />}
            />

            <Step
              title="Log"
              description="Track every move. Log your buys, sells, and allocation shifts all on folio. Every choice counts when you’re climbing the leaderboard."
              icon={<LogTrades className="w-4/5" />}
              reverse
            />

            <Step
              title="Live"
              description="Stack your performance against friends, clubs and schools. Real-time rankings, three winners. Let’s see who’s got the edge."
              icon={<LeaderBoard className="w-4/5" />}
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
