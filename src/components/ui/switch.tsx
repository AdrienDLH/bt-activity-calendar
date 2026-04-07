/**
 * SWITCH COMPONENT
 *
 * A toggle switch built on Radix UI Switch primitive.
 * Used for publish toggles, boolean settings, etc.
 *
 * USAGE EXAMPLE:
 * <div className="flex items-center gap-3">
 *   <Switch
 *     id="published"
 *     checked={isPublished}
 *     onCheckedChange={setIsPublished}
 *   />
 *   <Label htmlFor="published">Published</Label>
 * </div>
 *
 * CUSTOMIZATION:
 * - Modify track colors: bg-input (off) / bg-primary (on)
 * - Modify thumb size: h-5 w-5
 * - Animation uses spring timing for Apple-level smoothness
 */

"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

/**
 * Switch Component
 *
 * Renders a toggle switch with smooth animation.
 *
 * @example
 * // Basic toggle
 * <Switch checked={isOn} onCheckedChange={setIsOn} />
 *
 * @example
 * // With label
 * <div className="flex items-center gap-2">
 *   <Switch id="notify" />
 *   <Label htmlFor="notify">Enable notifications</Label>
 * </div>
 */
const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      // Base sizing (meets 44px touch target with padding)
      "peer inline-flex h-6 w-11 shrink-0",
      // Cursor
      "cursor-pointer",
      // Track styling
      "items-center rounded-none",
      // Border
      "border-2 border-transparent",
      // Track colors: muted when off, gold when on
      "bg-input data-[state=checked]:bg-primary",
      // Focus state
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      // Disabled state
      "disabled:cursor-not-allowed disabled:opacity-50",
      // Smooth transition
      "transition-colors duration-200",
      className
    )}
    {...props}
    ref={ref}
  >
    {/*
      Switch Thumb (the moving circle)
      Slides left/right based on checked state.
    */}
    <SwitchPrimitive.Thumb
      className={cn(
        // Base styling
        "pointer-events-none block h-5 w-5 rounded-none",
        // White background with subtle shadow
        "bg-background shadow-lg ring-0",
        // Position: left when off, right when on
        "data-[state=unchecked]:translate-x-0",
        "data-[state=checked]:translate-x-5",
        // Spring animation for Apple-level smoothness
        "transition-transform duration-200"
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
