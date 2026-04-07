/**
 * SUPABASE CLIENT - Server Components & Server Actions
 *
 * Creates a Supabase client for use in Server Components and Server Actions.
 * Uses @supabase/ssr with Next.js cookies() for proper session handling.
 *
 * USAGE:
 * import { createClient } from "@/lib/supabase/server";
 * const supabase = await createClient();
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Creates a Supabase client for server-side usage.
 *
 * This client is used in:
 * - Server Components (default in App Router)
 * - Server Actions
 * - Route Handlers
 *
 * @returns Promise resolving to typed Supabase client instance
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
