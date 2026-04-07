"use client";

/**
 * ADMIN SIDEBAR — Navigation for the Admin Dashboard
 *
 * Two layouts in one component:
 * - Desktop (md+): Fixed left sidebar, 256px wide
 * - Mobile: Fixed bottom navigation bar (like a native app)
 *
 * Active route is highlighted with the deep forest green (#173F35).
 * Role-gated items (master_admin only) are conditionally rendered.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Tag,
  Building2,
  Users,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Hotel } from "@/types/database";
import { cn } from "@/lib/utils";

// ── Nav Item Definition ────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  masterOnly?: boolean; // If true, hidden for property_admin
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Activities",
    href: "/admin/activities",
    icon: CalendarDays,
  },
  {
    label: "Activity Types",
    href: "/admin/activity-types",
    icon: Tag,
    masterOnly: true,
  },
  {
    label: "Hotels",
    href: "/admin/hotels",
    icon: Building2,
    masterOnly: true,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
    masterOnly: true,
  },
];

// ── Component Props ────────────────────────────────────────────────────────

interface SidebarProps {
  profile: Profile;
  hotel: Hotel | null;
}

// ── Component ──────────────────────────────────────────────────────────────

export function Sidebar({ profile, hotel }: SidebarProps) {
  const pathname = usePathname();
  const supabase = createClient();

  // Filter nav items based on role
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.masterOnly || profile.role === "master_admin"
  );

  // Sign out and redirect to login page.
  // Use window.location.href (hard redirect) instead of router.push so the
  // browser makes a fresh HTTP request with cleared cookies — router.push is
  // a client-side navigation that can race against cookie invalidation and
  // cause the middleware to redirect back to /admin before the cookie clears.
  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  // Determine if a nav link is "active".
  // /admin is exact-match; all others use startsWith so sub-routes highlight too.
  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────── */}
      {/* Hidden on mobile, fixed on desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-card border-r border-border/50 z-40">

        {/* ── Brand / Hotel Header ────────────────────────────── */}
        <div className="p-6 border-b border-border/50">
          {/* Gold accent bar — matches the login page brand marker */}
          <div className="w-8 h-0.5 bg-luxury-gold mb-3" />
          <p className="font-reforma-negra text-xs uppercase tracking-[0.15em] text-[#153E35]">
            Banyan Tree
          </p>
          {/* Show hotel name or "Master Admin" label */}
          <p className="font-reforma-gris text-base text-[#153E35] mt-0.5 leading-tight">
            {profile.role === "master_admin"
              ? "Master Admin"
              : hotel?.name ?? "Admin"}
          </p>
          {profile.full_name && (
            <p className="text-xs text-[#153E35] mt-1 font-sans">
              {profile.full_name}
            </p>
          )}
        </div>

        {/* ── Navigation Links ─────────────────────────────────── */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {visibleItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
            />
          ))}
        </nav>

        {/* ── Sign Out (bottom of sidebar) ──────────────────────── */}
        <div className="p-3 border-t border-border/50">
          <button
            onClick={handleSignOut}
            className={cn(
              // Same base styles as NavLink for visual consistency
              "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-sans",
              "text-[#153E35] hover:text-[#153E35] hover:bg-background",
              "transition-colors duration-150",
              "min-h-[44px]" // Apple HIG touch target
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ────────────────────────────────────── */}
      {/* Fixed at the bottom of the screen, like a native iOS app */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border/50 pb-safe"
        aria-label="Mobile navigation"
      >
        <div className="flex items-stretch">
          {visibleItems.map((item) => (
            <MobileNavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
            />
          ))}
        </div>
      </nav>
    </>
  );
}

// ── Desktop Nav Link ───────────────────────────────────────────────────────

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 text-sm font-sans",
        "transition-colors duration-150 min-h-[44px]",
        active
          ? // Active: deep forest green background with white text
            "bg-[#173F35] text-white"
          : // Inactive: subtle hover state
            "text-[#153E35] hover:text-[#153E35] hover:bg-background"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>

      {/* Active indicator bar on the right edge */}
      {active && (
        <div className="ml-auto w-0.5 h-4 bg-luxury-gold" />
      )}
    </Link>
  );
}

// ── Mobile Nav Link ────────────────────────────────────────────────────────

function MobileNavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex-1 flex flex-col items-center justify-center gap-1 py-3",
        "text-xs font-sans transition-colors duration-150 min-h-[56px]",
        active
          ? "text-[#173F35]" // Active: forest green text + gold dot below
          : "text-[#153E35] hover:text-[#153E35]"
      )}
    >
      <Icon className={cn("h-5 w-5", active && "stroke-[2]")} />
      <span className="leading-none">{item.label}</span>
      {/* Active dot indicator */}
      {active && <div className="w-1 h-1 bg-luxury-gold" />}
    </Link>
  );
}
