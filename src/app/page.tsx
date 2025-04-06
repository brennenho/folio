import { CallToAction } from "@/components/landing/cta";
import { Dashboard } from "@/components/landing/dashboard";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Steps } from "@/components/landing/steps";
import { Schools } from "@/components/landing/schools";
import { PrizeBoard } from "@/components/landing/prizes";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center">
        <Hero />
        <Dashboard />
        <Schools />
        <PrizeBoard />
        <Steps />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
