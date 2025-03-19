import { WaitlistButton } from "@/components/landing/waitlist";

export function CallToAction() {
  return (
    <div className="bg-foreground flex w-full justify-center">
      <div className="bg-background flex w-3/4 items-center justify-between rounded-2xl p-20">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl tracking-wide">
            Learn how Folio can help you
          </h1>
          <p className="tracking-tight">Join the waitlist to get started</p>
        </div>
        <WaitlistButton />
      </div>
    </div>
  );
}
