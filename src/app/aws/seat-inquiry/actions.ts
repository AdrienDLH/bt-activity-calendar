"use server";

/**
 * SEAT INQUIRY — SERVER ACTION
 *
 * Looks up an attendee's table assignments by EMAIL. This runs ONLY on the
 * server: it uses the Supabase service-role admin client to read the
 * `aws_seats` table, which has RLS enabled with no policies (deny-all to the
 * public anon/authenticated keys). The attendee list is therefore never
 * shipped to the browser and is not reachable with the public key — only this
 * action can read it, and it returns just the single matched record.
 *
 * The return value is a discriminated union so the UI can render each edge
 * case (found / not-found / invalid email / server error) cleanly.
 */
import { createAdminClient } from "@/lib/supabase/admin";
import type { AwsSeat } from "@/types/database";

/** One table assignment within a day (e.g. label "Table (am)", table "No.3"). */
export interface SeatSlot {
  label: string;
  table: string;
}

/** A day's worth of assignments — one slot for full-day, two for Jun 9 (am/pm). */
export interface SeatDay {
  date: string;
  weekday: string;
  slots: SeatSlot[];
}

export type SeatLookupResult =
  | { status: "found"; name: string; days: SeatDay[] }
  | { status: "not-found" }
  | { status: "invalid" }
  | { status: "error" };

// Pragmatic email shape check — lenient enough not to reject valid addresses,
// strict enough to avoid pointless DB lookups on obvious typos.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The big number shown in the card is the table identifier only. Source values
// look like "Table NO.1"; strip a leading "Table" so we don't render the word
// twice (the card already labels it "Table (all day)" etc.). Returns "" if blank.
function tableValue(raw: string | null): string {
  return (raw ?? "").trim().replace(/^table\s*/i, "").trim();
}

export async function lookupSeat(rawEmail: string): Promise<SeatLookupResult> {
  // Normalise: emails are case-insensitive and shouldn't carry stray spaces.
  const email = (rawEmail ?? "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return { status: "invalid" };
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("aws_seats")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("[seat-inquiry] lookup failed:", error.message);
      return { status: "error" };
    }
    const seat = data as AwsSeat | null;
    if (!seat) {
      return { status: "not-found" };
    }

    // Group into day cards. Only include a day/slot that actually has a table
    // assigned — an attendee may not be seated for every session.
    const days: SeatDay[] = [];

    const jun8 = tableValue(seat.jun_8);
    if (jun8) {
      days.push({ date: "Jun 8", weekday: "Monday", slots: [{ label: "Table (all day)", table: jun8 }] });
    }

    const am = tableValue(seat.jun_9_morning);
    const pm = tableValue(seat.jun_9_afternoon);
    const jun9: SeatSlot[] = [];
    if (am) jun9.push({ label: "Table (am)", table: am });
    if (pm) jun9.push({ label: "Table (pm)", table: pm });
    if (jun9.length) {
      days.push({ date: "Jun 9", weekday: "Tuesday", slots: jun9 });
    }

    const jun10 = tableValue(seat.jun_10);
    if (jun10) {
      days.push({ date: "Jun 10", weekday: "Wednesday", slots: [{ label: "Table (all day)", table: jun10 }] });
    }

    return { status: "found", name: seat.name, days };
  } catch (err) {
    console.error("[seat-inquiry] unexpected error:", err);
    return { status: "error" };
  }
}
