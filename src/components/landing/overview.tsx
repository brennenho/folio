import { AnimationWrapper } from "@/components/animation";
import { Separator } from "@/components/ui/separator";

export function Overview() {
  return (
    <AnimationWrapper className="flex w-full items-center justify-center">
      <div className="flex w-5/6 flex-col items-center justify-center gap-4 rounded-2xl bg-muted py-4 text-center md:w-3/4">
        <p className="px-4 text-muted-foreground opacity-50">
          Eliminate the confusion all while saving time.
        </p>
        <Separator className="opacity-60" />
        <div className="mb-[2.5%] mt-[2.5%] w-[90%] text-center text-base leading-relaxed tracking-[0.68px] text-black sm:text-lg md:w-[63%] md:text-[1.7vw] md:leading-normal">
          <p>
            <span className="font-bold">70%</span> of trades are concentrated in
            just <span className="font-bold">7</span> stocks, despite there
            being <span className="font-bold">6,000+</span> publicly traded
            companies.
          </p>
          <br />
          <p>
            <span className="inline-block w-[1.2em]"></span>The problem
            isn&apos;t a lack of information. It&apos;s{" "}
            <span className="font-bold">understanding</span> it. SEC filings,
            earnings reports, and market trends are too complex.
          </p>
          <br />
          <p>
            But, <span className="font-bold">distilling</span> it down
            isn&apos;t.
          </p>
          <br />
          <p>
            Build, customize, and execute your own custom AI-enabled portfolios{" "}
            <span className="font-bold">tailored</span> to your strategy.
          </p>
        </div>
      </div>
    </AnimationWrapper>
  );
}
