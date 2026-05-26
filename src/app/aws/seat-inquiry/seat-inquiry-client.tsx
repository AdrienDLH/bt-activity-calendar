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
      <h1 className="font-reforma-gris text-2xl tracking-[0.02em] text-[#153E35]">Seat Inquiry</h1>
      <p className="mt-2 text-sm text-[#153E35]/70">
        Enter your name to view your table for each session.
      </p>

      {/* ---- Form ---- */}
      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-sm space-y-3 text-left">
        <label htmlFor="seat-name" className="sr-only">
          Your name
        </label>
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
          className="w-full rounded-none border border-[#153E35]/20 bg-white px-4 py-3 text-base text-[#153E35] placeholder:text-[#153E35]/40 focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/40"
        />
        <button
          type="submit"
          className="flex min-h-touch w-full items-center justify-center gap-2 rounded-none bg-luxury-forest px-4 py-3 font-reforma-negra text-sm uppercase tracking-[0.12em] text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-50"
          disabled={!name.trim()}
        >
          <IconSearch className="h-4 w-4" stroke={2} aria-hidden />
          Inquire
        </button>
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
            className="mx-auto mt-8 max-w-sm border border-[#153E35]/10 bg-white/70 p-6 text-left backdrop-blur-sm"
          >
            <p className="mb-4 border-b border-[#153E35]/10 pb-3">
              <span className="font-reforma-gris text-lg tracking-[0.02em] text-[#153E35]">
                {result.name}
              </span>
            </p>
            <dl className="space-y-3">
              {result.rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm font-medium text-[#153E35]">{row.label}</dt>
                  <dd className="font-reforma-gris text-base tracking-[0.02em] text-luxury-gold">
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
