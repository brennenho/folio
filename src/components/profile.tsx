import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

export function Profile() {
  return (
    <Avatar className="absolute right-4 top-4">
      <AvatarImage src="" />
      <AvatarFallback className="bg-foreground">
        <UserRound className="stroke-background" />
      </AvatarFallback>
    </Avatar>
  );
}
