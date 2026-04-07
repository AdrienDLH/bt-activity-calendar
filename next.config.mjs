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
};

export default nextConfig;
