import { CallToAction } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { Overview } from "@/components/landing/overview";
import { Steps } from "@/components/landing/steps";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center">
      <Hero />
      <Overview />
      <Steps />
      <Features />
      <CallToAction />
    </main>
  );
}
