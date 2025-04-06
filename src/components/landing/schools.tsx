import { SchoolLogos } from "@/components/icons";
import { AnimationWrapper } from "@/components/animation";

export function Schools() {
  return (
    <div className="md:mt-25 mb-20 flex flex-col items-center justify-center space-y-12">
      <h2 className="mb-10 mt-8 text-2xl font-semibold tracking-wide md:mt-12 md:text-4xl">
        Compete with Students at...
      </h2>
      <AnimationWrapper className="mt-8 flex items-center justify-center md:mt-12">
        <SchoolLogos className="scale-125 md:scale-150" />
      </AnimationWrapper>
    </div>
  );
}
