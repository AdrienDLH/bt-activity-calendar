"use server";

/**
 * HOTELS SERVER ACTIONS
 *
 * Create and update hotel records.
 * Master admin only — RLS will block property_admin at the DB level too.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Shared type for the hotel insert/update payload
interface HotelPayload {
  name: string;
  slug: string;
  logo_url: string | null;
  private_session_cta_base: string | null;
}

// ── CREATE ────────────────────────────────────────────────────────────────────

export async function createHotel(formData: FormData) {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim().toLowerCase();
  const logo_url = (formData.get("logo_url") as string)?.trim() || null;
  const private_session_cta_base =
    (formData.get("private_session_cta_base") as string)?.trim() || null;

  if (!name || !slug) return { error: "Name and slug are required." };

  const payload: HotelPayload = { name, slug, logo_url, private_session_cta_base };

  const { error } = await (
    supabase.from("hotels") as unknown as {
      insert: (d: HotelPayload) => Promise<{ error: { message: string } | null }>;
    }
  ).insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/admin/hotels");
  revalidatePath("/admin");
}

// ── UPDATE ────────────────────────────────────────────────────────────────────

export async function updateHotel(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim().toLowerCase();
  const logo_url = (formData.get("logo_url") as string)?.trim() || null;
  const private_session_cta_base =
    (formData.get("private_session_cta_base") as string)?.trim() || null;

  if (!name || !slug) return { error: "Name and slug are required." };

  const payload: HotelPayload = { name, slug, logo_url, private_session_cta_base };

  const { error } = await (
    supabase.from("hotels") as unknown as {
      update: (d: HotelPayload) => {
        eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .update(payload)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/hotels");
  revalidatePath("/admin");
}
