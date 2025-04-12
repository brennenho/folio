import { Contact } from "@/components/landing/contact";
import { CallToAction } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { Functions } from "@/components/landing/functions";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Trust } from "@/components/landing/trust";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center">
        <Hero />
        <Functions />
        <Trust />
        <div className="h-10 w-full bg-black">
          <div className="h-10 w-full rounded-b-full bg-white"></div>
        </div>
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
