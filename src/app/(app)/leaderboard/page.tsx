"use client";

import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function LeaderboardPage() {
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  const referralUrl = `https://runfolio.com/join?ref=${profile?.referral_code}`;

  function copyToClipboard() {
    navigator.clipboard
      .writeText(referralUrl)
      .then(() => {
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error("Failed to copy link"));
  }

  function handleShare() {
    if (navigator.share) {
      navigator
        .share({
          title: "Folio Stock Competition",
          text: "Compete with me in folio's stock competition for cash prizes!",
          url: referralUrl,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // fallback for browsers that don't support the Web Share API
      copyToClipboard();
    }
  }

  return (
    <div className="flex min-h-screen flex-col gap-4 p-8">
      <div className="flex flex-col items-center gap-4 p-4 text-center">
        <div className="w-full text-xl font-medium">Rankings</div>
        <div className="">
          Share your referral code (onboard 2 friends) to unlock the full
          leaderboard.
        </div>
        <div className="flex items-center justify-center gap-4">
          <div
            className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 transition-colors hover:bg-gray-100"
            onClick={copyToClipboard}
          >
            <span>{referralUrl}</span>
            <Button variant="ghost" className="p-0">
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </Button>
          </div>
          <Button onClick={handleShare}>Share</Button>
        </div>
        <div className="flex w-full items-center justify-center gap-4">
          <div className="flex w-1/2 items-center">
            <Progress value={(profile?.referrals ?? 0) * 50} />
          </div>
          {profile?.referrals ?? 0} / 2
        </div>
      </div>

      <LeaderboardTable />
    </div>
  );
}
