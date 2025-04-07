"use client";

import { CompanyLogo } from "@/components/company-logo";
import { Folio } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserData {
  user_id: string;
  cash: number;
  stocks: [
    {
      ticker: string;
      shares: number;
    },
  ];
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<UserData>();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data, error } = await supabase
        .from("user_data")
        .select("*")
        .eq("user_id", user?.id);

      if (error) {
        toast.error("An error occurred fetching your portfolio");
      } else {
        if (data.length === 0) {
          const { data: newData, error: insertError } = await supabase
            .from("user_data")
            .insert({ user_id: user?.id, cash: 10000, stocks: [] })
            .select();

          if (insertError) {
            toast.error("An error occurred creating your portfolio");
          } else {
            setPortfolio(newData[0]);
          }
        } else {
          setPortfolio(data[0]);
        }
      }

      setLoading(false);
    };

    void fetchUser();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 px-12 py-8 text-xl">
      <div className="w-full text-2xl font-bold tracking-[0.48px]">
        Welcome {user?.user_metadata.first_name}!
      </div>
      <div className="flex w-full flex-col gap-8 text-center tracking-[0.4px] md:h-[230px] md:flex-row">
        <Card className="flex h-full w-full flex-col items-center justify-center gap-2 md:w-[230px]">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-muted-foreground text-background">
            <Plus className="h-7 w-7" />
          </div>
          Create Folio
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
      <Card className="flex min-h-[300px] w-full flex-grow flex-col">
        <div className="p-4">
          <Link href="/trade">
            <Button>Make a Trade</Button>
          </Link>
        </div>
        {portfolio && portfolio.stocks && portfolio.stocks.length > 0 ? (
          <div className="grid w-full grid-cols-5 grid-rows-2 gap-2 p-4">
            {portfolio.stocks.slice(0, 10).map((company, index) => (
              <CompanyLogo key={index} company={company.ticker} />
            ))}
          </div>
        ) : (
          <div className="mx-auto flex flex-col items-center justify-center gap-2 pt-8">
            <Folio className="h-8 w-8" />{" "}
            <div>Your Folio is currently empty</div>
          </div>
        )}
      </Card>
    </div>
  );
}
