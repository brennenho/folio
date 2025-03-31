import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

export function Profile() {
  return (
    <Avatar className="absolute right-6 top-6">
      <AvatarImage src="" />
      <AvatarFallback className="bg-foreground">
        <UserRound className="stroke-background" />
      </AvatarFallback>
    </Avatar>
  );
}
