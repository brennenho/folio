import type { DatabaseClient } from "@/lib/supabase/db";
import type { Database } from "@/lib/supabase/types";
import { createBrowserClient } from "@supabase/ssr";
import { useMemo } from "react";

let client: DatabaseClient | undefined;

export function createClient() {
  if (client) {
    return client;
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return client;
}

export function useSupabase() {
  return useMemo(() => createClient(), []);
}
