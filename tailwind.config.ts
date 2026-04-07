import type { Config } from "tailwindcss";

/**
 * Tailwind CSS Configuration
 *
 * This config implements the Banyan Tree luxury design system:
 * - Page background: #E7E6E2
 * - Text: #082B26 (dark forest green)
 * - Primary buttons: #BAA382 (warm tan/bronze)
 * - Filter chips: #173F35 (deep forest green)
 * - Cards: #FFFFFF (pure white)
 * - STRICT SQUARE AESTHETICS (0px border radius everywhere)
 * - Apple HIG-inspired spacing
 *
 * All custom colors are accessible via Tailwind classes:
 * - bg-luxury-cream, text-luxury-brown, text-luxury-gold, etc.
 */
const config: Config = {
  // Enable dark mode via class (for future dark theme support)
  darkMode: ["class"],

  // Scan all source files for Tailwind classes
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      /**
       * LUXURY COLOR PALETTE
       * Based on updated Banyan Tree brand guidelines:
       * - Stone: Page background (#E7E6E2)
       * - Forest: Primary text color (#082B26)
       * - Tan: Primary buttons and accents (#BAA382)
       * - Verdant: Filter chip selected state (#173F35)
       */
      colors: {
        // Primary brand colors
        luxury: {
          cream: "#E7E6E2",  // Page background
          brown: "#153E35",  // Primary text color - dark forest green
          gold: "#85754E",   // Primary buttons/accents - bronze/tan
          forest: "#173F35", // Filter chip active state - deep forest green
        },

        // Extended palette for UI states
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Semantic colors for Shadcn/UI components
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      /**
       * BORDER RADIUS
       * STRICT SQUARE AESTHETICS - All corners are 0px
       * No rounded corners anywhere in the design system.
       */
      borderRadius: {
        lg: "0px",
        md: "0px",
        sm: "0px",
        DEFAULT: "0px",
      },

      /**
       * FONT FAMILY
       * Custom luxury fonts loaded via Next/Font:
       * - Niramit Medium (sans)
       * - Reforma 1969 Negra (main titles/buttons)
       * - Reforma 1969 Gris (secondary titles)
       */
      fontFamily: {
        sans: [
          "var(--font-niramit)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        "reforma-negra": ["var(--font-reforma-negra)", "Georgia", "serif"],
        "reforma-gris": ["var(--font-reforma-gris)", "Georgia", "serif"],
      },

      /**
       * ANIMATIONS
       * Apple-level smooth animations using 300ms spring timing
       * These work in tandem with Framer Motion for complex animations
       */
      keyframes: {
        // Accordion animations for Shadcn/UI
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Subtle fade in for cards and elements
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // Shimmer effect for loading skeletons
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },

      /**
       * SPACING
       * Extended spacing scale for generous whitespace
       * following Apple HIG principles
       */
      spacing: {
        // Touch target minimum (44px)
        "touch": "44px",
        // Safe area for mobile devices
        "safe": "env(safe-area-inset-bottom, 0px)",
      },
    },
  },

  // Tailwind CSS plugins
  plugins: [
    // Add the tailwindcss-animate plugin for Shadcn/UI
    require("tailwindcss-animate"),
  ],
};

export default config;
