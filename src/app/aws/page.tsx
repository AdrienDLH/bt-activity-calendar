/**
 * EVENT LANDING — /aws
 *
 * The microsite home: date + location, then the four primary destinations as
 * cards. Each card is filled with a Banyan Tree watercolor "wash" image
 * (compressed to <200KB, served/optimised by next/image), with a dark overlay
 * so the white icon + title stay legible. Square corners + 4px hover lift keep
 * them consistent with the Interactive Calendar ActivityCard.
 *
 * `fitViewport` keeps everything — including the footer lockup — on a single
 * screen height on any device.
 *
 * - Time & Place, Agenda, Seat Inquiry → internal routes
 * - Photo Live-Stream → external album (Chinese host), opens in a new tab
 */
import Link from "next/link";
import Image from "next/image";
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
  /** Background wash image (in /public/aws). */
  bg: string;
  /** Optional extra zoom on the fill image (Tailwind scale class). */
  imgClass?: string;
  external?: boolean;
}

const TILES: Tile[] = [
  // Time & Place wash is zoomed in tighter.
  { label: "Time & Place", Icon: IconCalendarPin, href: "/aws/time-place", bg: "/aws/tile-time-place.jpg", imgClass: "translate-y-[40px] scale-150 group-hover:scale-[1.55]" },
  { label: "Agenda", Icon: IconClipboardList, href: "/aws/agenda", bg: "/aws/tile-agenda.jpg" },
  { label: "Seat Inquiry", Icon: IconSofa, href: "/aws/seat-inquiry", bg: "/aws/tile-seat-inquiry.jpg" },
  { label: "Photo Live-Stream", Icon: IconCamera, href: EVENT.liveStreamUrl, bg: "/aws/tile-photo-livestream.jpg", external: true },
];

// Square corners + 4px hover lift (mirrors ActivityCard); overflow-hidden clips
// the fill image to the radius; relative/isolate stack the image, overlay, then
// content.
const CARD_CLASS =
  "group relative isolate flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-[2px] p-4 no-underline hover:no-underline cursor-pointer transition-transform duration-200 hover:-translate-y-1 active:scale-[0.98]";

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
        {TILES.map(({ label, Icon, href, bg, imgClass, external }) => {
          const inner = (
            <>
              {/* Watercolor fill (no overlay — the washes carry enough contrast) */}
              <Image
                src={bg}
                alt=""
                fill
                priority
                sizes="(max-width: 640px) 45vw, 200px"
                className={`-z-10 object-cover transition-transform duration-500 ${imgClass ?? "group-hover:scale-105"}`}
              />

              <Icon className="h-9 w-9 text-white sm:h-10 sm:w-10" stroke={1.5} aria-hidden />
              {/* Title mirrors the ActivityCard <h3> ("Sunrise Beach Yoga"):
                  Reforma Gris, semibold, text-lg, leading-tight — in white. */}
              <h3 className="text-center font-reforma-gris text-lg font-semibold leading-tight tracking-[0.02em] text-white">
                {label}
              </h3>
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
