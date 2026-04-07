/**
 * PRIVATE SESSION FAB COMPONENT
 *
 * Floating Action Button for requesting private sessions.
 * Only visible on mobile (desktop shows button in header).
 *
 * Features:
 * - Fixed position at bottom-right
 * - Smooth entrance animation
 * - Bouncy hover/tap effects
 *
 * CUSTOMIZATION:
 * - Position via bottom-20 right-4
 * - Icon and colors in the button styling
 * - Animation timing in motion props
 */

"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrivateSessionFabProps {
  /** Callback when FAB is clicked */
  onClick: () => void;
}

/**
 * PrivateSessionFab
 *
 * Renders a floating action button for mobile users.
 * Hidden on tablet/desktop where header button is visible.
 */
export function PrivateSessionFab({ onClick }: PrivateSessionFabProps) {
  return (
    <motion.button
      // Slide up and fade in on mount
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
      // Bouncy hover and tap effects
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        // Fixed positioning (bottom-right, above safe area)
        "fixed bottom-20 right-4 z-40 md:hidden",
        // Circular button
        "w-14 h-14 rounded-none",
        // Gold background with shadow
        "bg-luxury-gold text-white shadow-lg",
        // Flex for icon centering
        "flex items-center justify-center",
        // Hover shadow enhancement
        "hover:shadow-xl",
        // Transition for shadow
        "transition-shadow duration-300"
      )}
      aria-label="Request Private Session"
    >
      <FileText className="h-6 w-6" />
    </motion.button>
  );
}
