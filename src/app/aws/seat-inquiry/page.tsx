/**
 * SEAT INQUIRY — /aws/seat-inquiry
 *
 * Guests enter their EMAIL to retrieve their table assignment for each session.
 * The lookup runs in a server action (./actions) that queries the deny-all-RLS
 * `aws_seats` Supabase table with the service-role key — attendee data stays
 * server-side and never reaches the browser.
 */
import { EventShell } from "@/components/event/event-shell";
import { SeatInquiryClient } from "./seat-inquiry-client";

export default function SeatInquiryPage() {
  // Wider shell so the result's day cards have room (3 across on desktop);
  // the form constrains its own width with mx-auto max-w-sm.
  return (
    <EventShell backHref="/aws" contentClassName="max-w-2xl">
      <SeatInquiryClient />
    </EventShell>
  );
}
