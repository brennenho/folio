import {
  Briefcase,
  MarketChanges,
  ResearchQuestion,
  Shield,
  VisualBreakdowns,
  Workflow,
} from "@/components/icons";

export function Features() {
  return (
    <div className="bg-foreground text-background flex w-full justify-center py-16 md:py-36">
      <div className="flex w-5/6 flex-col items-center md:w-3/4">
        <h1 className="text-center text-2xl font-medium tracking-wide md:px-32 md:text-4xl">
          Distill Your Searching on One Secure Workbench
        </h1>
        <div className="flex w-full flex-col items-center gap-8 py-16 md:gap-16 md:py-32">
          {/* Research Questions */}
          <div className="flex w-full flex-col gap-1">
            <p className="w-full text-right">01/04</p>
            <div className="flex w-full flex-col md:h-96 md:flex-row">
              <div className="flex w-full items-center justify-center bg-[#D0ECF8D9] py-16 opacity-80 md:w-1/2">
                <ResearchQuestion className="w-3/4" />
              </div>
              <div className="flex w-full flex-col gap-2 bg-[#1F1D1A] p-12 md:w-1/2 md:p-24 md:pr-32">
                <h1 className="text-2xl font-medium tracking-wide md:text-4xl">
                  Research Questions
                </h1>
                <p className="tracking-tight">
                  Analyze financial data to generate instant, accurate insights,
                  backed by verifiable sources.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Breakdowns */}
          <div className="flex w-full flex-col gap-1">
            <p className="w-full text-right">02/04</p>
            <div className="flex w-full flex-col-reverse md:h-96 md:flex-row">
              <div className="flex w-full flex-col gap-2 bg-[#1F1D1A] p-12 md:w-1/2 md:p-24 md:pr-32">
                <h1 className="text-2xl font-medium tracking-wide md:text-4xl">
                  Visual Breakdowns
                </h1>
                <p className="tracking-tight">
                  Understand financials with easy-to-understand metrics
                  (highlights, graphs, charts) that simplifies complex data.
                </p>
              </div>
              <div className="flex w-full items-center justify-center bg-[#D9CECD] md:w-1/2">
                <VisualBreakdowns className="w-full" />
              </div>
            </div>
          </div>

          {/* Market Changes */}
          <div className="flex w-full flex-col gap-1">
            <p className="w-full text-right">03/04</p>
            <div className="flex w-full flex-col md:h-96 md:flex-row">
              <div className="relative flex h-56 w-full bg-[#DFEDD3] md:h-96 md:w-1/2">
                <div className="absolute bottom-0 left-0 right-0">
                  {/* TODO: fix svg layout */}
                  <MarketChanges className="h-auto w-full" />
                </div>
              </div>
              <div className="flex w-full flex-col gap-2 bg-[#1F1D1A] p-12 md:w-1/2 md:p-24 md:pr-32">
                <h1 className="text-2xl font-medium tracking-wide md:text-4xl">
                  Market Changes
                </h1>
                <p className="tracking-tight">
                  Get alerts when laws, interest rate changes, or economic
                  trends impact the companies you&apos;re tracking.
                </p>
              </div>
            </div>
          </div>

          {/* Earnings Reports */}
          <div className="flex w-full flex-col gap-1">
            <p className="w-full text-right">04/04</p>
            <div className="flex w-full flex-col-reverse md:h-96 md:flex-row">
              <div className="flex w-full flex-col gap-2 bg-[#1F1D1A] p-12 md:w-1/2 md:p-24 md:pr-32">
                <h1 className="text-2xl font-medium tracking-wide md:text-4xl">
                  Earnings Reports
                </h1>
                <p className="tracking-tight">
                  Get key takeaways from earnings reports in concise executive
                  summaries to quickly understand essentials without sifting
                  through hundreds of pages.
                </p>
              </div>
              <div className="flex w-full items-center justify-center overflow-hidden bg-[#DBD9D1] md:w-1/2">
                {/* TODO: fix text layout */}
                <p className="mx-[-7%] py-12 text-center text-xl tracking-wide text-[#515151] opacity-15 md:text-3xl">
                  &ldquo;Demand for Blackwell is amazing as reasoning AI adds
                  another scaling law -- increasing compute for training makes
                  models smarter and increasing compute for long thinking makes
                  the answer smarter,&rdquo; Jensen Huang, founder and CEO of
                  NVIDIA.
                </p>
              </div>
            </div>
          </div>
        </div>

        <h1 className="w-5/6 text-center text-2xl font-medium tracking-wide md:w-3/4 md:text-4xl">
          Unlock Professional-Level Investing
        </h1>

        <div className="flex flex-col items-center gap-8 pt-16 md:flex-row">
          <div className="flex w-full flex-row items-center gap-6 text-center md:w-1/3 md:flex-col">
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
          </div>

          <div className="flex w-full flex-row items-center gap-6 text-center md:w-1/3 md:flex-col">
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
          </div>

          <div className="flex w-full flex-row items-center gap-6 text-center md:w-1/3 md:flex-col">
            <Briefcase className="w-12" />
            <div className="flex flex-col text-left md:text-center">
              <h2 className="text-xl font-medium tracking-wide">
                Domain-Specific Models
              </h2>
              <p className="text-sm tracking-tight">
                High-performing custom models built for data-drive investment
                analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
