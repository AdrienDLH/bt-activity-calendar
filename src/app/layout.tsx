/**
 * ROOT LAYOUT - Banyan Tree Luxury Hotel Activity Calendar
 *
 * This is the top-level layout that wraps all pages.
 * It provides:
 * 1. Global CSS styles
 * 2. Font configuration
 * 3. Metadata for SEO
 * 4. Toaster for notifications
 *
 * DESIGN NOTES:
 * - Uses system fonts for optimal performance
 * - Applies the warm cream background globally
 * - Sets up Sonner toaster with luxury styling
 */

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

/**
 * CUSTOM FONTS CONFIGURATION
 * Next.js local font optimization.
 */

// Base body text (Niramit Medium)
const fontNiramit = localFont({
  src: "../fonts/Niramit-Medium.ttf",
  variable: "--font-niramit",
  weight: "500",
  display: "swap",
});

// Main Titles & Buttons (Reforma Negra)
const fontReformaNegra = localFont({
  src: "../fonts/Reforma1969-Negra.otf",
  variable: "--font-reforma-negra",
  weight: "900", // Negra is typically black/heavy
  display: "swap",
});

// Secondary Titles (Reforma Gris)
const fontReformaGris = localFont({
  src: "../fonts/Reforma1969-Gris.otf",
  variable: "--font-reforma-gris",
  weight: "400", // Gris is typically regular/medium
  display: "swap",
});

/**
 * METADATA
 *
 * Default SEO metadata for the entire application.
 * Individual pages can override these values.
 */
export const metadata: Metadata = {
  title: {
    default: "Experience Calendar | Banyan Tree",
    template: "%s | Banyan Tree Experience Calendar",
  },
  description:
    "Discover wellness activities, excursions, and exclusive experiences at Banyan Tree luxury resorts.",
  keywords: [
    "Banyan Tree",
    "luxury resort",
    "wellness",
    "activities",
    "spa",
    "hotel experiences",
  ],
};

/**
 * VIEWPORT CONFIGURATION
 *
 * Mobile-optimized viewport settings:
 * - Responsive width
 * - Prevents unwanted zoom on form inputs
 * - Theme color matches our cream background
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // Theme color for browser UI (Safari, Chrome mobile)
  themeColor: "#F8F5F0",
  // Ensure proper rendering on notched devices
  viewportFit: "cover",
};

/**
 * ROOT LAYOUT COMPONENT
 *
 * Wraps all pages with essential providers and global elements.
 *
 * @param children - The page content to render
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        BODY STYLING
        - Injects CSS variables for all three custom fonts
        - Uses font-sans (mapped to Niramit) as base
        - antialiased: Smooth font rendering
        - bg-background: Applies the cream background color
        - text-[#153E35]: Applies the brown text color
      */}
      <body
        className={`${fontNiramit.variable} ${fontReformaNegra.variable} ${fontReformaGris.variable} font-sans antialiased bg-background text-[#153E35] min-h-screen`}
      >
        {/* Main content area */}
        {children}

        {/*
          SONNER TOASTER
          Notification toasts styled to match our luxury design system.

          Customization options:
          - position: Where toasts appear (default: bottom-right)
          - richColors: Enables semantic coloring for success/error
          - toastOptions: Style overrides for the toast container

          To change toast position, modify the 'position' prop:
          - "top-right" | "top-center" | "top-left"
          - "bottom-right" | "bottom-center" | "bottom-left"
        */}
        <Toaster
          position="bottom-center"
          richColors
          toastOptions={{
            // Apply luxury styling to all toasts
            classNames: {
              toast:
                "rounded-none shadow-lg border-border/50 font-sans",
              title: "text-[#153E35] font-medium",
              description: "text-[#153E35]",
              success: "bg-card border-green-200",
              error: "bg-card border-red-200",
              info: "bg-card",
            },
          }}
        />
      </body>
    </html>
  );
}
