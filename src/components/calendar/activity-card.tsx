/**
 * ACTIVITY CARD COMPONENT
 *
 * Individual activity card for display in calendar views.
 * Features:
 * - Hero image with gradient overlay
 * - Activity details (title, time, location)
 * - Time-of-day badge
 * - Tap/click to open detail modal
 *
 * CUSTOMIZATION:
 * - Image aspect ratio via aspect-[4/3]
 * - Card shadows and hover effects
 * - Badge colors match TIME_OF_DAY_CONFIG
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, MapPin, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Activity, ActivityType, TimeOfDay } from "@/types/database";

// ─── Tag overflow pill ────────────────────────────────────────────────────────
// Renders as many tags as fit in the container width, then shows "+X" for the
// rest. Uses a hidden measurement layer + ResizeObserver so it reacts correctly
// to any card width (mobile, tablet, desktop, grid changes).

const TAG_GAP = 6; // matches gap-1.5

// SSR-safe version of useLayoutEffect (no-op on server)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const TAG_CLS =
  "shrink-0 px-2 pt-[4px] pb-[5px] rounded-[2px] text-[11px] bg-[#DDC9A3] text-[#85754E] uppercase tracking-[0.1em] font-semibold leading-none";
const PILL_CLS =
  "shrink-0 px-2 pt-[4px] pb-[5px] rounded-[2px] text-[11px] border border-[#DDC9A3] text-[#85754E] uppercase tracking-[0.1em] font-semibold leading-none";

function TagList({ tags }: { tags: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tags.length);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const calculate = () => {
      const containerWidth = container.offsetWidth;
      // measureRef children: tags[0..n-1] then the "+99" pill
      const children = Array.from(measure.children) as HTMLElement[];
      const pillEl = children[tags.length]; // last child = "+99" pill
      const pillWidth = pillEl?.offsetWidth ?? 44;
      const tagWidths = children.slice(0, tags.length).map((el) => el.offsetWidth);

      let used = 0;
      let count = 0;

      for (let i = 0; i < tags.length; i++) {
        const gap = i > 0 ? TAG_GAP : 0;
        const hidden = tags.length - (i + 1);
        // If there would still be hidden tags after showing this one,
        // reserve space for the "+X" pill.
        const pillSpace = hidden > 0 ? TAG_GAP + pillWidth : 0;
        const needed = used + gap + tagWidths[i] + pillSpace;

        if (needed <= containerWidth) {
          used += gap + tagWidths[i];
          count = i + 1;
        } else {
          break;
        }
      }

      setVisibleCount(Math.max(0, count));
    };

    const ro = new ResizeObserver(calculate);
    ro.observe(container);
    calculate();
    return () => ro.disconnect();
  }, [tags]);

  const hiddenCount = tags.length - visibleCount;

  return (
    <div className="relative pt-2">
      {/* Hidden layer — renders all tags + "+99" pill to measure widths */}
      <div
        ref={measureRef}
        aria-hidden
        className="absolute inset-0 flex gap-1.5 opacity-0 pointer-events-none overflow-hidden"
      >
        {tags.map((tag) => (
          <span key={tag} className={TAG_CLS}>{tag}</span>
        ))}
        {/* "+99" as worst-case width for the overflow pill */}
        <span className={PILL_CLS}>+99</span>
      </div>

      {/* Visible row */}
      <div ref={containerRef} className="flex flex-nowrap gap-1.5 overflow-hidden">
        {tags.slice(0, visibleCount).map((tag) => (
          <span key={tag} className={TAG_CLS}>{tag}</span>
        ))}
        {hiddenCount > 0 && (
          <span className={PILL_CLS}>+{hiddenCount}</span>
        )}
      </div>
    </div>
  );
}

/**
 * TIME_OF_DAY_STYLES
 *
 * All time-of-day badges share the same forest green chip style.
 * Icons removed per design spec — text label only.
 */
const TIME_OF_DAY_STYLES: Record<TimeOfDay, { label: string }> = {
  Rise:  { label: "Rise" },
  Shine: { label: "Shine" },
  Rest:  { label: "Rest" },
  Revel: { label: "Glow" }, // DB value "Revel" displayed as "Glow" per design spec
};

interface ActivityCardProps {
  /** The activity to display */
  activity: Activity;
  /** The activity type (for displaying category) */
  activityType?: ActivityType;
  /** Callback when card is clicked */
  onClick?: () => void;
  /** Animation delay for staggered entrance */
  index?: number;
}

/**
 * ActivityCard
 *
 * Renders a visually appealing activity card with image and details.
 * Designed for both Week View (larger) and Month View (compact).
 */
export function ActivityCard({
  activity,
  activityType,
  onClick,
  index = 0,
}: ActivityCardProps) {
  // Get time-of-day config if available
  const timeStyle = activity.time_of_day
    ? TIME_OF_DAY_STYLES[activity.time_of_day]
    : null;

  // Format the time display
  const timeDisplay = activity.start_time
    ? format(parseISO(`2000-01-01T${activity.start_time}`), "h:mm a")
    : null;

  // Get the first image or use placeholder
  const imageUrl = activity.image_urls?.[0] || null;

  return (
    <motion.article
      // Staggered fade-in animation
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      // Hover and tap effects
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        // Base card styling
        "group cursor-pointer",
        "bg-card rounded-[2px] overflow-hidden",
        "transition-shadow duration-300"
      )}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${activity.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* ========================================
          IMAGE SECTION
          Hero image with gradient overlay
          ======================================== */}
      <div className="relative aspect-square overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={activity.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          // Placeholder gradient when no image
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/30 to-luxury-gold/10" />
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* ========================================
            TIME-OF-DAY BADGE
            Positioned in top-right corner
            ======================================== */}
        {/* Time-of-day chip: forest green bg (#173F35), white text, no icon */}
        {timeStyle && (
          <div
            className="absolute top-3 right-3 px-2.5 pt-[4px] pb-[5px] rounded-[2px]
                        bg-white/[0.01] backdrop-blur-md border border-white/10
                        text-white text-[11px] font-semibold leading-none uppercase tracking-[0.1em]"
          >
            {timeStyle.label}
          </div>
        )}

        {/* ========================================
            TITLE OVERLAY
            Positioned at bottom of image
            ======================================== */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2">
            {activity.title}
          </h3>
          {activityType && (
            <span className="text-white/80 text-sm mt-1 block">
              {activityType.name}
            </span>
          )}
        </div>
      </div>

      {/* ========================================
          DETAILS SECTION
          Time, location, practitioner info
          ======================================== */}
      <div className="p-4 space-y-2">
        {/* Time */}
        {timeDisplay && (
          <div className="flex items-center gap-2 text-sm text-[#153E35]">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{timeDisplay}</span>
            {activity.end_time && (
              <span>
                - {format(parseISO(`2000-01-01T${activity.end_time}`), "h:mm a")}
              </span>
            )}
          </div>
        )}

        {/* Location */}
        {activity.location && (
          <div className="flex items-center gap-2 text-sm text-[#153E35]">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{activity.location}</span>
          </div>
        )}

        {/* Practitioner */}
        {activity.practitioner && (
          <div className="flex items-center gap-2 text-sm text-[#153E35]">
            <User className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">with {activity.practitioner}</span>
          </div>
        )}

        {/* Tags — dynamically fits as many as the card width allows */}
        {activity.tags && activity.tags.length > 0 && (
          <TagList tags={activity.tags} />
        )}
      </div>
    </motion.article>
  );
}
