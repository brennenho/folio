import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  containerClassName?: string;
}

export function Spinner({ className, containerClassName }: SpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", containerClassName)}>
      <div
        className={cn(
          "h-8 w-8 animate-spin rounded-full border-b-2 border-border",
          className,
        )}
      />
    </div>
  );
}
