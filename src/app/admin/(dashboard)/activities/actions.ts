"use server";

/**
 * ACTIVITY SERVER ACTIONS
 *
 * All mutations for activities go through here.
 * Server Actions run on the server, so RLS is enforced automatically.
 *
 * Actions:
 * - createActivity  — insert a new activity row
 * - updateActivity  — update an existing activity
 * - deleteActivity  — delete an activity
 * - togglePublished — flip the published boolean (used in list view)
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Activity } from "@/types/database";

// ── Shared form-data → DB object helper ─────────────────────────────────────
// Converts raw FormData into the shape the DB expects.
// Called by both createActivity and updateActivity.

type ActivityInput = Omit<Activity, "id" | "created_at">;

function parseActivityFormData(formData: FormData): ActivityInput {
  // Tags come in as a comma-separated string from the form
  const tagsRaw = formData.get("tags") as string | null;
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  // image_urls is stored as a JSON array string
  const imageUrlsRaw = formData.get("image_urls") as string | null;
  let image_urls: string[] = [];
  try {
    image_urls = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];
  } catch {
    image_urls = [];
  }

  return {
    hotel_id: formData.get("hotel_id") as string,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    type_id: formData.get("type_id") as string,
    time_of_day: (formData.get("time_of_day") as Activity["time_of_day"]) || null,
    activity_date: formData.get("activity_date") as string,
    start_time: (formData.get("start_time") as string) || null,
    end_time: (formData.get("end_time") as string) || null,
    location: (formData.get("location") as string) || null,
    practitioner: (formData.get("practitioner") as string) || null,
    equipment: (formData.get("equipment") as string) || null,
    image_urls: image_urls.length > 0 ? image_urls : null,
    tags: tags.length > 0 ? tags : null,
    cta_link: (formData.get("cta_link") as string) || null,
    published: formData.get("published") === "true",
    auto_deactivate_at: (formData.get("auto_deactivate_at") as string) || null,
  };
}

// ── CREATE ────────────────────────────────────────────────────────────────────

export async function createActivity(formData: FormData) {
  const supabase = await createClient();

  const data = parseActivityFormData(formData);

  // Our custom Database type doesn't satisfy Supabase's internal Insert
  // generic constraint. Cast through unknown to bypass — runtime is correct.
  const { error } = await (
    supabase.from("activities") as unknown as {
      insert: (d: ActivityInput) => Promise<{ error: { message: string } | null }>;
    }
  ).insert(data);

  if (error) {
    return { error: error.message };
  }

  // Revalidate both the list and the public calendar for this hotel
  revalidatePath("/admin/activities");
  revalidatePath("/admin");

  redirect("/admin/activities");
}

// ── UPDATE ────────────────────────────────────────────────────────────────────

export async function updateActivity(id: string, formData: FormData) {
  const supabase = await createClient();

  const data = parseActivityFormData(formData);

  const { error } = await (
    supabase.from("activities") as unknown as {
      update: (d: Partial<ActivityInput>) => {
        eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .update(data)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/activities");
  revalidatePath(`/admin/activities/${id}`);
  revalidatePath("/admin");

  redirect("/admin/activities");
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function deleteActivity(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("id", id) as unknown as { error: { message: string } | null };

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/activities");
  revalidatePath("/admin");
}

// ── TOGGLE PUBLISHED ──────────────────────────────────────────────────────────
// Used by the inline toggle in the activities list table.

export async function togglePublished(id: string, published: boolean) {
  const supabase = await createClient();

  const { error } = await (
    supabase.from("activities") as unknown as {
      update: (d: { published: boolean }) => {
        eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .update({ published })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/activities");
  revalidatePath("/admin");
}
