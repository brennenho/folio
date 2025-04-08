"use client";

import { Holdings } from "@/components/dashboard/holdings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";
import { getMarketStatus, getStockPrice } from "@/lib/trades";
import { generateReferralCode } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type HoldingWithPrice = {
  ticker: string;
  quantity: number;
  spend: number;
  user_id: string;
  currentPrice?: number;
  totalValue?: number;
  gainLoss?: number;
  gainLossPercentage?: number;
};

export default function Dashboard() {
  const [marketStatus, setMarketStatus] = useState({
    isOpen: false,
    closesIn: "",
  });
  const [accountValue, setAccountValue] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const checkMarketStatus = () => {
      const status = getMarketStatus();
      setMarketStatus(status);
    };

    checkMarketStatus();
    const marketTimer = setInterval(checkMarketStatus, 60000);
    return () => clearInterval(marketTimer);
  }, []);

  const { data: user, error: userError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: profile, error: profileError } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // TODO: move this to a database trigger
      if (error && error.code === "PGRST116") {
        let referredBy = null;
        if (typeof window !== "undefined") {
          referredBy = localStorage.getItem("referralCode");
          localStorage.removeItem("referralCode");
        }

        // First create the new user profile
        const { data: newData, error: insertError } = await supabase
          .from("profiles")
          .upsert({
            first_name: user.user_metadata?.first_name || "",
            last_name: user.user_metadata?.last_name || "",
            referral_code: generateReferralCode(user.id),
          })
          .select()
          .single();

        if (insertError) throw new Error(insertError.message);

        if (referredBy) {
          try {
            const { data: referrerData, error: referrerError } = await supabase
              .from("profiles")
              .select("*")
              .eq("referral_code", referredBy)
              .single();

            if (referrerError) {
              console.error("Error finding referrer:", referrerError);
            } else if (referrerData) {
              const { error: updateError } = await supabase
                .from("profiles")
                .update({
                  referrals: (referrerData.referrals || 0) + 1,
                })
                .eq("referral_code", referredBy);

              if (updateError) {
                console.error("Error updating referral count:", updateError);
              } else {
                toast.success("Successfully joined with referral code!");
              }
            }
          } catch (error) {
            console.error("Error processing referral:", error);
          }
        }

        return newData;
      }

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user?.id,
  });

  const {
    data: holdings,
    error: holdingsError,
    isLoading,
  } = useQuery({
    queryKey: ["holdings", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("holdings")
        .select("*")
        .eq("user_id", user?.id)
        .order("spend", { ascending: false });

      if (error) {
        toast.error("An error occurred fetching your holdings");
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // fetch current prices for each holding
      const holdingsWithPrices: HoldingWithPrice[] = await Promise.all(
        data.map(async (holding) => {
          try {
            const currentPrice = await getStockPrice(holding.ticker);

            const quantity = holding.quantity ?? 0;

            const totalValue = parseFloat((quantity * currentPrice).toFixed(2));
            const gainLoss = parseFloat(
              (totalValue - holding.spend).toFixed(2),
            );
            const gainLossPercentage = parseFloat(
              ((gainLoss / holding.spend) * 100).toFixed(2),
            );

            return {
              ...holding,
              quantity,
              currentPrice: parseFloat(currentPrice.toFixed(2)),
              totalValue,
              gainLoss,
              gainLossPercentage,
            };
          } catch {
            toast.error(`Error fetching price for ${holding.ticker}`);
            return { ...holding, quantity: holding.quantity ?? 0 };
          }
        }),
      );
      return holdingsWithPrices;
    },
    enabled: !!user?.id,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ["userRanking", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("account_value", { ascending: false });

      if (!data) return null;

      const currentUserIndex = data.findIndex((p) => p.user_id === user.id);
      if (currentUserIndex === -1) return null;

      return {
        userAbove: currentUserIndex > 0 ? data[currentUserIndex - 1] : null,
        currentUser: data[currentUserIndex],
        userBelow:
          currentUserIndex < data.length - 1
            ? data[currentUserIndex + 1]
            : null,
        rank: currentUserIndex + 1,
        totalUsers: data.length,
      };
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user?.id || !holdings) return;

    const totalValue =
      holdings.reduce((sum, holding) => sum + (holding.totalValue ?? 0), 0) +
      (profile?.cash ?? 0);

    setAccountValue(totalValue);

    // update the account value in the database
    const updateAccountValue = async () => {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ account_value: totalValue })
          .eq("user_id", user.id);

        if (error) throw error;
      } catch {
        toast.error("An error occurred updating account value");
      }
    };

    updateAccountValue();
  }, [holdings, profile?.cash, user?.id, supabase]);

  useEffect(() => {
    if (userError || profileError || holdingsError) {
      console.error("An error occurred while fetching user data");
    }
  }, [userError]);

  const change = (accountValue ?? 0) - (profile?.prev_account_value ?? 0);

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 px-12 py-8">
      <div className="w-full text-2xl font-bold tracking-[0.48px]">
        Welcome {user?.user_metadata.first_name}!
      </div>
      <div className="flex w-full flex-col justify-center gap-8 text-center tracking-[0.4px] md:h-[230px] md:flex-row">
        <Card className="flex h-full w-full flex-col items-center justify-between gap-2 p-6 md:w-[230px]">
          <div className="flex w-full flex-grow flex-col items-center justify-center gap-3">
            <div className="font-bold">
              Market is{" "}
              {marketStatus.isOpen ? (
                <span className="text-[#66873C]">Open</span>
              ) : (
                <span className="text-[#D9534F]">Closed</span>
              )}
            </div>
            {marketStatus.isOpen && <div>{marketStatus.closesIn}</div>}
          </div>
          <Link href="/trade" className="w-full">
            <Button className="w-full">Make a Trade</Button>
          </Link>
        </Card>

        <Card className="flex h-full w-full flex-col items-center justify-center gap-6 p-4 md:w-[445px]">
          {isLoading || !holdings ? (
            <Spinner />
          ) : (
            <>
              <div className="inline-flex items-center gap-2">
                <div>Account Value:</div>
                <div className="font-bold">
                  {" "}
                  $
                  {(
                    (holdings?.reduce(
                      (sum, holding) => sum + (holding.totalValue ?? 0),
                      0,
                    ) || 0) + (profile?.cash ?? 0)
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div>Today&apos;s Change:</div>
                  <div
                    className={`font-bold ${change >= 0 ? "text-[#66873C]" : "text-[#D9534F]"}`}
                  >
                    {change >= 0 ? "+" : ""}
                    {change.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div>Buying Power:</div>
                  <div className="font-bold">
                    $
                    {(profile?.cash ?? 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>

        <Card className="flex h-full w-full items-center justify-center md:w-[422px]">
          {isLoading || !profile ? (
            <Spinner />
          ) : (
            <div className="flex w-full flex-col gap-4 p-4">
              <div className="text-lg font-bold">Your Ranking</div>

              <div className="flex w-full flex-col space-y-3">
                {/* Query for leaderboard data */}
                {(() => {
                  if (!leaderboardData) return <Spinner />;

                  return (
                    <>
                      {leaderboardData.userAbove && (
                        <div className="flex items-center justify-between rounded-md px-2 py-1 opacity-70">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">
                              {leaderboardData.rank - 1}.
                            </div>
                            <div>
                              {leaderboardData.userAbove.first_name}{" "}
                              {leaderboardData.userAbove.last_name}
                            </div>
                          </div>
                          <div>
                            $
                            {leaderboardData.userAbove.account_value.toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between rounded-md border px-3 py-2 font-semibold">
                        <div className="flex items-center gap-2">
                          <div>{leaderboardData.rank}.</div>
                          <div>You</div>
                        </div>
                        <div>
                          $
                          {leaderboardData.currentUser?.account_value?.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          ) || "N/A"}
                        </div>
                      </div>

                      {leaderboardData.userBelow && (
                        <div className="flex items-center justify-between rounded-md px-2 py-1 opacity-70">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">
                              {leaderboardData.rank + 1}.
                            </div>
                            <div>
                              {leaderboardData.userBelow.first_name}{" "}
                              {leaderboardData.userBelow.last_name}
                            </div>
                          </div>
                          <div>
                            $
                            {leaderboardData.userBelow.account_value.toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-2 text-center text-xs text-muted-foreground">
                        Your rank: {leaderboardData.rank} of{" "}
                        {leaderboardData.totalUsers}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="m-4 flex w-[260px] flex-col items-center border-b-[0.2px] p-4 text-card-foreground">
        Holdings
      </div>
      <Card className="flex min-h-[300px] w-full flex-grow flex-col items-center justify-center p-6">
        {isLoading || !holdings ? (
          <Spinner className="my-auto" />
        ) : (
          <Holdings holdings={holdings ?? []} />
        )}
      </Card>
    </div>
  );
}
