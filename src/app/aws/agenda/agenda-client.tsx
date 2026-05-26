"use client";

/**
 * AGENDA CLIENT
 *
 * Interactive agenda: a role segmented-control and a day switcher drive a single
 * responsive timeline. Days 7 / 8 / 10 are common to every role; only Day 2
 * (June 9) changes per role — all handled by the AGENDA data map.
 *
 * Motion: gentle 300ms fade/slide between day changes (respects reduced motion
 * via the global CSS rule). Square corners throughout per brand.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { IconMapPin } from "@tabler/icons-react";
import { AGENDA, ROLES, type RoleId, type Session } from "@/lib/event-data";
import { cn } from "@/lib/utils";

export function AgendaClient() {
  const [role, setRole] = useState<RoleId>("gm");
  const [dayIndex, setDayIndex] = useState(0);

  const days = AGENDA[role];
  // Clamp in case a role had fewer days (defensive; all roles have 4 here).
  const day = days[Math.min(dayIndex, days.length - 1)];

  return (
    <div>
      <h1 className="text-center font-reforma-gris text-2xl tracking-[0.02em] text-[#153E35]">
        Meeting Agenda
      </h1>

      {/* ---- Role segmented control ---- */}
      <div
        role="tablist"
        aria-label="Select role"
        className="mx-auto mt-6 grid max-w-md grid-cols-3 border border-[#153E35]/20"
      >
        {ROLES.map((r, i) => {
          const active = r.id === role;
          return (
            <button
              key={r.id}
              role="tab"
              aria-selected={active}
              onClick={() => setRole(r.id)}
              title={r.full}
              className={cn(
                "min-h-touch px-2 py-2.5 text-sm font-medium tracking-wide transition-colors duration-200",
                i > 0 && "border-l border-[#153E35]/20",
                active
                  ? "bg-luxury-forest text-white"
                  : "bg-transparent text-[#153E35] hover:bg-[#153E35]/[0.05]",
              )}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {/* ---- Day switcher ---- */}
      <div
        role="tablist"
        aria-label="Select day"
        className="mt-4 grid grid-cols-4 gap-2 sm:gap-3"
      >
        {days.map((d, i) => {
          const active = i === dayIndex;
          return (
            <button
              key={d.id}
              role="tab"
              aria-selected={active}
              onClick={() => setDayIndex(i)}
              className={cn(
                "flex min-h-touch flex-col items-center justify-center border px-1 py-2 transition-colors duration-200",
                active
                  ? "border-luxury-gold bg-luxury-gold/10 text-[#153E35]"
                  : "border-[#153E35]/15 bg-white/40 text-[#153E35]/70 hover:bg-white/70",
              )}
            >
              <span className="font-reforma-gris text-sm leading-none tracking-[0.02em] sm:text-base">
                {d.tab}
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-wider opacity-70 sm:text-xs">
                {d.weekday}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---- Day timeline ----
          Keyed motion.section: changing role/day remounts it so the fade/slide
          replays cleanly. (No AnimatePresence "wait" mode — rapid switches there
          can strand the exiting child and blank the panel.) */}
        <motion.section
          key={`${role}-${day.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-8"
        >
          {/* Day heading */}
          <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="inline-flex items-center bg-luxury-forest px-2.5 py-1 font-reforma-negra text-[11px] uppercase tracking-[0.12em] text-white">
              {day.dayLabel}
            </span>
            <h2 className="font-reforma-gris text-lg tracking-[0.02em] text-[#153E35] sm:text-xl">
              {day.date}
            </h2>
            {day.theme && (
              <p className="w-full text-sm italic text-luxury-gold sm:text-base">{day.theme}</p>
            )}
          </div>

          <ol className="space-y-0">
            {day.sessions.map((s, i) => (
              <TimelineRow key={i} session={s} last={i === day.sessions.length - 1} />
            ))}
          </ol>
        </motion.section>
    </div>
  );
}

/* ---- A single timeline entry ---- */
function TimelineRow({ session, last }: { session: Session; last: boolean }) {
  return (
    <li className="grid grid-cols-[4.5rem_1.25rem_1fr] sm:grid-cols-[5.5rem_1.5rem_1fr]">
      {/* Time */}
      <div className="pt-0.5 text-right">
        <span className="font-sans text-xs leading-tight text-[#153E35]/70 sm:text-sm">
          {session.time}
        </span>
      </div>

      {/* Connector: dot + vertical line */}
      <div className="relative flex justify-center" aria-hidden>
        {!last && (
          <span className="absolute left-1/2 top-2 h-full w-px -translate-x-1/2 bg-[#153E35]/15" />
        )}
        <span className="relative z-10 mt-1 h-2 w-2 rounded-full bg-luxury-gold ring-4 ring-luxury-cream" />
      </div>

      {/* Content */}
      <div className={cn("pl-1", last ? "pb-1" : "pb-7")}>
        <h3 className="font-reforma-gris text-base font-semibold leading-snug tracking-[0.02em] text-[#153E35] sm:text-lg">
          {session.title}
        </h3>
        {session.details?.map((d, i) => (
          <p key={i} className="mt-1 text-sm leading-relaxed text-[#153E35]/75">
            {d}
          </p>
        ))}
        {session.dressCode && (
          <p className="mt-1 text-sm text-[#153E35]/75">
            <span className="font-semibold text-[#153E35]">Dress code:</span> {session.dressCode}
          </p>
        )}
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#153E35]">
          <IconMapPin className="h-4 w-4 text-luxury-gold" stroke={1.75} aria-hidden />
          {session.venue}
        </p>
      </div>
    </li>
  );
}
