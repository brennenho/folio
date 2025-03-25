import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Contact } from "@/components/landing/contact";
import { CallToAction } from "@/components/landing/cta";
import { Dashboard } from "@/components/landing/dashboard";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { Overview } from "@/components/landing/overview";
import { Steps } from "@/components/landing/steps";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center">
        <Hero />
        <Dashboard />
        <Overview />
        <Steps />
        <Features />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
