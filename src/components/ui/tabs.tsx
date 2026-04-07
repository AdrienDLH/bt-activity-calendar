/**
 * TABS COMPONENT
 *
 * A tabbed interface built on Radix UI Tabs primitive.
 * Used for "This Week" / "Upcoming" calendar segmentation.
 *
 * USAGE EXAMPLE:
 * <Tabs defaultValue="this-week">
 *   <TabsList>
 *     <TabsTrigger value="this-week">This Week</TabsTrigger>
 *     <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="this-week">
 *     <WeekView activities={activities} />
 *   </TabsContent>
 *   <TabsContent value="upcoming">
 *     <MonthGrid activities={activities} />
 *   </TabsContent>
 * </Tabs>
 *
 * CUSTOMIZATION:
 * - Modify TabsList for the tab bar container
 * - Modify TabsTrigger for individual tab buttons
 * - Modify TabsContent for the content panels
 */

"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

// Re-export root primitive
const Tabs = TabsPrimitive.Root;

/**
 * Tabs List
 *
 * Container for tab triggers.
 * Features a subtle background with rounded pill shape.
 */
const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-grid grid-cols-3 bg-transparent p-0 border border-[#85754E] rounded-[2px] overflow-hidden",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * Tabs Trigger
 *
 * Individual tab button.
 * Features smooth transition and gold accent when active.
 */
const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap",
      "px-4 min-h-[36px] pt-[10px] pb-[10px]",
      // Niramit Semi-Bold
      "font-sans text-[11px] font-semibold uppercase tracking-[0.1em] leading-none",
      // Right divider only — no individual borders (container handles outer border)
      "border-r border-[#85754E] last:border-r-0",
      "transition-all duration-200",
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      // Inactive
      "bg-transparent text-[#85754E]",
      // Hover
      "hover:bg-[#85754E]/10",
      // Active: bronze fill, light text
      "data-[state=active]:bg-[#85754E] data-[state=active]:text-[#EAE7E4] data-[state=active]:border-r-[#85754E]",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * Tabs Content
 *
 * Container for the content of each tab.
 * Includes subtle fade animation on tab switch.
 */
const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      // Spacing
      "mt-4",
      // Focus state
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      // Animation
      "data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0",
      "data-[state=active]:animate-in data-[state=active]:fade-in-0",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
