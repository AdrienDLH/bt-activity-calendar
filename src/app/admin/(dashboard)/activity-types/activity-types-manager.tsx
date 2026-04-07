"use client";

/**
 * ACTIVITY TYPES MANAGER — Client Component
 *
 * Inline add form + delete per row.
 * All mutations call the server actions in ./actions.ts.
 */

import { useState, useTransition, useRef } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Tag, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createActivityType, deleteActivityType } from "./actions";
import type { ActivityType } from "@/types/database";

interface ActivityTypesManagerProps {
  types: ActivityType[];
}

export function ActivityTypesManager({ types }: ActivityTypesManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // confirmDeleteId tracks which row is showing the inline confirm buttons.
  // Replaces window.confirm() which blocks browser events.
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // ── Create ──────────────────────────────────────────────────────────────
  function handleCreate(formData: FormData) {
    // React form actions bypass browser native validation tooltips, so we
    // check client-side first to give a clear toast instead of a silent no-op.
    const name = (formData.get("name") as string)?.trim();
    if (!name) {
      toast.error("Name is required.");
      return;
    }
    startTransition(async () => {
      const result = await createActivityType(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Activity type created.");
        formRef.current?.reset();
      }
    });
  }

  // ── Delete ──────────────────────────────────────────────────────────────
  // Two-step: click trash → inline confirm row appears → click Confirm to delete.
  // Avoids window.confirm() which blocks all browser events.
  function handleDeleteConfirm(id: string, name: string) {
    setConfirmDeleteId(null);
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteActivityType(id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`"${name}" deleted.`);
      }
      setDeletingId(null);
    });
  }

  return (
    <div className="space-y-4">

      {/* ── Inline Add Form ────────────────────────────────────── */}
      <div className="bg-card border border-border/50 p-5">
        <p className="text-xs uppercase tracking-wider text-[#153E35] mb-3 font-sans">
          Add New Type
        </p>
        <form ref={formRef} action={handleCreate} className="flex gap-2">
          <Input
            name="name"
            placeholder="e.g. Yoga, Excursion, Spa..."
            required
            className="rounded-none h-10 bg-background border-border text-[#153E35] flex-1"
          />
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-none h-10 bg-luxury-gold hover:bg-luxury-gold/90 text-white shrink-0"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add
          </Button>
        </form>
      </div>

      {/* ── Types List ─────────────────────────────────────────── */}
      <div className="bg-card border border-border/50">
        {types.length === 0 ? (
          <div className="p-10 text-center">
            <Tag className="h-8 w-8 text-[#153E35] mx-auto mb-3" />
            <p className="text-sm text-[#153E35]">No activity types yet.</p>
          </div>
        ) : (
          <>
            {types.map((type, i) => (
              <div
                key={type.id}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i < types.length - 1 ? "border-b border-border/20" : ""
                } ${deletingId === type.id ? "opacity-50" : ""}`}
              >
                {/* Type name + badge */}
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-luxury-gold" />
                  <span className="text-sm font-medium text-[#153E35]">
                    {type.name}
                  </span>
                </div>

                {/* Delete — two-step inline confirm to avoid window.confirm() */}
                {confirmDeleteId === type.id ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-destructive mr-1 font-sans">Delete?</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteConfirm(type.id, type.name)}
                      disabled={isPending}
                      className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span className="sr-only">Confirm delete {type.name}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setConfirmDeleteId(null)}
                      className="h-7 w-7 text-[#153E35] hover:text-[#153E35]"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span className="sr-only">Cancel delete</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setConfirmDeleteId(type.id)}
                    disabled={isPending || deletingId === type.id}
                    className="h-8 w-8 text-[#153E35] hover:text-destructive"
                  >
                    {deletingId === type.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    <span className="sr-only">Delete {type.name}</span>
                  </Button>
                )}
              </div>
            ))}

            {/* Row count footer */}
            <div className="px-5 py-3 border-t border-border/20 text-xs text-[#153E35] font-sans">
              {types.length} types
            </div>
          </>
        )}
      </div>
    </div>
  );
}
