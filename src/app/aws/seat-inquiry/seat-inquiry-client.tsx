"use client";

/**
 * SEAT INQUIRY CLIENT
 *
 * Name field + "Inquire" button → table assignment card. The result animates in
 * beneath the form; "not found" shows a gentle inline message rather than an
 * error. Try the test name "lisa".
 *
 * Backend note: `lookupSeat` is a synchronous mock today. When the database is
 * ready, make this an async fetch — keep the `SeatResult` shape and the rest of
 * this component stays the same.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { lookupSeat, type SeatResult } from "@/lib/event-data";

type Status = "idle" | "found" | "not-found";

export function SeatInquiryClient() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<SeatResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const found = lookupSeat(trimmed);
    setResult(found);
    setStatus(found ? "found" : "not-found");
  }

  return (
    <div className="text-center">
      <h3 className="font-reforma-gris text-xl font-semibold tracking-[0.02em] text-[#153E35]">
        Seat Inquiry
      </h3>
      <p className="mt-2 text-sm text-[#153E35]/70">
        Enter your name to view your table for each session.
      </p>

      {/* ---- Form ---- */}
      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-sm space-y-3 text-left">
        <label htmlFor="seat-name" className="sr-only">
          Your name
        </label>
        {/* Input border mirrors the calendar's interactive controls (#85754E) */}
        <input
          id="seat-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="Enter your name"
          autoComplete="name"
          className="w-full rounded-[2px] border border-[#85754E]/50 bg-card px-4 py-3 text-base text-[#153E35] placeholder:text-[#153E35]/40 focus:border-[#85754E] focus:outline-none focus:ring-2 focus:ring-[#85754E]/30"
        />
        {/* Uses the shared Button (bronze, Reforma Negra) — same as calendar CTAs */}
        <Button type="submit" className="w-full" disabled={!name.trim()}>
          <IconSearch aria-hidden />
          Inquire
        </Button>
      </form>

      {/* ---- Result ---- */}
      <AnimatePresence mode="wait">
        {status === "found" && result && (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mx-auto mt-8 max-w-sm rounded-[2px] bg-card p-6 text-left"
          >
            <p className="mb-4 border-b border-[#85754E]/15 pb-3">
              <span className="font-reforma-gris text-lg font-semibold tracking-[0.02em] text-[#153E35]">
                {result.name}
              </span>
            </p>
            <dl className="space-y-3">
              {result.rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm font-medium text-[#153E35]">{row.label}</dt>
                  <dd className="font-reforma-gris text-base font-semibold tracking-[0.02em] text-[#85754E]">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        )}

        {status === "not-found" && (
          <motion.p
            key="not-found"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-6 max-w-sm text-sm text-[#153E35]/70"
          >
            We couldn&apos;t find a seating record for that name. Please check the spelling or speak
            with the event team.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
