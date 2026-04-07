/**
 * LOGIN ROUTE — POST /api/auth/login
 *
 * Handles password-based login via a native HTML form POST.
 *
 * WHY THIS PATTERN:
 * Server Actions + useFormState have a known issue in Next.js 14 where session
 * cookies set during the action may not reach the browser before the client-side
 * navigation fires, causing the middleware to see no session and redirect back
 * to login. This route uses the same reliable pattern as the magic link callback:
 * build the NextResponse first, set cookies directly on it, then return it.
 * Because this is a real HTTP redirect (not a JS navigation), the browser
 * commits all Set-Cookie headers before following the Location header.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const origin = new URL(request.url).origin;

  // Build the success redirect response FIRST so session cookies can be
  // attached directly to it — same pattern as /admin/auth/callback.
  const successResponse = NextResponse.redirect(`${origin}/admin`, {
    status: 303, // 303 See Other — correct for POST → redirect
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // Write session cookies directly onto the redirect response.
        // On http://localhost the browser silently drops Secure cookies,
        // so we strip that flag in development.
        setAll(cookiesToSet) {
          const isLocalhost = origin.startsWith("http://localhost");
          cookiesToSet.forEach(({ name, value, options }) =>
            successResponse.cookies.set(name, value, {
              ...options,
              secure: isLocalhost ? false : options?.secure,
            })
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Redirect back to login with an error flag the page can display
    return NextResponse.redirect(
      `${origin}/admin/login?error=${encodeURIComponent(error.message)}`,
      { status: 303 }
    );
  }

  // Session cookies are on successResponse — browser commits them, then follows redirect
  return successResponse;
}
