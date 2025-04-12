import { Coins, Copy, Search, Workflow } from "lucide-react";
import { AnimationWrapper } from "../animation";
import { Card } from "../ui/card";

export function Features() {
  return (
    <div className="mx-auto flex w-3/4 flex-col items-center gap-16">
      <AnimationWrapper className="flex flex-col gap-5 text-center leading-none">
        <div className="text-5xl font-semibold tracking-[1.44px]">
          Trading Reimagined
        </div>
        <div className="text-2xl tracking-[0.72px]">
          Folio combines cutting-edge technology with human expertise to create
          a trading experience that's both powerful and intuitive.
        </div>
      </AnimationWrapper>

      <div className="flex flex-col gap-8">
        <div className="flex gap-8">
          <Feature
            icon={<Copy className="h-8 w-8" />}
            title="Effortless Trade Copying"
            description="Copy experts' trades automatically. No need to constantly monitor the markets—we'll handle the execution while you focus on what matters."
          />
          <Feature
            icon={<Search className="h-8 w-8" />}
            title="Complete Transparency"
            description="Access real historical performance data for all creators. Make informed decisions based on verified track records, not empty promises."
          />
        </div>
        <div className="flex gap-8">
          <Feature
            icon={<Workflow className="h-8 w-8" />}
            title="Seamless Integration"
            description="Our platform integrates effortlessly with your existing trading accounts. Set up once and enjoy a smooth, consistent experience."
          />
          <Feature
            icon={<Coins className="h-8 w-8" />}
            title="Creator-Based Pricing"
            description="Flexible pricing model that lets creators set their own rates. Pay only for the strategies that deliver results for you."
          />
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <AnimationWrapper className="w-1/2">
      <Card className="flex flex-col gap-4 p-6 hover:shadow-lg">
        <div>{icon}</div>
        <div className="text-xl font-semibold tracking-[0.48px]">{title}</div>
        <div className="">{description}</div>
      </Card>
    </AnimationWrapper>
  );
}
