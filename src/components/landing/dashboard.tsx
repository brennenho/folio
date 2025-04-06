import { AnimationWrapper } from "@/components/animation";
import { AppDashboard } from "@/components/icons";

export function Dashboard() {
  return (
    <AnimationWrapper className="flex w-5/6 items-center justify-center pb-16 md:w-3/4">
      <AppDashboard />
    </AnimationWrapper>
  );
}
