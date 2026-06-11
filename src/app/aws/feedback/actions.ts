"use server";

/**
 * FEEDBACK SURVEY — SERVER ACTION
 *
 * Stores one anonymous feedback submission for the AWS 2026 event. Runs ONLY on
 * the server: it writes to the `aws_feedback` table via the Supabase
 * service-role admin client. That table has RLS enabled with NO policies, so it
 * is unreachable with the public anon key — only this action can write to it,
 * and nothing is ever read back into the browser (mirrors the Seat Inquiry
 * pattern). The survey is fully anonymous — no name or email is collected.
 *
 * Duplicate prevention: after a successful insert we set a long-lived,
 * httpOnly cookie. On the next visit the home page reads that cookie (see
 * `hasSubmittedFeedback`) and shows a "thank you" state instead of the form.
 * This is a deliberately SOFT guard — it stops casual re-submission on the same
 * device/browser, but won't block a different device or a private window. That
 * is the right trade-off for event feedback (no logins, low friction).
 */
import { cookies, headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

/** Cookie that marks this browser as having already submitted. */
const FEEDBACK_COOKIE = "aws-feedback-submitted";
/** Keep the "already submitted" state for ~90 days (well past the event). */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90;
/** Guard against oversized payloads; a generous ceiling for open text. */
const MAX_LEN = 5000;

export interface FeedbackInput {
  enjoyed: string;
  improve: string;
  other: string;
}

export type FeedbackResult =
  | { status: "ok" }
  | { status: "empty" } // nothing was actually filled in
  | { status: "duplicate" } // this browser already submitted
  | { status: "error" };

/** Read-only helper for server components: has this browser already submitted? */
export async function hasSubmittedFeedback(): Promise<boolean> {
  const store = await cookies();
  return store.get(FEEDBACK_COOKIE)?.value === "1";
}

// Trim, collapse to null when blank, and cap length so one answer can't be
// pasted into a novel. Returns null for empty so blank columns stay clean.
function clean(raw: string): string | null {
  const v = (raw ?? "").trim().slice(0, MAX_LEN);
  return v.length ? v : null;
}

export async function submitFeedback(input: FeedbackInput): Promise<FeedbackResult> {
  // Respect the soft guard: if this browser already submitted, don't write again.
  if (await hasSubmittedFeedback()) {
    return { status: "duplicate" };
  }

  const enjoyed = clean(input?.enjoyed ?? "");
  const improve = clean(input?.improve ?? "");
  const other = clean(input?.other ?? "");

  // Require at least one non-empty answer — never store a fully empty row.
  if (!enjoyed && !improve && !other) {
    return { status: "empty" };
  }

  try {
    // Light, non-identifying context only — useful for spotting mobile vs desktop.
    const userAgent = (await headers()).get("user-agent")?.slice(0, 500) ?? null;

    const supabase = createAdminClient();
    // Cast mirrors the project's other inserts: the generated Database type
    // resolves insert payloads to `never`, so we narrow .from() to the shape
    // we actually write (see admin/activity-types/actions.ts).
    const { error } = await (
      supabase.from("aws_feedback") as unknown as {
        insert: (d: {
          enjoyed: string | null;
          improve: string | null;
          other: string | null;
          user_agent: string | null;
        }) => Promise<{ error: { message: string } | null }>;
      }
    ).insert({ enjoyed, improve, other, user_agent: userAgent });

    if (error) {
      console.error("[feedback] insert failed:", error.message);
      return { status: "error" };
    }

    // Mark this browser as done. httpOnly so client JS can't trivially wipe it;
    // the home page reads it server-side to decide which state to render.
    (await cookies()).set(FEEDBACK_COOKIE, "1", {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return { status: "ok" };
  } catch (err) {
    console.error("[feedback] unexpected error:", err);
    return { status: "error" };
  }
}
