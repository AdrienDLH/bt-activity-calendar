/**
 * AGENDA — /aws/agenda
 *
 * Replaces the original three-level drill-down (role → day → static image) with
 * a single responsive view: pick a role, switch days inline, read the timeline.
 */
import { EventShell } from "@/components/event/event-shell";
import { AgendaClient } from "./agenda-client";

export default function AgendaPage() {
  return (
    <EventShell backHref="/aws" contentClassName="max-w-2xl">
      <AgendaClient />
    </EventShell>
  );
}
