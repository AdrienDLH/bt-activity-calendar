/**
 * USERS PAGE — /admin/users
 *
 * Master admin only.
 * Read-only list of all user profiles with role and hotel assignment.
 *
 * Future enhancement: inline role/hotel editing.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Users } from "lucide-react";
import { format } from "date-fns";
import type { Profile, Hotel } from "@/types/database";

// Join type — profile with hotel name
type ProfileWithHotel = Profile & {
  hotels: Pick<Hotel, "name"> | null;
};

export default async function UsersPage() {
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
            Only master administrators can view users.
          </p>
        </div>
      </div>
    );
  }

  // ── Fetch Profiles (joined with hotel name) ───────────────────────────────
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*, hotels(name)")
    .order("updated_at", { ascending: false }) as {
      data: ProfileWithHotel[] | null;
    };

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-4 w-4 text-luxury-gold" />
          <span className="text-xs uppercase tracking-wider text-[#153E35] font-sans">
            Master Admin
          </span>
        </div>
        <h1 className="font-reforma-negra text-2xl uppercase tracking-[0.15em] text-[#153E35]">
          Users
        </h1>
        <p className="text-sm text-[#153E35] mt-1 font-sans">
          {profiles?.length ?? 0} registered admin accounts
        </p>
      </div>

      {/* ── Info Banner ──────────────────────────────────────────── */}
      <div className="bg-luxury-gold/8 border border-luxury-gold/20 p-4">
        <p className="text-xs text-[#153E35] font-sans">
          User accounts are created by inviting users via Supabase Auth.
          Role and hotel assignments can be updated directly in the Supabase
          dashboard → Table Editor → profiles.
        </p>
      </div>

      {/* ── Users Table ───────────────────────────────────────────── */}
      <div className="bg-card border border-border/50">
        {!profiles?.length ? (
          <div className="p-10 text-center">
            <Users className="h-8 w-8 text-[#153E35] mx-auto mb-3" />
            <p className="text-sm text-[#153E35]">No user profiles found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-[#153E35] font-normal font-sans">
                    Name
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-[#153E35] font-normal font-sans hidden sm:table-cell">
                    Role
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-[#153E35] font-normal font-sans hidden md:table-cell">
                    Hotel
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-[#153E35] font-normal font-sans hidden lg:table-cell">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`
                      ${i < profiles.length - 1 ? "border-b border-border/20" : ""}
                      ${p.id === user.id ? "bg-luxury-gold/5" : "hover:bg-background/40"}
                      transition-colors
                    `}
                  >
                    {/* Name / ID */}
                    <td className="p-4">
                      <p className="font-medium text-[#153E35]">
                        {p.full_name ?? "—"}
                        {p.id === user.id && (
                          <span className="ml-2 text-xs text-luxury-gold font-sans font-normal">
                            (you)
                          </span>
                        )}
                      </p>
                      {/* Show role on mobile below name */}
                      <p className="text-xs text-[#153E35] mt-0.5 font-sans sm:hidden">
                        {p.role === "master_admin" ? "Master Admin" : "Property Admin"}
                      </p>
                    </td>

                    {/* Role badge */}
                    <td className="p-4 hidden sm:table-cell">
                      <span
                        className={`
                          inline-block px-2 py-0.5 text-xs font-sans uppercase tracking-wide
                          ${p.role === "master_admin"
                            ? "bg-[#173F35]/10 text-[#173F35]"
                            : "bg-luxury-gold/10 text-luxury-brown"
                          }
                        `}
                      >
                        {p.role === "master_admin" ? "Master" : "Property"}
                      </span>
                    </td>

                    {/* Hotel */}
                    <td className="p-4 text-[#153E35] hidden md:table-cell">
                      {p.hotels?.name ?? (
                        p.role === "master_admin" ? "All Hotels" : "—"
                      )}
                    </td>

                    {/* Last updated */}
                    <td className="p-4 text-[#153E35] text-xs hidden lg:table-cell font-sans">
                      {format(new Date(p.updated_at), "dd MMM yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Count footer */}
        {profiles && profiles.length > 0 && (
          <div className="px-4 py-3 border-t border-border/20 text-xs text-[#153E35] font-sans">
            {profiles.length} users
          </div>
        )}
      </div>
    </div>
  );
}
