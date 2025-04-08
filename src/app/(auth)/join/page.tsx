"use client";

import { Login } from "@/components/auth/login";
import { SignUp } from "@/components/auth/signup";
import { Folio } from "@/components/icons";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const referralCode = searchParams.get("ref");

    if (referralCode) {
      localStorage.setItem("referralCode", referralCode);
    }
  }, [router, searchParams]);

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (!error && data.user) {
        router.push("/dashboard");
      } else {
        setIsLoading(false);
      }
    }
    void checkUser().catch(() => {
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    });
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="my-16 flex w-full flex-col items-center justify-center gap-16">
      <Folio className="h-8 w-8" />
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
}
