import { AnimationWrapper } from "@/components/animation";
import { Mockup } from "@/components/icons";
import { Contact } from "@/components/landing/contact";
import { CallToAction } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
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
        <div className="flex w-full flex-col items-center gap-40">
          <AnimationWrapper className="w-3/4">
            <Mockup />
          </AnimationWrapper>
          <Features />
          <Functions />
          <Trust />
          <div className="h-10 w-full bg-black">
            <div className="h-10 w-full rounded-b-full bg-white"></div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-24 bg-foreground py-24">
          <CallToAction />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
