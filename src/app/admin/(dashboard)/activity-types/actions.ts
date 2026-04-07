"use server";

/**
 * ACTIVITY TYPES SERVER ACTIONS
 *
 * Create and delete activity type records.
 * Only master_admin can access these routes (enforced by page guard + RLS).
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ── CREATE ────────────────────────────────────────────────────────────────────

export async function createActivityType(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required." };

  const supabase = await createClient();

  const { error } = await (
    supabase.from("activity_types") as unknown as {
      insert: (d: { name: string }) => Promise<{ error: { message: string } | null }>;
    }
  ).insert({ name });

  if (error) {
    // Unique constraint: a type with this name already exists
    if (error.message.includes("unique constraint") || error.message.includes("duplicate key")) {
      return { error: `An activity type with that name already exists.` };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/activity-types");
  revalidatePath("/admin");
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function deleteActivityType(id: string) {
  const supabase = await createClient();

  // Note: Supabase FK constraint will prevent deletion if any activities
  // still reference this type. The error message will surface to the UI.
  const { error } = await supabase
    .from("activity_types")
    .delete()
    .eq("id", id) as unknown as { error: { message: string } | null };

  if (error) {
    // FK violation: this type is still referenced by one or more activities
    if (error.message.includes("foreign key constraint")) {
      return { error: "Cannot delete: this type is used by existing activities." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/activity-types");
  revalidatePath("/admin");
}
