"use client";

/**
 * FEEDBACK CTA — prompt card + bottom-sheet survey
 *
 * Lives above the four navigation tiles on the /aws home. To preserve the
 * home's signature single-screen layout, the survey itself is NOT inline — the
 * card just opens a bottom sheet containing the three open questions.
 *
 * Submission goes to a service-role server action (./actions) that writes to the
 * deny-all-RLS `aws_feedback` table; nothing is read back to the browser. The
 * survey is fully anonymous (no name/email).
 *
 * Duplicate prevention is a SOFT, server-set cookie. The home page reads it and
 * passes `alreadySubmitted`; we also flip to the thank-you state locally right
 * after a successful submit so the same session reflects it immediately.
 *
 * Accessibility: built on the Radix Dialog primitive, so focus-trap, Escape,
 * and scrim click-to-close work out of the box (WCAG 2.2 AA).
 */
import { useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  IconMessageHeart,
  IconCircleCheck,
  IconLoader2,
  IconX,
  IconArrowRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { submitFeedback } from "./actions";

/** The three open questions. Edit the copy here. */
const QUESTIONS = [
  {
    key: "enjoyed" as const,
    label: "What did you enjoy most about the event?",
    placeholder: "The moments, sessions or people that stood out…",
  },
  {
    key: "improve" as const,
    label: "What could we improve for next time?",
    placeholder: "Anything that would have made it better…",
  },
  {
    key: "other" as const,
    label: "Anything else you’d like to share?",
    placeholder: "Other thoughts, ideas or suggestions…",
  },
];

// Textarea styling mirrors the Seat Inquiry input exactly (AWS tokens:
// rounded-[2px], #85754E border, white surface) rather than the rounded-none
// base Textarea, so the survey matches the rest of the microsite.
const FIELD_CLASS =
  "w-full min-h-[88px] resize-y rounded-[2px] border border-[#85754E]/50 bg-card px-4 py-3 text-base text-[#153E35] placeholder:text-[#153E35]/40 focus:border-[#85754E] focus:outline-none focus:ring-2 focus:ring-[#85754E]/30";

export function FeedbackCta({ alreadySubmitted }: { alreadySubmitted: boolean }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false); // success within this session
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState({ enjoyed: "", improve: "", other: "" });

  const submitted = alreadySubmitted || done;
  const hasAnyAnswer = Object.values(values).some((v) => v.trim().length > 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await submitFeedback(values);
      if (res.status === "ok" || res.status === "duplicate") {
        setDone(true); // either way, this browser is done
      } else if (res.status === "empty") {
        setError("Please answer at least one question before sending.");
      } else {
        setError("Something went wrong sending your feedback. Please try again.");
      }
    });
  }

  // ---- Already submitted: a quiet thank-you card, no trigger ----
  if (submitted && !open) {
    return (
      <div className="mb-5 flex items-center justify-center gap-2 rounded-[2px] border border-[#85754E]/30 bg-card/60 px-4 py-3 text-center">
        <IconCircleCheck className="h-5 w-5 shrink-0 text-[#85754E]" stroke={1.75} aria-hidden />
        <p className="font-sans text-sm text-[#153E35]/80">
          Thank you for sharing your feedback.
        </p>
      </div>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* ---- Prompt card (above the tiles) ---- */}
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="group mb-5 flex w-full items-center gap-3 rounded-[2px] bg-card px-4 py-3.5 text-left no-underline transition-transform duration-200 hover:-translate-y-1 active:scale-[0.98]"
        >
          <IconMessageHeart className="h-6 w-6 shrink-0 text-[#85754E]" stroke={1.5} aria-hidden />
          <span className="flex-1">
            <span className="block font-reforma-gris text-base font-semibold leading-tight tracking-[0.02em] text-[#153E35]">
              Share Your Feedback
            </span>
            <span className="mt-0.5 block font-sans text-xs text-[#153E35]/60">
              Three quick questions · anonymous
            </span>
          </span>
          {/* Icon (not a text glyph) so it sits on the row's vertical centre */}
          <IconArrowRight
            className="h-5 w-5 shrink-0 text-[#85754E] transition-transform duration-200 group-hover:translate-x-0.5"
            stroke={1.75}
            aria-hidden
          />
        </button>
      </Dialog.Trigger>

      {/* ---- Centered modal ---- */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2px] bg-luxury-cream px-5 pb-8 pt-6 shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          {/* Close */}
          <Dialog.Close
            className="absolute right-4 top-4 rounded-[2px] p-1.5 text-[#153E35]/60 transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#85754E]/40"
            aria-label="Close"
          >
            <IconX className="h-5 w-5" aria-hidden />
          </Dialog.Close>

          {done ? (
            // ---- Success state (inside the sheet) ----
            <div className="py-8 text-center">
              <IconCircleCheck className="mx-auto h-12 w-12 text-[#85754E]" stroke={1.5} aria-hidden />
              <Dialog.Title className="mt-4 font-reforma-gris text-xl font-semibold tracking-[0.02em] text-[#153E35]">
                Thank You
              </Dialog.Title>
              <Dialog.Description className="mx-auto mt-2 max-w-sm font-sans text-sm text-[#153E35]/70">
                Your feedback has been received. We’re grateful you took the time to share it.
              </Dialog.Description>
              <Button type="button" className="mt-6" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          ) : (
            // ---- Survey form ----
            <>
              <Dialog.Title className="font-reforma-gris text-xl font-semibold tracking-[0.02em] text-[#153E35]">
                Share Your Feedback
              </Dialog.Title>
              <Dialog.Description className="mt-2 font-sans text-sm text-[#153E35]/70">
                Your thoughts help us shape future gatherings. It takes less than a minute, and it’s
                completely anonymous.
              </Dialog.Description>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-left">
                {QUESTIONS.map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label
                      htmlFor={`fb-${key}`}
                      className="mb-2 block font-reforma-gris text-base font-semibold leading-snug tracking-[0.02em] text-[#153E35]"
                    >
                      {label}
                    </label>
                    <textarea
                      id={`fb-${key}`}
                      value={values[key]}
                      onChange={(e) => {
                        setValues((v) => ({ ...v, [key]: e.target.value }));
                        if (error) setError(null);
                      }}
                      placeholder={placeholder}
                      rows={3}
                      className={FIELD_CLASS}
                    />
                  </div>
                ))}

                {error && (
                  <p className="font-sans text-sm text-[#153E35]/80">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!hasAnyAnswer || isPending}
                >
                  {isPending ? (
                    <IconLoader2 className="animate-spin" aria-hidden />
                  ) : null}
                  {isPending ? "Sending…" : "Send Feedback"}
                </Button>
              </form>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
