"use client";

import { Holdings } from "@/components/dashboard/holdings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { getMarketStatus } from "@/lib/trades";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [marketStatus, setMarketStatus] = useState({
    isOpen: false,
    closesIn: "",
  });
  const supabase = createClient();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkMarketStatus = () => {
      const status = getMarketStatus();
      setMarketStatus(status);
    };

    checkMarketStatus();
    const marketTimer = setInterval(checkMarketStatus, 60000);
    return () => clearInterval(marketTimer);
  }, []);

  const { data: user, error: userError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: portfolio, error: portfolioError } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("user_data")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (userError || portfolioError) {
      console.error("An error occurred while fetching user data");
    }
  }, [userError]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 px-12 py-8">
      <div className="w-full text-2xl font-bold tracking-[0.48px]">
        Welcome {user?.user_metadata.first_name}!
      </div>
      <div className="flex w-full flex-col justify-center gap-8 text-center tracking-[0.4px] md:h-[230px] md:flex-row">
        <Card className="flex h-full w-full flex-col items-center justify-between gap-2 p-6 md:w-[230px]">
          <div className="flex w-full flex-grow flex-col items-center justify-center gap-3">
            <div className="font-bold">
              Market is{" "}
              {marketStatus.isOpen ? (
                <span className="text-[#66873C]">Open</span>
              ) : (
                <span className="text-[#D9534F]">Closed</span>
              )}
            </div>
            {marketStatus.isOpen && <div>{marketStatus.closesIn}</div>}
          </div>
          <Link href="/trade" className="w-full">
            <Button className="w-full">Make a Trade</Button>
          </Link>
        </Card>

        <Card className="flex h-full w-full flex-col items-center justify-center gap-6 p-4 md:w-[445px]">
          <div className="inline-flex items-center gap-2">
            <div>Account Value:</div>
            <div className="font-bold">$100000</div>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-2">
              <div>Today&apos;s Change:</div>
              <div className="font-bold text-[#66873C]">+$0.05</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div>Buying Power:</div>
              <div className="font-bold">
                $
                {(portfolio?.cash ?? 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex h-full w-full items-center justify-center md:w-[422px]">
          [rank]
        </Card>
      </div>

      <div className="m-4 flex w-[260px] flex-col items-center border-b-[0.2px] p-4 text-card-foreground">
        Holdings
      </div>
      <Card className="flex min-h-[300px] w-full flex-grow flex-col items-center p-6">
        <Holdings user_id={user?.id ?? ""} />
      </Card>
    </div>
  );
}
