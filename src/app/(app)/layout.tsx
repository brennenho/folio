import { Menu } from "@/components/menu";
import { Profile } from "@/components/profile";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div>
      <Menu />
      <div className="relative ml-16">{children}</div>
      <Profile />
    </div>
  );
}
