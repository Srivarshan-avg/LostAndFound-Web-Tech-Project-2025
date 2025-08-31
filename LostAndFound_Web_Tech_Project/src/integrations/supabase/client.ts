// src/integrations/supabase/client.ts

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://rpvajjtmpgmcrjaozfve.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwdmFqanRtcGdtY3JqYW96ZnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NDcyNTMsImV4cCI6MjA3MjIyMzI1M30.2i5RXSzlm0xJ7VQkhLcc2IT0uiBK375zEKi7FuA_j3g";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
