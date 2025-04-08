"use client"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LeaderboardTable from "@/components/leaderboard/leaderboard-table"
import { Button } from "@/components/ui/button"

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen">
        <div className="flex-1 bg-white">
          <div className="max-w-6xl px-2 py-6 mx-auto items-center">
            <div className="flex mb-12">
              <h1 className="text-xl text-center font-medium w-full">Rankings</h1>
            </div>
           <div className="mb-12 text-center">
            <p className="text-gray-600 mb-4">
              Share your referral code (onboard 2 friends) to unlock the full leaderboard.
            </p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="text"
                value="[referral code]"
                readOnly
                className="flex-1 px-4 py-2 border rounded-md bg-white"
              />
              <Button className="px-4 py-2 bg-black text-white rounded-md">
                Copy
              </Button>
            </div>
            <div className="max-w-md mx-auto mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-[#65A30D] to-[#65A30D]" />
            </div>
           </div>
          <LeaderboardTable />
        </div>
      </div>
    </div>
  )
}
