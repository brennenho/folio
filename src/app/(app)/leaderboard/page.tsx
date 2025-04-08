"use client";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { Button } from "@/components/ui/button";

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 bg-white">
        <div className="mx-auto max-w-6xl items-center px-2 py-6">
          <div className="mb-12 flex">
            <h1 className="w-full text-center text-xl font-medium">Rankings</h1>
          </div>
          <div className="mb-12 text-center">
            <p className="mb-4 text-gray-600">
              Share your referral code (onboard 2 friends) to unlock the full
              leaderboard.
            </p>
            <div className="mx-auto flex max-w-md gap-2">
              <input
                type="text"
                value="[referral code]"
                readOnly
                className="flex-1 rounded-md border bg-white px-4 py-2"
              />
              <Button className="rounded-md bg-black px-4 py-2 text-white">
                Copy
              </Button>
            </div>
            <div className="mx-auto mt-4 h-1.5 max-w-md overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-1/2 bg-gradient-to-r from-[#65A30D] to-[#65A30D]" />
            </div>
          </div>
          <LeaderboardTable />
        </div>
      </div>
    </div>
  );
}
