"use client";

/**
 * AGENDA CLIENT
 *
 * Interactive agenda using the SAME components as the Interactive Calendar:
 * - Role (GM / DOSM / RM) and Day switchers use the shared Tabs / TabsList /
 *   TabsTrigger segmented control (identical to List / Weekly / Monthly).
 * - The day header mirrors the WeekView day header (h3 + tan "pill").
 * - The venue chip uses the same Reforma/Niramit treatments as the calendar.
 *
 * Days 7 / 8 / 10 are common to every role; only Day 2 (June 9) differs.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { IconMapPin } from "@tabler/icons-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AGENDA, ROLES, type RoleId, type Session } from "@/lib/event-data";
import { cn } from "@/lib/utils";

export function AgendaClient() {
  const [role, setRole] = useState<RoleId>("gm");
  const [dayId, setDayId] = useState("jun-7");

  const days = AGENDA[role];
  const day = days.find((d) => d.id === dayId) ?? days[0];

  return (
    <div>
      <h3 className="text-center font-reforma-gris text-xl font-semibold tracking-[0.02em] text-[#153E35]">
        Meeting Agenda
      </h3>

      {/* ---- Role segmented control (same component as List/Weekly/Monthly) ---- */}
      <div className="mt-6 flex justify-center">
        <Tabs value={role} onValueChange={(v) => setRole(v as RoleId)}>
          <TabsList className="grid w-full grid-cols-3">
            {ROLES.map((r) => (
              <TabsTrigger key={r.id} value={r.id} title={r.full}>
                {r.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* ---- Day segmented control ---- */}
      <div className="mt-3 flex justify-center">
        <Tabs value={dayId} onValueChange={setDayId}>
          <TabsList className="grid w-full grid-cols-4">
            {days.map((d) => (
              <TabsTrigger key={d.id} value={d.id}>
                {d.tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* ---- Day timeline ----
          Keyed motion.section so changing role/day replays the fade cleanly. */}
      <motion.section
        key={`${role}-${day.id}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mt-8"
      >
        {/* Day header — mirrors the WeekView day header (h3 + tan pill) */}
        <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-lg font-semibold text-[#153E35]">{day.date}</h3>
          <span className="rounded-[2px] bg-[#DDC9A3] px-2 pb-[5px] pt-[4px] text-[11px] font-semibold uppercase leading-none tracking-[0.1em] text-[#85754E]">
            {day.dayLabel}
          </span>
          {day.theme && (
            <p className="w-full text-sm italic text-[#85754E]">{day.theme}</p>
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
      {/* Time — nudged up so its centre lines up with the dot + title */}
      <div className="-mt-[2px] text-right">
        <span className="font-sans text-xs leading-tight text-[#153E35]/70 sm:text-sm">
          {session.time}
        </span>
      </div>

      {/* Connector: dot + vertical line. The dot is nudged down (mt) so its
          centre lines up with the first line of the time + title text. */}
      <div className="relative flex justify-center" aria-hidden>
        {!last && (
          <span className="absolute left-1/2 top-[9px] h-full w-px -translate-x-1/2 bg-[#85754E]/25" />
        )}
        <span className="relative z-10 mt-[7px] h-2 w-2 rounded-full bg-[#85754E] ring-4 ring-luxury-cream" />
      </div>

      {/* Content */}
      <div className={cn("pl-1", last ? "pb-1" : "pb-7")}>
        {/* Session title — Reforma Gris (matches "Sunrise Beach Yoga") */}
        <h3 className="font-reforma-gris text-lg font-semibold leading-tight tracking-[0.02em] text-[#153E35]">
          {session.title}
        </h3>
        {session.details?.map((d, i) => (
          <p key={i} className="mt-1 text-sm leading-relaxed text-[#153E35]/75">
            {d}
          </p>
        ))}
        {/* Thought Starter — reflective prompt (Column D). Set apart with a
            bronze left-rule + small uppercase label, in the same accent family
            as the rest of the event design system. */}
        {session.description && (
          <div className="mt-3 border-l-2 border-[#85754E]/40 pl-3">
            <p className="font-sans text-[11px] font-semibold uppercase leading-none tracking-[0.1em] text-[#85754E]">
              Thought Starter
            </p>
            <p className="mt-1.5 text-sm italic leading-relaxed text-[#153E35]/75">
              {session.description}
            </p>
          </div>
        )}
        {session.dressCode && (
          <p className="mt-1 text-sm text-[#153E35]/75">
            <span className="font-semibold text-[#153E35]">Dress code:</span> {session.dressCode}
          </p>
        )}
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#153E35]">
          <IconMapPin className="h-4 w-4 shrink-0 text-[#85754E]" stroke={1.75} aria-hidden />
          {session.venue}
        </p>
      </div>
    </li>
  );
}
