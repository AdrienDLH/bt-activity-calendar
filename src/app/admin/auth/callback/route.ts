/**
 * AUTH CALLBACK ROUTE — /admin/auth/callback
 *
 * Handles the redirect from Supabase after a user clicks their magic link.
 * Exchanges the one-time `code` query param for a real session cookie,
 * then redirects the user to the admin dashboard.
 *
 * Flow:
 *   User clicks email link
 *   → Supabase redirects to this URL with ?code=xxx
 *   → We exchange the code for a session
 *   → Redirect to /admin
 *
 * IMPORTANT: We must set cookies directly on the NextResponse object.
 * Using `cookies()` from next/headers and then returning a separate
 * NextResponse.redirect() does NOT carry the Set-Cookie headers over —
 * the session would be lost and the user would be bounced back to login.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // If there's no code, something went wrong — redirect to login with an error hint
  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=no_code`);
  }

  // Build the redirect response FIRST so we can attach cookies to it directly.
  // This is the correct SSR pattern — cookies set on this response object will
  // be sent to the browser as Set-Cookie headers in the same HTTP response.
  const response = NextResponse.redirect(`${origin}/admin`);

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read cookies from the incoming request
        getAll() {
          return request.cookies.getAll();
        },
        // Write session cookies directly onto the redirect response.
        // On http://localhost the browser silently drops Secure cookies,
        // so we strip that flag in development.
        setAll(cookiesToSet) {
          const isLocalhost = new URL(request.url).origin.startsWith("http://localhost");
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, {
              ...options,
              secure: isLocalhost ? false : options?.secure,
            })
          );
        },
      },
    }
  );

  // Exchange the one-time code for a persistent session cookie
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // Code was invalid or expired — send back to login
    return NextResponse.redirect(
      `${origin}/admin/login?error=auth_failed`
    );
  }

  // Session cookies are now on `response` — return it to complete the login
  return response;
}
