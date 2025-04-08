"use client"
import Image from "next/image"
import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react";
import { getLeaderboardData } from "@/lib/supabase/actions";
import { Json } from "@/lib/supabase/types";


interface LeaderboardEntry {
    cash: number;
    account_value: number;
    display_name: string;
}


// const LEADERBOARD_DATA: LeaderboardEntry[] = [
//   {
//     user: {
//         first_name: "Kai",
//         last_name: "Morrick",
//         school: "cornell",
//         club: "Global Investment Society\n(GIS)"
//     },
//     cash: 10000,
//     account_value: 10835
//   },
//   {
//     user: {
//         first_name: "Alex",
//         last_name: "Johnson",
//         school: "upenn",
//         club: "Wharton Investment & Trading\nGroup\n(WITG)"
//     },
//     cash: 10000,
//     account_value: 10812
//   },
//   {
//     user: {
//         first_name: "Jamie",
//         last_name: "Lin",
//         school: "harvard",
//         club: "Global Platinum Securities\n(GPS)"
//     },
//     cash: 10000,
//     account_value: 10631
//   }
// ];

export default function LeaderboardTable() {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getLeaderboardData();
                setLeaderboardData(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        
        fetchData();
    }, []); 
  return (
    <div className="w-full flex justify-center">
      <table className="w-5/6 border-collapse">
        <thead>
          <tr className="border-b justify-between border-gray-100">
            <th className="text-center font-normal text-gray-600 pb-4"></th>
            <th className="text-center font-normal text-gray-600 pb-4 border-b border-[#000000]">Name</th>
            <th className="text-center font-normal text-gray-600 pb-4 border-b border-[#000000] pl-4">School</th>
            <th className="text-center font-normal text-gray-600 pb-4 border-b border-[#000000] pl-4">Club (if applicable)</th>
            <th className="text-center pr-2 font-normal text-gray-600 pb-4 border-b border-[#000000] pl-4">ROI</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr key={index} className=" justify-between border-[#000000]">
                <td className="py-6">
                    <span className="text-[#65A30D]">{entry.rank}</span>
                </td>
              <td className="py-6 px-6 border border-[#000000]">
                <div className="flex items-center justify-center">
                  <span>{entry.display_name}</span>
                </div>
              </td>
            <td className="py-6 px-9 flex justify-center items-center border border-[#000000]">
                <Image
                  src={`/images/schools/${entry.user.school}.png`}
                  alt="School logo"
                  width={70}
                  height={70}
                />
              </td>
              <td className="py-6 border text-center border-[#000000]">{entry.user.club}</td>
              <td className="py-6 px-9 text-right pl-4 border border-[#000000]">
                <span className="text-[#65A30D] flex items-center justify-center gap-1">
                  <span>↑</span> { 100 * (10000 - entry.cash) / 10000}
                </span>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>
  )
 }
