export function Steps() {
  return (
    <div className="my-24 flex w-full flex-col items-center gap-8 px-40 text-center">
      <h1 className="text-3xl font-medium tracking-wide">
        Get Started in 3 Simple Steps
      </h1>
      <div className="flex gap-8">
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
      <p className="text-muted-foreground px-16 text-xl opacity-50">
        The platform then continuously analyzes performance, market conditions,
        and macroeconomic events to suggest re-balancing our new investment
        opportunities.
      </p>
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
    <div className="flex w-1/3 flex-col items-center gap-6">
      <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold text-white">
        {num}
      </div>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground opacity-80">{description}</p>
      </div>
    </div>
  );
}
