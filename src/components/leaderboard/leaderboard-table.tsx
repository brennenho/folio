"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function LeaderboardTable({ referrals }: { referrals: number }) {
  const supabase = createClient();
  const needsMoreReferrals = referrals < 2;

  const { data, error, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("account_value", { ascending: false });

      return data ?? [];
    },
  });

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className={cn("w-full", needsMoreReferrals && "relative")}>
        <Table className={cn(needsMoreReferrals && "select-none blur-sm")}>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">School</TableHead>
              <TableHead className="text-right">Account Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((entry, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-2">
                  <div>{index + 1}</div>{" "}
                  <div>
                    {entry.first_name} {entry.last_name}
                  </div>
                </TableCell>
                <TableCell className="text-center">{entry.school}</TableCell>
                <TableCell className="text-right">
                  {entry.account_value.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {needsMoreReferrals && (
          <div className="absolute inset-0 flex cursor-not-allowed items-center justify-center">
            <div className="rounded-md bg-background/80 p-4 text-center shadow-md">
              <div className="text-lg font-semibold">Leaderboard Locked</div>
              <div className="text-sm text-muted-foreground">
                Refer {2 - referrals} more{" "}
                {referrals === 1 ? "person" : "people"} to unlock
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
