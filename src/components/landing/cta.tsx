import { AnimationWrapper } from "@/components/animation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CallToAction() {
  return (
    <div className="flex w-full justify-center bg-white md:mt-20">
      <AnimationWrapper className="flex w-5/6 flex-col items-start justify-between gap-4 rounded-2xl bg-[#FAFAFA] p-10 md:w-3/4 md:flex-row md:items-center md:p-20">
        <div className="flex flex-col md:gap-4">
          <h1 className="text-2xl tracking-wide md:text-4xl">
            Compete. Climb. Cash Out.
          </h1>
          <p className="tracking-tight">Register Today to Compete</p>
        </div>
        <Link href="/join">
          <Button size="lg" className="hidden pl-6 md:inline-flex">
            <ArrowRight /> Join
          </Button>
        </Link>
      </AnimationWrapper>
    </div>
  );
}
