"use client";

import { createClient } from "@/lib/supabase/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CompanyLogo } from "../company-logo";

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

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {portfolios.map((portfolio) => (
        <Portfolio key={portfolio.id} href={`/dashboard/${portfolio.id}`}>
          <div className="w-full text-base tracking-[0.32px] text-muted-foreground">
            {portfolio.title}
          </div>

          {/* company icons */}
          <div className="grid w-4/5 grid-cols-5 grid-rows-2 gap-2">
            {portfolio.data?.companies
              ?.slice(0, 10)
              .map((company, index) => (
                <CompanyLogo key={index} company={company} />
              ))}
          </div>
        </Portfolio>
      ))}

      <Portfolio href="/chat">
        <div className="my-auto flex h-9 w-9 items-center justify-center rounded-sm bg-muted-foreground text-background">
          <Plus className="h-7 w-7" />
        </div>
      </Portfolio>
    </div>
  );
}

function Portfolio({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <Link href={href || ""}>
      <div className="flex aspect-square w-full cursor-pointer flex-col items-center gap-4 rounded-3xl border-[0.3px] p-4 text-center shadow-sm transition-all hover:shadow-md">
        {children}
      </div>
    </Link>
  );
}
