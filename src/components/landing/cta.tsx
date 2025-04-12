import { AnimationWrapper } from "@/components/animation";
import { WaitlistButton } from "@/components/landing/waitlist";

export function CallToAction() {
  return (
    <div className="flex w-full justify-center bg-foreground pt-36">
      <AnimationWrapper className="flex w-5/6 flex-col items-start justify-between gap-4 rounded-2xl bg-background p-10 md:w-3/4 md:flex-row md:items-center md:p-20">
        <div className="flex flex-col md:gap-4">
          <h1 className="text-2xl tracking-wide md:text-4xl">
            Learn how Folio can help you
          </h1>
          <p className="tracking-tight">Join the waitlist to get started</p>
        </div>
        <WaitlistButton />
      </AnimationWrapper>
    </div>
  );
}
