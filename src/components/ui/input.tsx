/**
 * INPUT COMPONENT
 *
 * A styled text input field following the luxury design system.
 * Features square corners and gold focus ring.
 *
 * USAGE EXAMPLE:
 * <Input
 *   type="email"
 *   placeholder="Enter your email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 *
 * CUSTOMIZATION:
 * - To change input border color, modify the 'border' class
 * - To change focus ring color, modify the 'focus-visible:ring' class
 * - Height is 44px (11 * 4px) for Apple HIG touch target compliance
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input Props
 *
 * Extends standard HTML input attributes.
 * All standard input types are supported (text, email, password, etc.)
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Input Component
 *
 * Renders a styled input field with luxury aesthetics.
 *
 * @example
 * // Text input
 * <Input placeholder="Full name" />
 *
 * @example
 * // Email with error state (add ring-destructive via className)
 * <Input type="email" className="ring-2 ring-destructive" />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base layout and sizing (44px height for touch targets)
          "flex h-11 w-full",
          // Square corners matching luxury aesthetic
          "rounded-none",
          // Border styling
          "border border-input bg-background",
          // Padding for comfortable text entry
          "px-4 py-2",
          // Typography
          "text-base text-[#153E35]",
          // Placeholder styling
          "placeholder:text-[#153E35]",
          // Focus state with gold ring
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Remove default browser styles for file inputs
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#153E35]",
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
Input.displayName = "Input";

export { Input };
