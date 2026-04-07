"use client";

/**
 * HOTELS MANAGER — Client Component
 *
 * Handles the interactive parts of hotel management:
 * - Add new hotel form
 * - Inline edit per hotel row (expand on click)
 */

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Pencil, ChevronUp, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createHotel, updateHotel } from "./actions";
import type { Hotel } from "@/types/database";

interface HotelsManagerProps {
  hotels: Hotel[];
}

export function HotelsManager({ hotels }: HotelsManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // ── Create ──────────────────────────────────────────────────────────────
  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createHotel(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Hotel created.");
        setShowAddForm(false);
      }
    });
  }

  // ── Update ──────────────────────────────────────────────────────────────
  function handleUpdate(id: string, formData: FormData) {
    startTransition(async () => {
      const result = await updateHotel(id, formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Hotel updated.");
        setEditingId(null);
      }
    });
  }

  return (
    <div className="space-y-4">

      {/* ── Add Hotel Button / Form ─────────────────────────────── */}
      {!showAddForm ? (
        <Button
          onClick={() => setShowAddForm(true)}
          className="rounded-none bg-luxury-gold hover:bg-luxury-gold/90 text-white"
        >
          <Plus className="h-4 w-4" />
          Add Hotel
        </Button>
      ) : (
        <div className="bg-card border border-border/50 p-5 space-y-4">
          <p className="text-xs uppercase tracking-wider text-[#153E35] font-sans">
            New Hotel
          </p>
          <form action={handleCreate} className="space-y-4">
            <HotelFormFields />
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-none bg-luxury-gold hover:bg-luxury-gold/90 text-white"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Hotel"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="rounded-none"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ── Hotels List ────────────────────────────────────────── */}
      <div className="bg-card border border-border/50 divide-y divide-border/20">
        {hotels.length === 0 ? (
          <div className="p-10 text-center">
            <Building2 className="h-8 w-8 text-[#153E35] mx-auto mb-3" />
            <p className="text-sm text-[#153E35]">No hotels yet.</p>
          </div>
        ) : (
          hotels.map((hotel) => (
            <div key={hotel.id}>
              {/* ── Hotel Row ──────────────────────────────────── */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm text-[#153E35] truncate">
                    {hotel.name}
                  </p>
                  <p className="text-xs text-[#153E35] font-sans">
                    /{hotel.slug}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setEditingId(editingId === hotel.id ? null : hotel.id)
                  }
                  className="h-8 w-8 text-[#153E35] hover:text-[#153E35] shrink-0"
                >
                  {editingId === hotel.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <Pencil className="h-3.5 w-3.5" />
                  )}
                  <span className="sr-only">Edit {hotel.name}</span>
                </Button>
              </div>

              {/* ── Inline Edit Form ───────────────────────────── */}
              {editingId === hotel.id && (
                <div className="px-5 pb-5 bg-background/40 border-t border-border/20 pt-4">
                  <form
                    action={(fd) => handleUpdate(hotel.id, fd)}
                    className="space-y-4"
                  >
                    <HotelFormFields hotel={hotel} />
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="rounded-none bg-luxury-gold hover:bg-luxury-gold/90 text-white"
                      >
                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        className="rounded-none"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Shared Form Fields ────────────────────────────────────────────────────────
// Used in both the add form and the inline edit form.

function HotelFormFields({ hotel }: { hotel?: Hotel }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Hotel Name */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-[#153E35]">
          Hotel Name <span className="text-luxury-gold">*</span>
        </Label>
        <Input
          name="name"
          defaultValue={hotel?.name}
          placeholder="Banyan Tree Bintan"
          required
          className="rounded-none h-10 bg-background border-border text-[#153E35]"
        />
      </div>

      {/* URL Slug */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-[#153E35]">
          URL Slug <span className="text-luxury-gold">*</span>
        </Label>
        <Input
          name="slug"
          defaultValue={hotel?.slug}
          placeholder="bintan"
          required
          className="rounded-none h-10 bg-background border-border text-[#153E35]"
        />
      </div>

      {/* Logo URL */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-[#153E35]">
          Logo URL
        </Label>
        <Input
          name="logo_url"
          defaultValue={hotel?.logo_url ?? ""}
          placeholder="https://..."
          type="url"
          className="rounded-none h-10 bg-background border-border text-[#153E35]"
        />
      </div>

      {/* Private Session CTA Base */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-[#153E35]">
          Private Session CTA Base
        </Label>
        <Input
          name="private_session_cta_base"
          defaultValue={hotel?.private_session_cta_base ?? ""}
          placeholder="https://wa.me/65..."
          className="rounded-none h-10 bg-background border-border text-[#153E35]"
        />
      </div>
    </div>
  );
}
