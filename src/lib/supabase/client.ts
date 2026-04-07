/**
 * SUPABASE CLIENT - Browser/Client Components
 *
 * Creates a Supabase client for use in Client Components.
 * Uses @supabase/ssr for proper cookie handling in Next.js App Router.
 *
 * USAGE:
 * "use client";
 * import { createClient } from "@/lib/supabase/client";
 * const supabase = createClient();
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Creates a Supabase client for browser/client-side usage.
 *
 * This client is used in:
 * - Client Components ("use client")
 * - Event handlers
 * - Real-time subscriptions
 *
 * @returns Typed Supabase client instance
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
