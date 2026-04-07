/**
 * HOTELS PAGE — /admin/hotels
 *
 * Master admin only.
 * Lists all hotels with inline editing.
 * Fields: name, slug, logo_url, private_session_cta_base.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Building2 } from "lucide-react";
import { HotelsManager } from "./hotels-manager";
import type { Profile, Hotel } from "@/types/database";

export default async function HotelsPage() {
  const supabase = await createClient();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null };

  if (!profile) redirect("/admin/login");

  // ── Guard: master_admin only ──────────────────────────────────────────────
  if (profile.role !== "master_admin") {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-2">
          <p className="font-reforma-gris text-lg text-[#153E35]">Access Denied</p>
          <p className="text-sm text-[#153E35]">
            Only master administrators can manage hotels.
          </p>
        </div>
      </div>
    );
  }

  // ── Fetch Hotels ──────────────────────────────────────────────────────────
  const { data: hotels } = await supabase
    .from("hotels")
    .select("*")
    .order("name") as { data: Hotel[] | null };

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="h-4 w-4 text-luxury-gold" />
          <span className="text-xs uppercase tracking-wider text-[#153E35] font-sans">
            Master Admin
          </span>
        </div>
        <h1 className="font-reforma-negra text-2xl uppercase tracking-[0.15em] text-[#153E35]">
          Hotels
        </h1>
        <p className="text-sm text-[#153E35] mt-1 font-sans">
          {hotels?.length ?? 0} properties in the Banyan Tree Group.
        </p>
      </div>

      {/* ── Hotels Manager ─────────────────────────────────────── */}
      <HotelsManager hotels={hotels ?? []} />
    </div>
  );
}
