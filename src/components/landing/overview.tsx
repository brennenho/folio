import { Separator } from "@/components/ui/separator";

export function Overview() {
  return (
    <div className="w-full px-16">
      <div className="bg-muted flex w-full flex-col items-center justify-center gap-4 rounded-3xl py-4">
        <p className="text-muted-foreground opacity-50">
          Eliminate the confusion all while saving time.
        </p>
        <Separator className="opacity-60" />
        <div className="flex h-8 items-center justify-center gap-16">
          <p>Instant AI Insights</p>
          <Separator orientation="vertical" className="opacity-70" />
          <p>Clarity in Data</p>
          <Separator orientation="vertical" className="opacity-70" />
          <p>Real-time Alerts</p>
          <Separator orientation="vertical" className="opacity-70" />
          <p>Quick Key Takeaways</p>
        </div>
        <p className="text-muted-foreground p-12 text-center text-lg leading-tight opacity-50">
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
