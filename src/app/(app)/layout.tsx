import { Menu } from "@/components/menu";
import { Profile } from "@/components/profile";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Menu />
      <div className="relative ml-16">{children}</div>
      <Profile />
    </div>
  );
}
