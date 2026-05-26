/**
 * EVENT LANDING — /aws
 *
 * The microsite home: date + location, then the four primary destinations as
 * cards that match the Interactive Calendar design system (white `bg-card`,
 * hairline border, soft shadow, square corners, gold icon accent). Icons are
 * pulled from Tabler (tablericons.com) per brief.
 *
 * `fitViewport` keeps everything — including the footer lockup — on a single
 * screen height on any device.
 *
 * - Time & Place, Agenda, Seat Inquiry → internal routes
 * - Photo Live-Stream → external album (Chinese host), opens in a new tab
 */
import Link from "next/link";
import {
  IconCalendarPin,
  IconClipboardList,
  IconSofa,
  IconCamera,
  type Icon,
} from "@tabler/icons-react";
import { EventShell } from "@/components/event/event-shell";
import { EVENT } from "@/lib/event-data";

interface Tile {
  label: string;
  Icon: Icon;
  href: string;
  external?: boolean;
}

const TILES: Tile[] = [
  { label: "Time & Place", Icon: IconCalendarPin, href: "/aws/time-place" },
  { label: "Agenda", Icon: IconClipboardList, href: "/aws/agenda" },
  { label: "Seat Inquiry", Icon: IconSofa, href: "/aws/seat-inquiry" },
  { label: "Photo Live-Stream", Icon: IconCamera, href: EVENT.liveStreamUrl, external: true },
];

// Card styling mirrors the design system's `luxury-card`: white surface,
// hairline border, soft shadow that lifts on hover. Square corners only.
const CARD_CLASS =
  "group flex aspect-square flex-col items-center justify-center gap-3 rounded-none border border-border/50 bg-card p-4 no-underline shadow-sm transition-shadow duration-300 hover:shadow-md focus-visible:shadow-md";

export default function EventLandingPage() {
  return (
    <EventShell fitViewport contentClassName="max-w-[20rem] sm:max-w-sm">
      {/* Date + location (no labels — context is clear) */}
      <div className="text-center">
        <p className="font-reforma-negra text-base uppercase tracking-[0.15em] text-[#153E35]">
          {EVENT.dateText}
        </p>
        <p className="mt-1 font-reforma-negra text-base uppercase tracking-[0.15em] text-[#153E35]">
          {EVENT.locationText}
        </p>
      </div>

      {/* 2×2 tile grid */}
      <nav className="mt-8 grid grid-cols-2 gap-4">
        {TILES.map(({ label, Icon, href, external }) => {
          const inner = (
            <>
              <Icon className="h-9 w-9 text-luxury-gold sm:h-10 sm:w-10" stroke={1.5} aria-hidden />
              <span className="text-center font-reforma-gris text-base leading-tight tracking-[0.02em] text-[#153E35]">
                {label}
              </span>
            </>
          );

          return external ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={CARD_CLASS}
            >
              {inner}
            </a>
          ) : (
            <Link key={label} href={href} className={CARD_CLASS}>
              {inner}
            </Link>
          );
        })}
      </nav>
    </EventShell>
  );
}
