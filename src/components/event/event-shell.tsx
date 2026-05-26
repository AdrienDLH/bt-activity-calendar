/**
 * EVENT SHELL
 *
 * Shared page scaffold for the Elevating Banyan Tree AWS 2026 microsite.
 * Provides the warm cream canvas, a centred Banyan Tree logomark, an optional
 * "back" affordance, the page content, and the dark-green lockup footer.
 *
 * Mobile-first: content is a single comfortable column; on larger screens it
 * stays centred with generous whitespace (Apple HIG). Square corners throughout.
 *
 * `fitViewport`: locks the layout to one screen height (100dvh) and vertically
 * centres the content, so the footer lockup is ALWAYS in view regardless of the
 * device's height. Used by the landing page. Long pages (agenda) leave it off
 * and scroll naturally.
 */
import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BtLogomark } from "./bt-logomark";
import { LockupFooter } from "./lockup-footer";

interface EventShellProps {
  children: React.ReactNode;
  /** When set, shows a back chevron linking here (e.g. "/aws"). */
  backHref?: string;
  backLabel?: string;
  /** Constrains the main content width. Agenda uses a slightly wider measure. */
  contentClassName?: string;
  /** Lock to one screen height and centre content (landing page). */
  fitViewport?: boolean;
}

export function EventShell({
  children,
  backHref,
  backLabel = "Back",
  contentClassName = "max-w-xl",
  fitViewport = false,
}: EventShellProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-luxury-cream",
        fitViewport ? "h-[100dvh] overflow-hidden" : "min-h-screen",
      )}
    >
      {/* ---- Header: back link (left) + centred logomark ---- */}
      <header className="relative shrink-0 px-4 pt-8 sm:pt-10">
        {backHref && (
          <Link
            href={backHref}
            className="absolute left-3 top-7 inline-flex min-h-touch min-w-touch items-center gap-1 text-sm text-[#153E35] no-underline transition-opacity hover:opacity-70 sm:left-5 sm:top-9"
          >
            <IconChevronLeft className="h-5 w-5" stroke={1.75} aria-hidden />
            <span className="font-sans">{backLabel}</span>
          </Link>
        )}
        <Link href="/aws" className="mx-auto block w-fit" aria-label="Event home">
          <BtLogomark className="h-11 w-auto text-[#153E35] sm:h-12" title="Banyan Tree" />
        </Link>
      </header>

      {/* ---- Page content ---- */}
      <main
        className={cn(
          "flex flex-1 flex-col px-5",
          fitViewport ? "min-h-0 justify-center py-6" : "pt-8 sm:pt-12",
        )}
      >
        <div className={`mx-auto w-full ${contentClassName}`}>{children}</div>
      </main>

      {/* ---- Dark-green lockup footer ---- */}
      <LockupFooter className={cn(!fitViewport && "mt-12")} />
    </div>
  );
}
