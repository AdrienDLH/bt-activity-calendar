/**
 * TEXTAREA COMPONENT
 *
 * A multi-line text input following the luxury design system.
 * Used for activity descriptions, notes, and longer form content.
 *
 * USAGE EXAMPLE:
 * <Textarea
 *   placeholder="Describe your requirements..."
 *   value={notes}
 *   onChange={(e) => setNotes(e.target.value)}
 *   rows={4}
 * />
 *
 * CUSTOMIZATION:
 * - To change border color, modify the 'border' class
 * - To change focus ring, modify the 'focus-visible:ring' class
 * - Default min-height is 80px (adjustable via rows prop)
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Textarea Props
 *
 * Extends standard HTML textarea attributes.
 */
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Textarea Component
 *
 * Renders a styled multi-line text input.
 *
 * @example
 * // Basic textarea
 * <Textarea placeholder="Your message..." />
 *
 * @example
 * // With specific row count
 * <Textarea rows={6} placeholder="Detailed description..." />
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base layout
          "flex w-full min-h-[80px]",
          // Soft rounded corners
          "rounded-none",
          // Border styling (matches Input)
          "border border-input bg-background",
          // Padding
          "px-4 py-3",
          // Typography
          "text-base text-[#153E35]",
          // Placeholder styling
          "placeholder:text-[#153E35]",
          // Focus state with gold ring
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Allow vertical resize only
          "resize-y",
          // Smooth transitions
          "transition-shadow duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
