import { Separator } from "@/components/ui/separator";

export function Overview() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="bg-muted flex w-5/6 flex-col items-center justify-center gap-4 rounded-2xl py-4 text-center md:w-3/4">
        <p className="text-muted-foreground opacity-50">
          Eliminate the confusion all while saving time.
        </p>
        <Separator className="opacity-60" />
        <div className="flex flex-col items-center justify-center gap-2 md:h-8 md:flex-row md:gap-4 md:px-4 lg:gap-16 lg:px-16">
          <p>Instant AI Insights</p>
          <Separator
            orientation="vertical"
            className="hidden opacity-70 md:block"
          />
          <p>Clarity in Data</p>
          <Separator
            orientation="vertical"
            className="hidden opacity-70 md:block"
          />
          <p>Real-time Alerts</p>
          <Separator
            orientation="vertical"
            className="hidden opacity-70 md:block"
          />
          <p>Quick Key Takeaways</p>
        </div>
        <p className="text-muted-foreground p-4 text-center text-lg leading-tight opacity-50 md:p-12">
          <span className="font-bold">The problem?</span> The everyday person
          struggles to <span className="font-bold">analyze</span> stock
          effectively due to the <span className="font-bold">overwhelming</span>{" "}
          financial reports, complex data, and a lack of clear insights, leading
          many to default to well-known stocks rather than discovering new,
          beneficial opportunities.
        </p>
      </div>
    </div>
  );
}
