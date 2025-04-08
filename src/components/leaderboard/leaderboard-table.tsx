"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export function LeaderboardTable() {
  const supabase = createClient();

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
    <div className="flex w-full justify-center">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">School</TableHead>
            <TableHead className="text-right">ROI</TableHead>
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
                {((100 * (10000 - entry.cash)) / 10000).toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                  },
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
