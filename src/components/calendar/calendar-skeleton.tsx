/**
 * CALENDAR SKELETON COMPONENT
 *
 * Loading skeleton for the calendar page.
 * Shows placeholder content while data is being fetched.
 *
 * CUSTOMIZATION:
 * - Skeleton sizes match actual component dimensions
 * - Uses the shimmer animation from globals.css
 */

import { Skeleton } from "@/components/ui/skeleton";

/**
 * CalendarSkeleton
 *
 * Renders a loading state that mimics the calendar layout.
 */
export function CalendarSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="sticky top-0 z-40 bg-background border-b border-border/50 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-none" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-10 w-40 hidden md:block rounded-none" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="px-6 py-8 md:py-12 bg-gradient-to-br from-muted/50 to-transparent rounded-none">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <Skeleton className="h-6 w-36 mx-auto rounded-none" />
          <Skeleton className="h-10 w-80 mx-auto" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs skeleton */}
        <Skeleton className="h-12 w-64 mx-auto mb-6 rounded-none" />

        {/* Filter skeleton */}
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-10 w-16 rounded-none" />
          <Skeleton className="h-10 w-20 rounded-none" />
          <Skeleton className="h-10 w-20 rounded-none" />
          <Skeleton className="h-10 w-20 rounded-none" />
          <Skeleton className="h-10 w-20 rounded-none" />
        </div>

        {/* Activity cards skeleton */}
        <div className="space-y-8">
          {[1, 2, 3].map((day) => (
            <div key={day}>
              {/* Day header */}
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-14 w-14 rounded-none" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((card) => (
                  <div
                    key={card}
                    className="rounded-none border border-border/50 overflow-hidden"
                  >
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
