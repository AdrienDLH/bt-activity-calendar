/** @type {import('next').NextConfig} */

/**
 * Next.js Configuration
 *
 * This configures the Next.js 14 App Router project for the
 * Banyan Tree Luxury Hotel Activity Calendar.
 *
 * Key settings:
 * - images.remotePatterns: Allow images from Supabase storage
 */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,


  // Configure remote image patterns for Next.js Image optimization
  // This allows loading images from Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "workers.paper.design",
      },
    ],
  },

  /**
   * SECURITY HEADERS (applied to every route)
   *
   * Defence-in-depth against common web attacks:
   * - HSTS: force HTTPS for a year (no preload, so it stays reversible).
   * - X-Frame-Options / frame-ancestors: block clickjacking (same-origin only).
   * - X-Content-Type-Options: stop MIME-sniffing.
   * - Referrer-Policy: don't leak full URLs cross-origin.
   * - Permissions-Policy: disable device APIs the site never uses.
   * - CSP: restrict where scripts/styles/images/connections may load from.
   *   'unsafe-inline' is required because Next.js injects inline bootstrap
   *   scripts/styles without a nonce; the policy still blocks external script
   *   injection, object/base hijacking, and cross-origin framing.
   */
  async headers() {
    // Next.js Fast Refresh (dev only) evaluates strings as JS, which needs
    // 'unsafe-eval'. Production builds don't ship Fast Refresh, so prod keeps
    // the stricter policy without 'unsafe-eval'.
    const isDev = process.env.NODE_ENV !== "production";
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "connect-src 'self' https://*.supabase.co",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },

  /**
   * The aws2026.banyantree.com subdomain is dedicated to the AWS 2026 microsite.
   * Visiting its root sends the user straight to the microsite (/aws). Scoped by
   * host, so it has no effect on the main bt-activity-calendar.vercel.app domain.
   */
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "aws2026.banyantree.com" }],
        destination: "/aws",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
