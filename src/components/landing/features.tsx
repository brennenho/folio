import { AnimationWrapper } from "@/components/animation";
import { Briefcase, Shield, Workflow } from "@/components/icons";

export function Features() {
  return (
    <div className="flex w-full justify-center bg-foreground py-16 text-background md:py-36">
      <div className="flex w-5/6 flex-col items-center md:w-3/4">
        <AnimationWrapper className="w-5/6 text-center text-2xl font-medium tracking-wide md:w-3/4 md:text-4xl">
          Unlock Professional-Level Investing
        </AnimationWrapper>

        <div className="flex flex-col items-center gap-8 pt-16 md:flex-row">
          <AnimationWrapper className="flex w-full flex-row items-center gap-6 text-center md:w-1/3 md:flex-col">
            <Shield className="w-12" />
            <div className="flex flex-col text-left md:text-center">
              <h2 className="text-xl font-medium tracking-wide">
                Secure Data Protection
              </h2>
              <p className="text-sm tracking-tight">
                Industry-Standard security ensures your data remains private and
                protected.
              </p>
            </div>
          </AnimationWrapper>

          <AnimationWrapper className="flex w-full flex-row items-center gap-6 text-center md:w-1/3 md:flex-col">
            <Workflow className="w-12" />
            <div className="flex flex-col text-left md:text-center">
              <h2 className="text-xl font-medium tracking-wide">
                Agentic Workflows
              </h2>
              <p className="text-sm tracking-tight">
                Generate expert-quality stock analysis, market trends, and
                company comparison with no manual research required.
              </p>
            </div>
          </AnimationWrapper>

          <AnimationWrapper className="flex w-full flex-row items-center gap-6 text-center md:w-1/3 md:flex-col">
            <Briefcase className="w-12" />
            <div className="flex flex-col text-left md:text-center">
              <h2 className="text-xl font-medium tracking-wide">
                Domain-Specific Models
              </h2>
              <p className="text-sm tracking-tight">
                High-performing custom models built for data-driven investment
                analysis.
              </p>
            </div>
          </AnimationWrapper>
        </div>
      </div>
    </div>
  );
}
