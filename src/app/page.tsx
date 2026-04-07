/**
 * HOME PAGE - Redirect to Hotel Selection
 *
 * The root page redirects users or shows a landing page.
 * In production, this would redirect to a specific hotel's calendar
 * or show a hotel selector for the multi-tenant system.
 *
 * DESIGN NOTES:
 * - Clean, minimal layout following Apple HIG
 * - Uses the luxury color palette (cream, brown, gold)
 * - Large touch targets for mobile users
 */

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      {/*
        HERO SECTION
        Centered content with generous whitespace.
        The max-w-md keeps text readable on large screens.
      */}
      <div className="max-w-md w-full text-center space-y-8">
        {/*
          LOGO PLACEHOLDER
          Replace with actual Banyan Tree logo in production.
          The rounded-none gives a soft, luxurious appearance.
        */}
        <div className="w-24 h-24 mx-auto bg-luxury-gold/20 rounded-none flex items-center justify-center">
          <span className="text-4xl text-luxury-gold font-semibold">BT</span>
        </div>

        {/*
          HEADING
          text-balance ensures attractive text wrapping.
          The color transitions from brown to gold for hierarchy.
        */}
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-luxury-brown text-balance">
            Banyan Tree Experience Calendar
          </h1>
          <p className="text-[#153E35] text-lg">
            Discover wellness experiences and exclusive activities at our luxury
            resorts.
          </p>
        </div>

        {/*
          CTA BUTTON
          Large touch target (min 44px) following Apple HIG.
          Gold background with smooth hover transition.
          rounded-none for soft, premium feel.
        */}
        <Link
          href="/demo"
          className="inline-flex items-center justify-center px-8 py-4 min-h-[44px]
                     bg-luxury-gold text-white font-medium rounded-none
                     hover:bg-luxury-gold/90 active:scale-[0.98]
                     transition-all duration-200 ease-out
                     shadow-sm hover:shadow-md"
        >
          View Demo Calendar
        </Link>

        {/*
          ADMIN LINK
          Secondary action with subtle styling.
          Uses underline on hover for clear interaction feedback.
        */}
        <div className="pt-4">
          <Link
            href="/admin"
            className="text-sm text-[#153E35] hover:text-luxury-gold
                       transition-colors duration-200"
          >
            Admin Dashboard →
          </Link>
        </div>
      </div>

      {/*
        FOOTER NOTE
        Subtle branding at the bottom.
        The text-xs keeps it unobtrusive.
      */}
      <footer className="absolute bottom-6 text-center">
        <p className="text-xs text-[#153E35]">
          © {new Date().getFullYear()} Banyan Tree Group. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
