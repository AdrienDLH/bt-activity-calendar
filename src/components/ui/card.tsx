/**
 * CARD COMPONENT
 *
 * A flexible card container following the luxury design system.
 * Used for activity cards, information panels, and content grouping.
 *
 * USAGE EXAMPLE:
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Morning Yoga</CardTitle>
 *     <CardDescription>Start your day with serenity</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Join our expert instructors...</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Book Now</Button>
 *   </CardFooter>
 * </Card>
 *
 * CUSTOMIZATION:
 * - Card: Main container styling (shadow, border, radius)
 * - CardHeader: Top section padding
 * - CardTitle: Heading typography
 * - CardDescription: Subheading typography
 * - CardContent: Main content padding
 * - CardFooter: Bottom section styling
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card Container
 *
 * The main wrapper with luxury styling:
 * - White background for contrast against cream
 * - Soft shadow for subtle depth
 * - Rounded corners (20px for premium feel)
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Luxury card styling
      "rounded-none border border-border/50 bg-card text-card-foreground",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * Card Header
 *
 * Container for title and description.
 * Generous padding following Apple HIG.
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Generous padding (24px)
      "flex flex-col space-y-1.5 p-6",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * Card Title
 *
 * Main heading for the card.
 * Uses semibold weight for hierarchy.
 */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Typography
      "text-xl font-semibold leading-tight tracking-tight",
      // Text color (dark brown)
      "text-[#153E35]",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * Card Description
 *
 * Supporting text below the title.
 * Uses muted color for visual hierarchy.
 */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Typography
      "text-sm leading-relaxed",
      // Muted text color
      "text-[#153E35]",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * Card Content
 *
 * Main content area of the card.
 * Horizontal padding with no top padding (flows from header).
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Padding (no top, flows from header)
      "p-6 pt-0",
      className
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

/**
 * Card Footer
 *
 * Bottom section for actions or metadata.
 * Items align horizontally with space between.
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Layout
      "flex items-center",
      // Padding
      "p-6 pt-0",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
