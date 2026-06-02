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
  return (
    <EventShell backHref="/aws" contentClassName="max-w-md">
      <SeatInquiryClient />
    </EventShell>
  );
}
