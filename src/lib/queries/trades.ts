import { DatabaseClient } from "@/lib/supabase/db";

export function getTradeHistory(client: DatabaseClient, userId: string) {
  return client
    .from("trades")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}
