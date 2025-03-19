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
    <div className="bg-foreground text-background flex w-full justify-center py-36">
      <div className="flex w-3/4 flex-col items-center">
        <h1 className="px-32 text-center text-4xl font-medium tracking-wide">
          Distill Your Searching on One Secure Workbench
        </h1>
        <div className="flex w-full flex-col items-center gap-16 py-32">
          {/* Research Questions */}
          <div className="flex w-full flex-col gap-1">
            <p className="w-full text-right">01/04</p>
            <div className="flex h-96 w-full">
              <div className="flex w-1/2 items-center justify-center bg-[#D0ECF8D9] opacity-80">
                <ResearchQuestion className="w-3/4" />
              </div>
              <div className="flex w-1/2 flex-col gap-2 bg-[#1F1D1A] p-24 pr-32">
                <h1 className="text-4xl font-medium tracking-wide">
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
            <div className="flex h-96 w-full">
              <div className="flex w-1/2 flex-col gap-2 bg-[#1F1D1A] p-24 pr-32">
                <h1 className="text-4xl font-medium tracking-wide">
                  Visual Breakdowns
                </h1>
                <p className="tracking-tight">
                  Understand financials with easy-to-understand metrics
                  (highlights, graphs, charts) that simplifies complex data.
                </p>
              </div>
              <div className="flex w-1/2 items-center justify-center bg-[#D9CECD]">
                <VisualBreakdowns className="w-full" />
              </div>
            </div>
          </div>

          {/* Market Changes */}
          <div className="flex w-full flex-col gap-1">
            <p className="w-full text-right">03/04</p>
            <div className="flex h-96 w-full">
              <div className="relative flex h-96 w-1/2 bg-[#DFEDD3]">
                <div className="absolute bottom-0 left-0 right-0">
                  {/* TODO: fix svg layout */}
                  <MarketChanges className="h-auto w-full" />
                </div>
              </div>
              <div className="flex w-1/2 flex-col gap-2 bg-[#1F1D1A] p-24 pr-32">
                <h1 className="text-4xl font-medium tracking-wide">
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
            <div className="flex h-96 w-full">
              <div className="flex w-1/2 flex-col gap-2 bg-[#1F1D1A] p-24 pr-32">
                <h1 className="text-4xl font-medium tracking-wide">
                  Earnings Reports
                </h1>
                <p className="tracking-tight">
                  Get key takeaways from earnings reports in concise executive
                  summaries to quickly understand essentials without sifting
                  through hundreds of pages.
                </p>
              </div>
              <div className="flex w-1/2 items-center justify-center overflow-hidden bg-[#DBD9D1]">
                {/* TODO: fix text layout */}
                <p className="mx-[-7%] text-center text-3xl tracking-wide text-[#515151] opacity-15">
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

        <h1 className="px-64 text-center text-4xl font-medium tracking-wide">
          Unlock Professional-Level Investing
        </h1>

        <div className="flex items-center gap-8 pt-16">
          <div className="flex w-1/3 flex-col items-center text-center">
            <Shield className="w-12" />
            <h2 className="pb-4 pt-6 text-xl font-medium tracking-wide">
              Secure Data Protection
            </h2>
            <p className="text-sm tracking-tight">
              Industry-Standard security ensures your data remains private and
              protected.
            </p>
          </div>

          <div className="flex w-1/3 flex-col items-center text-center">
            <Workflow className="w-12" />
            <h2 className="pb-4 pt-6 text-xl font-medium tracking-wide">
              Agentic Workflows
            </h2>
            <p className="text-sm tracking-tight">
              Generate expert-quality stock analysis, market trends, and company
              comparison with no manual research required.
            </p>
          </div>

          <div className="flex w-1/3 flex-col items-center text-center">
            <Briefcase className="w-12" />
            <h2 className="pb-4 pt-6 text-xl font-medium tracking-wide">
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
  );
}
