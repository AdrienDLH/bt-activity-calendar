/**
 * SEAT INQUIRY — /aws/seat-inquiry
 *
 * Guests enter their name to retrieve their table assignment for each session.
 * The lookup is currently mocked (see `lookupSeat` in event-data.ts) and returns
 * demo data for "lisa"; swap in the real backend query later without changing
 * the UI.
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
