/**
 * CALENDAR HEADER COMPONENT
 *
 * Sticky header displaying hotel branding and navigation.
 * Features:
 * - Hotel logo and name
 * - "Request Private Session" button (desktop)
 * - Smooth backdrop blur on scroll
 *
 * CUSTOMIZATION:
 * - Modify bg-background/95 for background opacity
 * - Modify backdrop-blur-md for blur intensity
 * - Logo size is controlled by h-10 w-auto
 */

"use client";

import Image from "next/image";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Hotel } from "@/types/database";

interface CalendarHeaderProps {
  /** The hotel data for branding */
  hotel: Hotel;
  /** Callback when "Request Private Session" is clicked */
  onRequestSession?: () => void;
}

/**
 * CalendarHeader
 *
 * Renders the sticky header with hotel branding.
 * The header becomes semi-transparent with blur when scrolled.
 */
export function CalendarHeader({
  hotel,
  onRequestSession,
}: CalendarHeaderProps) {
  return (
    <motion.header
      // Fade in animation on mount
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={[
        "sticky top-0 z-40",
        "border-b border-border/50",
        "relative overflow-hidden",
      ].join(" ")}
    >
      {/* Background image */}
      <Image
        src="https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNE8WBBD8W6N5387CYTRPRRM.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      {/* 35% black overlay for contrast */}
      <div className="absolute inset-0 bg-black/35 z-[1]" />
      <div className="container mx-auto px-4 py-4 relative z-[2]">
        <div className="flex items-center justify-between">
          {/* ========================================
              HOTEL BRANDING
              Logo + Name on the left side
              ======================================== */}
          <div className="flex items-center gap-3">
            {/* Banyan Tree logo SVG — 40px height */}
            <svg width="29" height="40" viewBox="0 0 35 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M32.99 15.095C33.904 13.752 34.158 12.646 33.925 11.04C32.104 10.791 30.615 11.514 29.687 13.099C28.835 14.555 29.687 17.4 29.711 17.424C29.716 17.434 32.109 16.393 32.99 15.097V15.095ZM32.201 3.899C31.876 3.798 30.808 3.5 30 3.793C29.065 4.132 28.265 5.639 28.236 5.636C28.268 5.607 29.745 6.047 30.588 5.689C31.453 5.322 32.099 4.224 32.201 3.899ZM28.232 2.392C28.232 2.392 25.555 2.24 24.328 3.239C23.1 4.238 22.363 7.32 22.363 7.32C22.363 7.32 25.393 6.819 26.551 6.086C27.708 5.353 28.229 2.395 28.229 2.395L28.232 2.392ZM19.791 9.632C20.709 4.487 23.005 0.515 23.005 0.515L20.177 0.131C20.177 0.131 18.932 2.576 17.73 5.91C17.333 5.252 16.486 4.453 15.718 3.495C14.766 2.305 14.664 1.785 13.352 0.387L9.499 0.21C9.499 0.21 13.03 4.625 14.902 7.702C15.42 8.556 15.805 9.008 16.185 9.92C15.916 11.372 15.696 12.765 15.524 13.648C14.848 17.129 14.347 19.654 13.967 22.337C12.499 21.752 11.017 21.442 9.116 20.936C5.837 20.063 3.965 19.637 0.627 19.006L0.499 21.703C1.146 21.826 3.071 21.831 5.132 22.47C6.333 22.843 6.992 23.145 8.089 23.759C6.607 28.781 5.921 32.347 5.132 36.853C4.439 40.813 4.139 45.414 4.139 45.414L7.835 46.994C7.835 46.994 8.135 40.791 8.602 36.853C8.956 33.883 8.903 32.139 9.755 29.272C10.29 27.475 10.731 26.609 11.521 24.802C11.521 24.802 13.095 25.554 13.749 25.936C13.548 29.804 13.155 33.738 12.969 39.042C12.858 42.243 13.097 47.461 13.097 47.461C13.097 47.461 15.187 47.947 16.687 47.998C17.752 48.034 20.433 47.775 20.433 47.775C20.433 47.775 18.813 39.393 18.629 31.459C19.181 31.193 19.929 30.75 20.818 30.436C21.555 30.177 21.983 30.235 22.751 29.923C22.717 30.91 22.92 35.67 22.945 38.489C22.974 41.633 24.16 47.688 24.16 47.688L28.793 46.101C28.793 46.101 28.665 43.755 28.665 42.252C28.665 39.289 28.67 37.591 29.178 34.671C29.658 31.907 30.729 28.728 31.099 27.741C32.375 27.535 33.417 27.228 33.417 27.228L33.477 24.628C30.452 24.826 28.815 25.005 25.902 25.622C22.889 26.261 20.985 26.49 18.503 27.485C18.278 23.181 18.798 15.22 19.794 9.632H19.791ZM25.449 33.135C25.461 31.691 25.538 29.662 25.611 28.89C26.316 28.689 27.101 28.503 27.895 28.334C27.692 29.115 27.142 31.442 26.858 32.879C26.282 35.796 26.473 38.135 25.962 40.961C25.521 38.271 25.427 35.859 25.449 33.133V33.135ZM17.474 3.851C17.474 3.851 18.624 2.598 18.498 1.664C18.392 0.883 17.345 0 17.345 0C17.345 0 16.222 0.96 16.183 1.792C16.137 2.738 17.474 3.851 17.474 3.851ZM10.097 3.411C8.845 5.46 8.692 7.325 9.6 9.548C10.453 11.64 13.86 13.476 13.86 13.476C13.86 13.476 14.345 9.826 13.533 7.734C12.754 5.728 11.877 4.625 10.097 3.411ZM8.789 11.56C8.789 11.56 8.406 8.447 7.181 6.807C5.955 5.167 4.836 4.567 2.923 4.149C2.412 6.055 2.458 7.33 3.839 9.122C5.604 11.415 8.789 11.563 8.789 11.563V11.56ZM8.002 6.224C8.002 6.224 8.74 4.603 8.474 3.595C8.174 2.463 7.527 1.776 6.413 1.408C5.766 2.373 5.667 3.29 6.091 4.371C6.471 5.336 8.002 6.222 8.002 6.222V6.224ZM3.962 10.123C3.1 9.178 2.34 8.769 1.078 8.566C0.869 10.002 1.158 11.028 2.08 12.148C2.967 13.222 5.243 13.808 5.243 13.808C5.243 13.808 4.987 11.248 3.962 10.123ZM7.052 12.584C6.457 14.669 6.224 15.968 7.961 18.07C9.697 20.172 13.071 20.866 13.071 20.866C13.071 20.866 13.378 16.11 11.7 14.313C10.022 12.516 8.98 12.458 7.05 12.584H7.052ZM6.883 18.679C6.883 18.679 5.897 15.765 4.398 14.729C3.061 13.803 1.971 13.527 0.354 13.708C0.361 15.274 0.804 16.314 1.93 17.402C3.364 18.788 6.883 18.679 6.883 18.679ZM0 26.882C0 26.882 1.724 28.593 3.902 27.983C7.052 27.1 7.241 24.601 7.241 24.601C7.241 24.601 5.42 23.314 3.456 23.634C1.492 23.953 0 26.882 0 26.882ZM29.418 19.545C28.222 20.83 27.81 23.805 27.813 23.745C27.873 23.745 30.9 23.546 32.261 22.339C33.69 21.077 34.26 19.756 34.194 17.85C32.232 17.617 31.365 17.455 29.421 19.543L29.418 19.545ZM21.722 18.919C20.043 20.854 19.91 23.885 20.157 25.293C20.692 25.341 24.972 23.987 26.858 21.701C28.663 19.514 28.532 18.67 28.534 16.56C25.773 16.031 23.562 16.795 21.722 18.919ZM22.661 9.932C20.942 12.025 21.07 16.689 21.07 16.689C21.07 16.689 25.677 15.593 27.367 13.401C28.931 11.374 29.401 9.594 29.045 7.059C26.316 6.959 24.393 7.825 22.661 9.932Z" fill="#EAE7E4" />
            </svg>
            <div>
              {/* Hotel name — same weight/size as day headers (text-lg font-semibold) */}
              <h1 className="font-reforma-gris text-lg font-semibold text-[#EAE7E4] normal-case tracking-[0.02em]">
                {hotel.name}
              </h1>
              {/* Subtitle */}
              <p className="text-sm text-[#EAE7E4]">Experience Calendar</p>
            </div>
          </div>

          {/* ========================================
              REQUEST SESSION BUTTON
              Only visible on desktop (hidden on mobile)
              Mobile uses FAB instead
              ======================================== */}
          <Button
            onClick={onRequestSession}
            variant="ghost"
            className="hidden md:inline-flex gap-2 text-[#EAE7E4] hover:text-[#EAE7E4] hover:bg-white/10"
            size="default"
          >
            <FileText className="h-4 w-4 text-[#EAE7E4]" />
            Request Private Session
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
