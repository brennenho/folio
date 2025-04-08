"use client";
import { getLeaderboardData } from "@/lib/supabase/actions";
import Image from "next/image";
import { useEffect, useState } from "react";

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
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    [],
  );

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
    <div className="flex w-full justify-center">
      <table className="w-5/6 border-collapse">
        <thead>
          <tr className="justify-between border-b border-gray-100">
            <th className="pb-4 text-center font-normal text-gray-600"></th>
            <th className="border-b border-[#000000] pb-4 text-center font-normal text-gray-600">
              Name
            </th>
            <th className="border-b border-[#000000] pb-4 pl-4 text-center font-normal text-gray-600">
              School
            </th>
            <th className="border-b border-[#000000] pb-4 pl-4 text-center font-normal text-gray-600">
              Club (if applicable)
            </th>
            <th className="border-b border-[#000000] pb-4 pl-4 pr-2 text-center font-normal text-gray-600">
              ROI
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr key={index} className="justify-between border-[#000000]">
              <td className="py-6">
                <span className="text-[#65A30D]">{entry.rank}</span>
              </td>
              <td className="border border-[#000000] px-6 py-6">
                <div className="flex items-center justify-center">
                  <span>{entry.display_name}</span>
                </div>
              </td>
              <td className="flex items-center justify-center border border-[#000000] px-9 py-6">
                <Image
                  src={`/images/schools/${entry.user.school}.png`}
                  alt="School logo"
                  width={70}
                  height={70}
                />
              </td>
              <td className="border border-[#000000] py-6 text-center">
                {entry.user.club}
              </td>
              <td className="border border-[#000000] px-9 py-6 pl-4 text-right">
                <span className="flex items-center justify-center gap-1 text-[#65A30D]">
                  <span>↑</span> {(100 * (10000 - entry.cash)) / 10000}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
