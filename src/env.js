import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    GOOGLE_CLIENT_EMAIL: z.string(),
    GOOGLE_PRIVATE_KEY: z.string(),
    SPREADSHEET_ID: z.string(),
    POLYGON_API_KEY: z.string(),
  },

  client: {
    NEXT_PUBLIC_WEB3_FORMS_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_LOGO_KEY: z.string(),
    NEXT_PUBLIC_FOLIO_API_URL: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    SPREADSHEET_ID: process.env.SPREADSHEET_ID,
    POLYGON_API_KEY: process.env.POLYGON_API_KEY,
    NEXT_PUBLIC_WEB3_FORMS_KEY: process.env.NEXT_PUBLIC_WEB3_FORMS_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_LOGO_KEY: process.env.NEXT_PUBLIC_LOGO_KEY,
    NEXT_PUBLIC_FOLIO_API_URL: process.env.NEXT_PUBLIC_FOLIO_API_URL,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
