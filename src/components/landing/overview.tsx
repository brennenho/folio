import { AnimationWrapper } from "@/components/animation";
import { Separator } from "@/components/ui/separator";

export function Overview() {
  return (
    <AnimationWrapper className="flex w-full items-center justify-center">
      <div className="flex w-5/6 flex-col items-center justify-center gap-4 rounded-2xl bg-muted py-4 text-center text-base leading-relaxed tracking-[0.68px] sm:text-lg md:w-3/4 md:text-[1.7vw] md:leading-normal">
        <p className="px-4 text-muted-foreground opacity-50">
          Eliminate the confusion all while saving time.
        </p>
        <Separator className="opacity-60" />
        <div className="my-[2.5%] w-[90%] md:w-[63%]">
          <p>
            Most people only invest in the same{" "}
            <span className="font-bold">7</span> stocks even though there are
            over <span className="font-bold">6,000</span> to choose from.
          </p>
          <br />
          <p>
            Why? Because digging through SEC filings, earnings reports, and
            market data takes too much time and makes investing feel{" "}
            <span className="font-bold">overwhelming</span>.
          </p>
          <br />
          <p>
            Folio is your{" "}
            <span className="font-bold">personal investment co-pilot</span>. It
            helps you explore new companies, analyze real market data, and build
            <span className="font-bold">custom</span> portfolios - all in one
            place.
          </p>
          <br />
          <p>
            <span className="font-bold">You set the strategy</span>. We help you
            uncover the stocks that match it. Discover smarter opportunities.
            Build with confidence. Invest in minutes.
          </p>
        </div>
      </div>
    </AnimationWrapper>
  );
}
