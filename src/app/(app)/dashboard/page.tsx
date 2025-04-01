import { Portfolios } from "@/components/dashboard/portfolios";

export default function Dashboard() {
  return (
    <div className="flex w-full flex-col gap-4 px-12 py-8">
      <div className="w-full text-2xl font-bold tracking-[0.48px]">
        Your Portfolios
      </div>
      <Portfolios />
    </div>
  );
}
