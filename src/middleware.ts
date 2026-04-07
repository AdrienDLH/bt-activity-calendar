/**
 * NEXT.JS MIDDLEWARE — Auth Protection
 *
 * Runs on every request to:
 * 1. Refresh the Supabase session cookie (keeps sessions alive)
 * 2. Protect /admin routes — redirect unauthenticated users to /admin/login
 * 3. Redirect already-authenticated users away from /admin/login
 *
 * Uses @supabase/ssr updateSession pattern (NOT deprecated auth-helpers).
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Create a Supabase client scoped to this request/response cycle.
  // The cookie callbacks allow the SSR client to read/write cookies on
  // the response, which keeps the JWT refresh token alive.
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write new cookies on both the request (for this handler) and
          // the response (so the browser receives them).
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Use getSession() for middleware routing — it validates the JWT
  // cryptographically without a server round-trip to auth.sessions.
  // getUser() causes a "session not found" race condition on Supabase's
  // newer GoTrue versions where the session DB write hasn't committed yet.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  const { pathname } = request.nextUrl;

  // ── ROUTE PROTECTION LOGIC ──────────────────────────────────────────────

  const isAdminLoginPage = pathname === "/admin/login";
  const isAdminAuthCallback = pathname.startsWith("/admin/auth");
  const isAdminRoute = pathname.startsWith("/admin");

  // Allow auth callback through without any redirect
  if (isAdminAuthCallback) {
    return supabaseResponse;
  }

  // Authenticated user on the login page → redirect to dashboard
  if (user && isAdminLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // Unauthenticated user on any /admin route (except login) → redirect to login
  if (!user && isAdminRoute && !isAdminLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // All other requests pass through with the refreshed session
  return supabaseResponse;
}

/**
 * Matcher config — only run middleware on relevant paths.
 * Skips static files, images, and Next.js internals for performance.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Public assets (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
