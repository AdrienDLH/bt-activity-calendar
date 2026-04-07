/**
 * UTILITY FUNCTIONS
 *
 * Core utility functions used throughout the application.
 * These are primarily used by Shadcn/UI components.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn - Class Name Merger
 *
 * Combines Tailwind CSS classes intelligently, handling conflicts.
 * This is the primary utility for combining conditional classes.
 *
 * @example
 * // Basic usage
 * cn("px-4 py-2", "bg-primary") // "px-4 py-2 bg-primary"
 *
 * @example
 * // With conditionals
 * cn("btn", isActive && "btn-active", className)
 *
 * @example
 * // Resolves conflicts (last wins)
 * cn("p-4", "p-2") // "p-2"
 *
 * @param inputs - Any number of class values (strings, objects, arrays)
 * @returns Merged and deduplicated class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
