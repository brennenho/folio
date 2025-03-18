import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <div className="flex h-24 w-full items-center justify-between border-b-[0.2px] px-16">
      <div>[Name Here]</div>
      <div className="flex flex-row">
        <Button variant="link" size="lg">
          Contact Us
        </Button>
        <Button size="lg">Join Waitlist</Button>
      </div>
    </div>
  );
}
