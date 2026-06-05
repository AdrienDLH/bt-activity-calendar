"use client";

/**
 * SEAT INQUIRY CLIENT
 *
 * Email field + "Inquire" button → table assignment card. The actual lookup
 * happens in a server action (./actions) that reads the deny-all-RLS
 * `aws_seats` table with the service-role key, so no attendee data is ever
 * shipped to the browser. This component only ever receives the single matched
 * record (or a status). Try the test email "lisa.liu@groupbanyan.com".
 *
 * Edge cases handled: empty/invalid email, not-found, server error, and the
 * in-flight loading state.
 */
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconSearch, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { lookupSeat, type SeatLookupResult } from "./actions";

export function SeatInquiryClient() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<SeatLookupResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setResult(null); // clear any previous result so nothing stale shows mid-search
    startTransition(async () => {
      const res = await lookupSeat(trimmed);
      setResult(res);
    });
  }

  return (
    <div className="text-center">
      <h3 className="font-reforma-gris text-xl font-semibold tracking-[0.02em] text-[#153E35]">
        Seat Inquiry
      </h3>
      <p className="mt-2 text-sm text-[#153E35]/70">
        Enter your email to view your table for each session.
      </p>

      {/* ---- Form ---- */}
      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-sm space-y-3 text-left">
        <label htmlFor="seat-email" className="sr-only">
          Your email
        </label>
        {/* Input border mirrors the calendar's interactive controls (#85754E) */}
        <input
          id="seat-email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (result) setResult(null);
          }}
          placeholder="Enter your email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          className="w-full rounded-[2px] border border-[#85754E]/50 bg-card px-4 py-3 text-base text-[#153E35] placeholder:text-[#153E35]/40 focus:border-[#85754E] focus:outline-none focus:ring-2 focus:ring-[#85754E]/30"
        />
        {/* Uses the shared Button (bronze, Reforma Negra) — same as calendar CTAs */}
        <Button type="submit" className="w-full" disabled={!email.trim() || isPending}>
          {isPending ? (
            <IconLoader2 className="animate-spin" aria-hidden />
          ) : (
            <IconSearch aria-hidden />
          )}
          {isPending ? "Searching…" : "Inquire"}
        </Button>
      </form>

      {/* ---- Result ---- */}
      <AnimatePresence mode="wait">
        {!isPending && result?.status === "found" && (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-8"
          >
            {/* Attendee name — confirms "this is you" */}
            <p className="font-reforma-gris text-lg font-semibold tracking-[0.02em] text-[#153E35]">
              {result.name}
            </p>

            {result.days.length > 0 ? (
              // Day cards: one per day. Three across on sm+, stacked on mobile.
              // Jun 9 holds two slots (am/pm) side by side inside its card.
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {result.days.map((day) => (
                  <div
                    key={day.date}
                    className="rounded-[2px] bg-card p-5 transition-transform duration-200 hover:-translate-y-1"
                  >
                    <p className="font-reforma-gris text-lg font-semibold tracking-[0.02em] text-[#153E35]">
                      {day.date}
                    </p>
                    <p className="mt-0.5 text-xs text-[#153E35]/50">{day.weekday}</p>
                    <div className="my-4 h-px bg-[#85754E]/15" />
                    <div className={day.slots.length > 1 ? "flex justify-center gap-6" : ""}>
                      {day.slots.map((slot) => (
                        <div key={slot.label}>
                          <span className="font-sans text-[11px] font-semibold uppercase leading-none tracking-[0.1em] text-[#85754E]">
                            {slot.label}
                          </span>
                          <p className="mt-2 font-reforma-negra text-3xl tracking-[0.05em] text-[#85754E]">
                            {slot.table}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#153E35]/70">
                No table assignments are on record yet. Please check back later or speak with the
                event team.
              </p>
            )}
          </motion.div>
        )}

        {!isPending && result && result.status !== "found" && (
          <motion.p
            key={result.status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-6 max-w-sm text-sm text-[#153E35]/70"
          >
            {result.status === "invalid" &&
              "Please enter a valid email address (the one you registered with)."}
            {result.status === "not-found" &&
              "We couldn’t find a seating record for that email. Please check the spelling or speak with the event team."}
            {result.status === "error" &&
              "Something went wrong looking up your seat. Please try again in a moment."}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
