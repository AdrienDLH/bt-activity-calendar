/**
 * SKELETON COMPONENT
 *
 * Loading placeholder with shimmer animation.
 * Used to indicate content is being loaded.
 *
 * USAGE EXAMPLE:
 * // Activity card skeleton
 * <div className="space-y-4">
 *   <Skeleton className="h-48 w-full" />
 *   <Skeleton className="h-6 w-3/4" />
 *   <Skeleton className="h-4 w-1/2" />
 * </div>
 *
 * CUSTOMIZATION:
 * - Adjust size using className (h-4, w-full, etc.)
 * - Default uses rounded-none, override with className
 * - Animation is defined in globals.css
 */

import { cn } from "@/lib/utils";

/**
 * Skeleton Component
 *
 * Renders a placeholder with subtle shimmer animation.
 * Respects reduced-motion preferences.
 *
 * @example
 * // Text line placeholder
 * <Skeleton className="h-4 w-[200px]" />
 *
 * @example
 * // Image placeholder
 * <Skeleton className="h-48 w-full rounded-none" />
 *
 * @example
 * // Circle (avatar placeholder)
 * <Skeleton className="h-12 w-12 rounded-none" />
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Base styling
        "rounded-none bg-muted",
        // Shimmer animation (respects prefers-reduced-motion)
        "animate-pulse",
        className
      )}
      // Accessible: indicate loading state to screen readers
      role="status"
      aria-label="Loading..."
      {...props}
    />
  );
}

export { Skeleton };
