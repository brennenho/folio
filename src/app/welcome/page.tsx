"use client";

import { Folio } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

export default function Welcome() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Carousel plugins={[WheelGesturesPlugin()]} className="w-1/2">
        <CarouselContent className="py-24">
          <CarouselItem>
            <div className="flex w-full flex-col items-center justify-center gap-5 text-center">
              <Folio className="h-14 w-14 rounded-full" />
              <h1 className="text-5xl font-medium tracking-[1.44px]">
                Welcome to folio!
              </h1>
              <p className="w-[446px] text-xl text-muted-foreground opacity-80">
                Get access to tools, insights, and integrations to curate your
                portfolio.
              </p>
              <p className="text-xl font-semibold tracking-[0.4px]">
                Swipe to learn more →
              </p>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="flex w-full flex-col items-center justify-center gap-5 text-center">
              <Folio className="h-14 w-14 rounded-full" />
              <h1 className="text-5xl font-medium tracking-[1.44px]">
                Welcome to folio!
              </h1>
              <p className="w-[446px] text-xl text-muted-foreground opacity-80">
                Get access to tools, insights, and integrations to curate your
                portfolio.
              </p>
              <p className="text-xl font-semibold tracking-[0.4px]">
                Swipe to learn more →
              </p>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselDots />
      </Carousel>
      <div className="flex gap-8 p-12">
        <Button size="lg" variant="outline">
          Login
        </Button>
        <Button size="lg">Sign Up</Button>
      </div>
    </div>
  );
}
