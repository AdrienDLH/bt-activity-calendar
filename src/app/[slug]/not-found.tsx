/**
 * NOT FOUND PAGE - [slug]/not-found.tsx
 *
 * Displayed when a hotel slug doesn't exist in the database.
 * Provides a friendly message and link back to home.
 */

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto bg-muted rounded-none flex items-center justify-center">
          <MapPin className="h-10 w-10 text-[#153E35]" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[#153E35]">
            Property Not Found
          </h1>
          <p className="text-[#153E35]">
            We could not find a Banyan Tree property with that name. Please check
            the URL and try again.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/demo">View Demo Calendar</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
