import { Folio } from "@/components/icons";

export default function Welcome() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Folio className="h-16 w-16" />
      <h1 className="text-5xl font-medium tracking-[1.44px]">
        Welcome to folio!
      </h1>
      <p className="text-muted-foreground opacity-80">
        Get access to tools, insights, and integrations to curate your
        portfolio.
      </p>
    </div>
  );
}
