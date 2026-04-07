/**
 * LABEL COMPONENT
 *
 * A form label built on Radix UI Label primitive.
 * Provides proper accessibility linking to form inputs.
 *
 * USAGE EXAMPLE:
 * <div className="space-y-2">
 *   <Label htmlFor="email">Email Address</Label>
 *   <Input id="email" type="email" />
 * </div>
 *
 * CUSTOMIZATION:
 * - To change label color, modify the 'text' class
 * - To change label size, modify the 'text-sm' class
 */

"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Label Variants
 *
 * Defines the visual styles for labels.
 * Currently single variant but extensible for error states, etc.
 */
const labelVariants = cva(
  // Base label styling
  [
    "text-sm font-medium leading-none",
    "text-[#153E35]",
    // When associated input is disabled, dim the label
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  ]
);

/**
 * Label Component
 *
 * Renders an accessible form label.
 * Always use with htmlFor prop matching the input's id.
 *
 * @example
 * <Label htmlFor="name">Your Name</Label>
 * <Input id="name" />
 */
const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
