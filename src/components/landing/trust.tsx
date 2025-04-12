import { AnimationWrapper } from "@/components/animation";

export function Trust() {
  return (
    <div className="flex w-3/4 flex-col items-center gap-[74px]">
      <AnimationWrapper className="flex flex-col gap-5 text-center leading-none">
        <div className="text-5xl font-semibold tracking-[1.44px]">
          Why Traders Trust Folio
        </div>
        <div className="text-2xl tracking-[0.72px]">
          Join our successful community of traders and investors.
        </div>
      </AnimationWrapper>

      <AnimationWrapper className="flex w-full">
        <Reason statistic="100%" description="Transparent Performance" />
        <Reason statistic="24/7" description="Automated Trading" />
        <Reason statistic="1" description="1-click mirroring" />
      </AnimationWrapper>
    </div>
  );
}

function Reason({
  statistic,
  description,
}: {
  statistic: string;
  description: string;
}) {
  return (
    <div className="flex w-1/3 flex-col items-center gap-[14px]">
      <div className="text-5xl font-bold tracking-[1.44px] text-[#83A160]">
        {statistic}
      </div>
      <div className="font-semibold tracking-[0.48px]">{description}</div>
    </div>
  );
}
