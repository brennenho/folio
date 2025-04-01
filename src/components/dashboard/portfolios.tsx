"use client";

import { createClient } from "@/lib/supabase/client";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PortfolioData {
  id: number;
  title: string;
  data: {
    companies: string[] | null;
  };
}

export function Portfolios() {
  const [portfolios, setPortfolios] = useState<PortfolioData[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchPortfolios = async () => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", user.data.user?.id);

      if (error) {
        toast.error("An error occurred fetching portfolios");
      } else {
        setPortfolios(data || []);
      }
    };
    fetchPortfolios();
  }, []);

  const createPortfolio = async () => {
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("portfolios")
      .insert([
        {
          title: `Portfolio ${portfolios.length + 1}`,
          user_id: user.data.user?.id,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      toast.error("An error occurred creating portfolio");
    } else {
      setPortfolios((prev) => [...prev, data[0]]);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {portfolios.map((portfolio) => (
        <Link key={portfolio.id} href={`/dashboard/${portfolio.id}`}>
          <Portfolio>
            <div className="w-full text-base tracking-[0.32px] text-muted-foreground">
              {portfolio.title}
            </div>

            {/* company icons */}
            <div className="grid w-4/5 grid-cols-5 grid-rows-2 gap-2">
              {portfolio.data?.companies?.slice(0, 10).map((company, index) => (
                <div
                  key={index}
                  className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-full"
                  title={company}
                >
                  <Image
                    src={`https://img.logo.dev/ticker/${company}?format=png&token=${process.env.NEXT_PUBLIC_LOGO_KEY}`}
                    alt={company}
                    fill
                    className="scale-105 transform object-cover"
                  />
                </div>
              ))}
            </div>
          </Portfolio>
        </Link>
      ))}

      <Portfolio onClick={createPortfolio}>
        <div className="my-auto flex h-9 w-9 items-center justify-center rounded-sm bg-muted-foreground text-background">
          <Plus className="h-7 w-7" />
        </div>
      </Portfolio>
    </div>
  );
}

function Portfolio({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex aspect-square w-full cursor-pointer flex-col items-center gap-4 rounded-3xl border-[0.3px] p-4 text-center shadow-sm transition-all hover:shadow-md"
    >
      {children}
    </div>
  );
}
