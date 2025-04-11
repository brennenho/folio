import { CallToAction } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { Functions } from "@/components/landing/functions";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { PrizeBoard } from "@/components/landing/prizes";
import { Schools } from "@/components/landing/schools";
import { Steps } from "@/components/landing/steps";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center">
        <Hero />
        <Functions />
        <Schools />
        <PrizeBoard />
        <Steps />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
