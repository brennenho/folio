import type { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";

export type DatabaseClient = SupabaseClient<Database>;
