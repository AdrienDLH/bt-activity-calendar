/**
 * ADMIN NOT-FOUND PAGE
 *
 * Shown when notFound() is called within the admin dashboard layout.
 * Renders within the sidebar layout so navigation is still accessible.
 */

import Link from "next/link";
import { ChevronLeft, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-16 h-16 bg-luxury-gold/10 flex items-center justify-center">
        <FileSearch className="h-8 w-8 text-luxury-gold" />
      </div>

      <div className="space-y-2">
        <h1 className="font-reforma-negra text-2xl uppercase tracking-[0.15em] text-[#153E35]">
          Not Found
        </h1>
        <p className="text-sm text-[#153E35] max-w-xs">
          The page or resource you requested could not be found.
        </p>
      </div>

      <Button asChild variant="ghost" className="rounded-none text-[#153E35] hover:text-[#153E35]">
        <Link href="/admin">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
