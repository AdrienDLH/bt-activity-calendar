import "server-only";

/**
 * SUPABASE ADMIN CLIENT — Service Role
 *
 * Uses the SERVICE_ROLE key which bypasses RLS and exposes
 * `auth.admin.*` operations (createUser, deleteUser, listUsers, etc.).
 *
 * IMPORTANT: never import this file from a Client Component.
 * The `server-only` marker above turns that into a build-time error.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (Project Settings → API → Service Role Secret)."
    );
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        // Admin client never uses cookies — it's a pure server-to-server client
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
