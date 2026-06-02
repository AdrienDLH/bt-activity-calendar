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

export interface SeatRow {
  label: string;
  value: string;
}

export type SeatLookupResult =
  | { status: "found"; name: string; rows: SeatRow[] }
  | { status: "not-found" }
  | { status: "invalid" }
  | { status: "error" };

// Pragmatic email shape check — lenient enough not to reject valid addresses,
// strict enough to avoid pointless DB lookups on obvious typos.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // Only surface sessions that actually have a table assigned; an attendee
    // may not be seated for every session. (Labels in display order.)
    const rows: SeatRow[] = [
      { label: "Jun 8", value: seat.jun_8 },
      { label: "Jun 9 — Morning", value: seat.jun_9_morning },
      { label: "Jun 9 — Afternoon", value: seat.jun_9_afternoon },
      { label: "Jun 10", value: seat.jun_10 },
    ]
      .map((r) => ({ label: r.label, value: (r.value ?? "").trim() }))
      .filter((r) => r.value.length > 0);

    return { status: "found", name: seat.name, rows };
  } catch (err) {
    console.error("[seat-inquiry] unexpected error:", err);
    return { status: "error" };
  }
}
