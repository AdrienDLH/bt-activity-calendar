/**
 * ADMIN LOGIN PAGE — /admin/login
 *
 * Server Component wrapper. Reads ?error= from the URL (set by the login API
 * route on failed password login) and passes it to the Client Component.
 * This avoids useSearchParams/Suspense complexity in the client.
 */

import { LoginForm } from "./login-form";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return <LoginForm routeError={searchParams.error ?? null} />;
}
