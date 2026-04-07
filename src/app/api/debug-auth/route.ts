import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const allCookies = request.cookies.getAll();
  const authCookies = allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-'));

  let user = null;
  let sessionError = null;
  let session = null;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );

  const userResult = await supabase.auth.getUser();
  user = userResult.data.user;
  sessionError = userResult.error?.message;

  const sessionResult = await supabase.auth.getSession();
  session = sessionResult.data.session ? {
    access_token_preview: sessionResult.data.session.access_token?.slice(0, 50) + '...',
    expires_at: sessionResult.data.session.expires_at,
    user_id: sessionResult.data.session.user?.id,
  } : null;

  return NextResponse.json({
    auth_cookie_count: authCookies.length,
    auth_cookie_names: authCookies.map(c => c.name),
    getUser_result: user ? { id: user.id, email: user.email } : null,
    getUser_error: sessionError,
    getSession_result: session,
    total_cookies: allCookies.length,
  });
}
