/**
 * HERO BANNER COMPONENT
 *
 * Banner below the sticky header.
 * Layout:
 * - Left: "Experience Calendar" title + hotel subtitle (left-aligned)
 * - Right: children slot (used for the tab switcher in calendar-client.tsx)
 * - Stacks vertically on mobile, side-by-side on md+
 *
 * CUSTOMIZATION:
 * - Banner height: min-h-[120px] md:min-h-[140px] below
 * - Gradient: from-luxury-gold/20 via-luxury-gold/10 to-transparent
 * - Text sizes: text-2xl md:text-3xl for heading
 */

"use client";

import { motion } from "framer-motion";

interface HeroBannerProps {
  /** Hotel name displayed in the subtitle */
  hotelName: string;
  /**
   * Right-side slot — used to embed the TabsList so it sits at
   * the same vertical level as the title without adding extra rows.
   */
  children?: React.ReactNode;
}

/**
 * HeroBanner
 *
 * Horizontal hero section: text on the left, optional slot on the right.
 * The decorative background icons are purely ornamental (pointer-events-none).
 */
export function HeroBanner({ hotelName, children }: HeroBannerProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={[
        // Height — shorter now that tabs share the row
        "min-h-[120px] md:min-h-[140px]",
        // Vertical padding only — horizontal spacing handled by inner container
        "py-6 md:py-8",
          "rounded-none",
        "relative overflow-hidden",
      ].join(" ")}
    >
      {/* Inner container matches the main content container so text left-edge aligns */}
      <div className="container mx-auto px-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8 relative z-10">
        {/* ========================================
            LEFT — Title + subtitle
            Left-aligned on all breakpoints
            ======================================== */}
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#153E35] mb-1 text-balance">
            Experience Calendar
          </h2>
          <p className="text-[#153E35] text-sm md:text-base">
            Explore wellbeing activities and exclusive experiences at {hotelName}
          </p>
        </div>

        {/* ========================================
            RIGHT — Tab switcher (passed from parent)
            ======================================== */}
        {children && (
          <div className="shrink-0">
            {children}
          </div>
        )}
      </div>
    </motion.section>
  );
}
