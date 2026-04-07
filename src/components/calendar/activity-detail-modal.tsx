/**
 * ACTIVITY DETAIL SIDE PANEL
 *
 * Slides in from the right edge of the screen (replaces the old center modal).
 * Full-width on mobile, 480px fixed panel on md+.
 *
 * KEY DESIGN NOTES:
 * - Square image (aspect-square) at the top
 * - Close / Share buttons float over the image with the same
 *   glass blur + outline style as the time-of-day chip on cards
 * - Time-of-day badge uses the same single-word labels as the filter bar
 * - Key details rendered in 2 columns, no grey icon containers
 * - Tags shown prominently below the details grid
 * - CTA button has 2px radius matching the rest of the design system
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  Clock,
  MapPin,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Share2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Activity, ActivityType, TimeOfDay } from "@/types/database";

/**
 * TIME_OF_DAY_CONFIG
 *
 * Single-word labels matching the filter bar exactly.
 * "Revel" (DB) → "Glow" (frontend) per design spec.
 */
const TIME_OF_DAY_CONFIG: Record<TimeOfDay, { label: string }> = {
  Rise:  { label: "Rise" },
  Shine: { label: "Shine" },
  Rest:  { label: "Rest" },
  Revel: { label: "Glow" },
};

interface ActivityDetailModalProps {
  activity: Activity;
  activityType?: ActivityType;
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityDetailModal({
  activity,
  activityType,
  isOpen,
  onClose,
}: ActivityDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = activity.image_urls || [];
  const hasMultipleImages = images.length > 1;

  const timeConfig = activity.time_of_day
    ? TIME_OF_DAY_CONFIG[activity.time_of_day]
    : null;

  const startTime = activity.start_time
    ? format(parseISO(`2000-01-01T${activity.start_time}`), "h:mm a")
    : null;
  const endTime = activity.end_time
    ? format(parseISO(`2000-01-01T${activity.end_time}`), "h:mm a")
    : null;

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activity.title,
          text: activity.description || `Check out ${activity.title}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share not supported
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ========================================
              BACKDROP — click outside to close
              ======================================== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60"
          />

          {/* ========================================
              SIDE PANEL — slides in from the right
              Full-width on mobile · 480px on md+
              ======================================== */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={cn(
              "fixed inset-y-0 right-0 z-50",
              "w-full md:w-[480px]",
              "bg-card flex flex-col overflow-hidden"
            )}
          >
            {/* ========================================
                FLOATING HEADER BUTTONS
                Glass blur + outline — matches time-of-day
                chip style used on cards
                ======================================== */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Close panel"
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-[2px]",
                  "bg-white/[0.01] backdrop-blur-md border border-white/10 text-white",
                  "hover:bg-white/20 transition-colors duration-150"
                )}
              >
                <X className="h-5 w-5" />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                aria-label="Share activity"
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-[2px]",
                  "bg-white/[0.01] backdrop-blur-md border border-white/10 text-white",
                  "hover:bg-white/20 transition-colors duration-150"
                )}
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* ========================================
                SQUARE IMAGE
                aspect-square ensures 1:1 regardless of
                container width
                ======================================== */}
            <div className="relative aspect-square w-full shrink-0">
              {images.length > 0 ? (
                <>
                  <Image
                    src={images[currentImageIndex]}
                    alt={`${activity.title} – image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Gradient for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Carousel arrows (only when multiple images) */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-[2px] bg-black/30 hover:bg-black/50 text-white transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-[2px] bg-black/30 hover:bg-black/50 text-white transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>

                      {/* Dot indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={cn(
                              "w-2 h-2 rounded-none transition-colors",
                              index === currentImageIndex
                                ? "bg-white"
                                : "bg-white/50"
                            )}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Time-of-day chip — same blur/outline style as card label,
                      same short label as the filter bar */}
                  {timeConfig && (
                    <div
                      className={cn(
                        "absolute bottom-3 left-3",
                        "px-2 pt-[4px] pb-[5px] rounded-[2px]",
                        "bg-white/[0.01] backdrop-blur-md border border-white/10",
                        "text-white text-[11px] font-semibold leading-none uppercase tracking-[0.1em]"
                      )}
                    >
                      {timeConfig.label}
                    </div>
                  )}
                </>
              ) : (
                // Placeholder when no image
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/30 to-luxury-gold/10 flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-luxury-gold/50" />
                </div>
              )}
            </div>

            {/* ========================================
                SCROLLABLE CONTENT
                ======================================== */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-5">

                {/* Title + activity type */}
                <div>
                  <h2 className="text-2xl font-semibold text-[#153E35] leading-tight mb-1">
                    {activity.title}
                  </h2>
                  {activityType && (
                    <span className="text-sm text-[#85754E] font-medium">
                      {activityType.name}
                    </span>
                  )}
                </div>

                {/* ----------------------------------------
                    KEY DETAILS — 2-column grid
                    No grey bg containers; icon in brand gold
                    ---------------------------------------- */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {/* Date */}
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 shrink-0 mt-0.5 text-[#85754E]" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] leading-none text-[#85754E] mb-1">
                        Date
                      </p>
                      <p className="text-sm font-medium text-[#153E35] leading-tight">
                        {format(parseISO(activity.activity_date), "EEE, MMM d")}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  {startTime && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 shrink-0 mt-0.5 text-[#85754E]" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] leading-none text-[#85754E] mb-1">
                          Time
                        </p>
                        <p className="text-sm font-medium text-[#153E35] leading-tight">
                          {startTime}
                          {endTime && ` – ${endTime}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {activity.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-[#85754E]" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] leading-none text-[#85754E] mb-1">
                          Location
                        </p>
                        <p className="text-sm font-medium text-[#153E35] leading-tight">
                          {activity.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Practitioner */}
                  {activity.practitioner && (
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 shrink-0 mt-0.5 text-[#85754E]" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] leading-none text-[#85754E] mb-1">
                          With
                        </p>
                        <p className="text-sm font-medium text-[#153E35] leading-tight">
                          {activity.practitioner}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {activity.tags && activity.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {activity.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 pt-[4px] pb-[5px] rounded-[2px] bg-[#DDC9A3] text-[#85754E] text-[11px] font-semibold leading-none uppercase tracking-[0.1em]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                {activity.description && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] leading-none text-[#85754E] mb-2">
                      About
                    </p>
                    <p className="text-sm text-[#153E35] leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                )}

                {/* Equipment */}
                {activity.equipment && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] leading-none text-[#85754E] mb-2">
                      What to Bring
                    </p>
                    <p className="text-sm text-[#153E35]">{activity.equipment}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ========================================
                CTA FOOTER
                Sticky at the bottom of the panel
                ======================================== */}
            {activity.cta_link && (
              <div className="shrink-0 p-4 border-t border-border bg-card pb-safe">
                <Button
                  asChild
                  className="w-full h-12 text-base rounded-[2px]"
                  size="lg"
                >
                  <a
                    href={activity.cta_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book This Activity
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
