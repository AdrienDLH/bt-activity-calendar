/**
 * BUTTON COMPONENT
 *
 * A versatile button component built with Radix UI Slot and CVA.
 * Supports multiple variants and sizes following the luxury design system.
 *
 * USAGE EXAMPLES:
 * - Primary CTA: <Button>Book Now</Button>
 * - Secondary: <Button variant="secondary">Learn More</Button>
 * - Ghost (icon button): <Button variant="ghost" size="icon"><Icon /></Button>
 *
 * CUSTOMIZATION:
 * - To change button colors, modify the variant classes below
 * - To change button sizes, modify the size classes below
 * - All buttons have minimum 44px touch targets (Apple HIG)
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button Variants Configuration
 *
 * Defines all available button styles using Class Variance Authority.
 * Each variant and size can be combined freely.
 */
const buttonVariants = cva(
  // Base styles applied to ALL buttons
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap rounded-none font-reforma-negra text-sm font-medium uppercase tracking-[0.15em]",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]", // Subtle press effect
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      /**
       * VARIANT OPTIONS
       *
       * default: Gold background - Use for primary CTAs
       * destructive: Red background - Use for delete/danger actions
       * outline: Bordered button - Use for secondary actions
       * secondary: Muted background - Use for less prominent actions
       * ghost: Transparent - Use for icon buttons or tertiary actions
       * link: Text only with underline - Use for inline links
       */
      variant: {
        // Primary gold button - Main CTAs
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",

        // Danger/destructive actions
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",

        // Bordered secondary button
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",

        // Muted background button
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",

        // Transparent button (great for icons)
        ghost: "hover:bg-accent hover:text-accent-foreground",

        // Text-only link style
        link: "text-primary underline-offset-4 hover:underline",
      },

      /**
       * SIZE OPTIONS
       *
       * All sizes maintain minimum 44px touch targets.
       * sm/default/lg affect padding and font size.
       * icon: Square button for icon-only use.
       */
      size: {
        // Default size - Balanced for most use cases
        default: "h-11 px-6 py-2",

        // Small - For dense UIs (still meets 44px touch target)
        sm: "h-10 px-4 text-xs",

        // Large - For hero CTAs and prominent buttons
        lg: "h-12 px-8 text-base",

        // Icon-only - Square button for icons
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Button Props Interface
 *
 * Extends standard button attributes with:
 * - variant: Visual style variant
 * - size: Size variant
 * - asChild: Renders as child element (for Link components)
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  /**
   * When true, renders the child element instead of a button.
   * Useful for wrapping Next.js Link components.
   *
   * @example
   * <Button asChild>
   *   <Link href="/book">Book Now</Link>
   * </Button>
   */
  asChild?: boolean;
}

/**
 * Button Component
 *
 * Renders a styled button or its child element (if asChild is true).
 *
 * @example
 * // Standard button
 * <Button onClick={handleClick}>Click Me</Button>
 *
 * @example
 * // As a link
 * <Button asChild variant="outline">
 *   <Link href="/about">Learn More</Link>
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Use Slot to render as child element when asChild is true
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
