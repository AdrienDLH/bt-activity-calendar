/**
 * PUBLIC CALENDAR PAGE - [slug]/page.tsx
 *
 * Main public-facing calendar page for each hotel property.
 * Dynamically loads based on the hotel slug in the URL.
 *
 * FEATURES:
 * - Hotel-specific branding and content
 * - "This Week" and "Upcoming" tab views
 * - Activity filtering by type and time-of-day
 * - Activity detail modals
 * - Private session request FAB
 *
 * ROUTE: /[slug] (e.g., /bintan, /phuket)
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CalendarClientPage } from "./calendar-client";
import { CalendarSkeleton } from "@/components/calendar/calendar-skeleton";
import type { Metadata } from "next";
import type { Hotel, Activity, ActivityType } from "@/types/database";

/**
 * Page Props
 *
 * Next.js App Router passes params as a Promise in recent versions.
 */
interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate Metadata
 *
 * Creates dynamic SEO metadata based on the hotel.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: hotel } = await supabase
    .from("hotels")
    .select("name")
    .eq("slug", slug)
    .single() as { data: { name: string } | null };

  if (!hotel) {
    return {
      title: "Hotel Not Found",
    };
  }

  return {
    title: `Experience Calendar | ${hotel.name}`,
    description: `Discover wellness activities and exclusive experiences at ${hotel.name}. Browse our curated calendar of yoga, meditation, excursions, and more.`,
  };
}

/**
 * CalendarPage
 *
 * Server Component that fetches initial data and renders the calendar.
 * Uses Suspense for loading state with CalendarSkeleton.
 */
export default async function CalendarPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarPageContent slug={slug} />
    </Suspense>
  );
}

/**
 * CalendarPageContent
 *
 * Async Server Component that fetches data from Supabase.
 * Passes data to the Client Component for interactivity.
 */
async function CalendarPageContent({ slug }: { slug: string }) {
  const supabase = await createClient();

  // ========================================
  // FETCH HOTEL DATA
  // Get hotel by slug for branding and CTA base
  // ========================================
  const { data: hotel, error: hotelError } = await supabase
    .from("hotels")
    .select("*")
    .eq("slug", slug)
    .single() as { data: Hotel | null; error: unknown };

  // If hotel not found, show 404
  if (hotelError || !hotel) {
    notFound();
  }

  // ========================================
  // FETCH ACTIVITY TYPES
  // Get all activity categories for filtering
  // ========================================
  const { data: activityTypes } = await supabase
    .from("activity_types")
    .select("*")
    .order("name") as { data: ActivityType[] | null };

  // ========================================
  // FETCH ACTIVITIES
  // Get published activities for this hotel
  // Starting from today, ordered by date and time
  // ========================================
  const today = new Date().toISOString().split("T")[0];

  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("hotel_id", hotel.id)
    .eq("published", true)
    .gte("activity_date", today)
    .order("activity_date", { ascending: true })
    .order("start_time", { ascending: true }) as { data: Activity[] | null };

  // ========================================
  // RENDER CLIENT COMPONENT
  // Pass fetched data for client-side interactivity
  // ========================================
  return (
    <CalendarClientPage
      hotel={hotel}
      activityTypes={activityTypes || []}
      activities={activities || []}
    />
  );
}
