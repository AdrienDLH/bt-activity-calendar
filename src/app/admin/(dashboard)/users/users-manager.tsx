"use client";

/**
 * USERS MANAGER — Client Component
 *
 * Interactive admin UI for user accounts:
 *   - Add a new user (email, full name, role, hotel, temp password)
 *   - Inline edit an existing user (full name, role, hotel)
 *   - Delete a user (with confirmation)
 *   - Reset a user's temp password
 *
 * No invitation emails are sent — see actions.ts for rationale. After
 * creating a user, we surface the temp password once in a dismissible
 * panel so the master admin can share it via Slack/WhatsApp themselves.
 */

import { useState, useTransition, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Plus, Pencil, ChevronUp, Loader2, Users as UsersIcon,
  Trash2, KeyRound, Copy, Check, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { createUser, updateUser, deleteUser, resetUserPassword } from "./actions";
import type { Profile, Hotel } from "@/types/database";

// The join shape fetched server-side — profile + hotel name + auth email
export type UserRow = Profile & {
  email: string | null;
  hotels: Pick<Hotel, "name"> | null;
};

interface UsersManagerProps {
  users: UserRow[];
  hotels: Hotel[];
  currentUserId: string;
}

// Generates a readable temporary password like "Aurora-9274".
// Not cryptographically strong, but fine because the user is forced to
// rotate it immediately via /admin/change-password.
function generateTempPassword() {
  const words = [
    "Banyan", "Aurora", "Solstice", "Lotus", "Ember",
    "Serene", "Summit", "Mirage", "Aegean", "Zephyr",
  ];
  const word = words[Math.floor(Math.random() * words.length)];
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${word}-${digits}`;
}

export function UsersManager({ users, hotels, currentUserId }: UsersManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // The master admin needs to see the temp password exactly once after
  // create/reset so they can share it. We stash it here in component state.
  const [credentialBanner, setCredentialBanner] = useState<{
    email: string;
    password: string;
    mode: "created" | "reset";
  } | null>(null);

  // Delete confirmation state — keyed by user id so the dialog knows who.
  const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);

  // ── Create ──────────────────────────────────────────────────────────────
  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createUser(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      if (result?.success && result.email && result.password) {
        toast.success("User created.");
        setCredentialBanner({
          email: result.email,
          password: result.password,
          mode: "created",
        });
        setShowAddForm(false);
      }
    });
  }

  // ── Update ──────────────────────────────────────────────────────────────
  function handleUpdate(id: string, formData: FormData) {
    startTransition(async () => {
      const result = await updateUser(id, formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("User updated.");
      setEditingId(null);
    });
  }

  // ── Delete ──────────────────────────────────────────────────────────────
  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteUser(id);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("User deleted.");
      setUserToDelete(null);
    });
  }

  // ── Reset temp password ────────────────────────────────────────────────
  function handleReset(id: string, email: string) {
    const password = generateTempPassword();
    const fd = new FormData();
    fd.set("password", password);
    startTransition(async () => {
      const result = await resetUserPassword(id, fd);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Password reset. Share the new temp password.");
      setCredentialBanner({ email, password, mode: "reset" });
    });
  }

  return (
    <div className="space-y-4">

      {/* ── Credential Banner (shown once after create/reset) ─────── */}
      {credentialBanner && (
        <CredentialBanner
          {...credentialBanner}
          onDismiss={() => setCredentialBanner(null)}
        />
      )}

      {/* ── Add User Button / Form ────────────────────────────────── */}
      {!showAddForm ? (
        <Button
          onClick={() => setShowAddForm(true)}
          className="rounded-none bg-luxury-gold hover:bg-luxury-gold/90 text-white"
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      ) : (
        <div className="bg-card border border-border/50 p-5 space-y-4">
          <p className="text-xs uppercase tracking-wider text-[#153E35] font-sans">
            New User
          </p>
          <form action={handleCreate} className="space-y-4">
            <UserFormFields hotels={hotels} mode="create" />
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-none bg-luxury-gold hover:bg-luxury-gold/90 text-white"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create User"}
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

      {/* ── Users List ────────────────────────────────────────────── */}
      <div className="bg-card border border-border/50 divide-y divide-border/20">
        {users.length === 0 ? (
          <div className="p-10 text-center">
            <UsersIcon className="h-8 w-8 text-[#153E35] mx-auto mb-3" />
            <p className="text-sm text-[#153E35]">No users yet.</p>
          </div>
        ) : (
          users.map((u) => {
            const isSelf = u.id === currentUserId;
            const isEditing = editingId === u.id;
            return (
              <div key={u.id}>
                {/* ── User Row ───────────────────────────────── */}
                <div className={`flex items-center justify-between gap-3 px-5 py-4 ${isSelf ? "bg-luxury-gold/5" : ""}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm text-[#153E35] truncate">
                        {u.full_name ?? u.email ?? "—"}
                      </p>
                      {isSelf && (
                        <span className="text-xs text-luxury-gold font-sans">
                          (you)
                        </span>
                      )}
                      <RoleBadge role={u.role} />
                      {u.must_reset_password && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-sans uppercase tracking-wide bg-amber-100 text-amber-900 border border-amber-300">
                          <AlertTriangle className="h-3 w-3" />
                          Pending reset
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#153E35]/80 font-sans mt-0.5 truncate">
                      {u.email ?? "—"}
                      {" · "}
                      {u.hotels?.name ?? (u.role === "master_admin" ? "All Hotels" : "No Hotel")}
                      {" · Updated "}
                      {format(new Date(u.updated_at), "dd MMM yyyy")}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Reset temp password"
                      onClick={() => handleReset(u.id, u.email ?? "")}
                      disabled={isPending || isSelf}
                      className="h-8 w-8 text-[#153E35]"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      <span className="sr-only">Reset password</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete user"
                      onClick={() => setUserToDelete(u)}
                      disabled={isPending || isSelf}
                      className="h-8 w-8 text-[#153E35] hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete {u.email}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title={isEditing ? "Close" : "Edit user"}
                      onClick={() => setEditingId(isEditing ? null : u.id)}
                      className="h-8 w-8 text-[#153E35]"
                    >
                      {isEditing ? <ChevronUp className="h-4 w-4" /> : <Pencil className="h-3.5 w-3.5" />}
                      <span className="sr-only">Edit</span>
                    </Button>
                  </div>
                </div>

                {/* ── Inline Edit Form ───────────────────────── */}
                {isEditing && (
                  <div className="px-5 pb-5 bg-background/40 border-t border-border/20 pt-4">
                    <form
                      action={(fd) => handleUpdate(u.id, fd)}
                      className="space-y-4"
                    >
                      <UserFormFields hotels={hotels} mode="edit" user={u} />
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={isPending}
                          className="rounded-none bg-luxury-gold hover:bg-luxury-gold/90 text-white"
                        >
                          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
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
            );
          })
        )}
      </div>

      {/* ── Delete Confirmation ───────────────────────────────────── */}
      <Dialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Delete user?</DialogTitle>
            <DialogDescription>
              This permanently removes <span className="font-medium">{userToDelete?.email}</span> from
              the system. They will no longer be able to sign in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setUserToDelete(null)}
              disabled={isPending}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={() => userToDelete && handleDelete(userToDelete.id)}
              disabled={isPending}
              className="rounded-none bg-destructive hover:bg-destructive/90 text-white"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Credential Banner ────────────────────────────────────────────────────────
// Shown once after a successful create or reset so the master admin can
// copy the temp password and share it manually.

function CredentialBanner({
  email, password, mode, onDismiss,
}: {
  email: string;
  password: string;
  mode: "created" | "reset";
  onDismiss: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="bg-luxury-gold/10 border border-luxury-gold p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#153E35] font-sans">
            {mode === "created" ? "User created" : "Password reset"}
          </p>
          <p className="text-sm text-[#153E35] mt-1">
            Share the temporary password with <span className="font-medium">{email}</span>.
            They&apos;ll be asked to set a permanent one on first login.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="rounded-none text-[#153E35] shrink-0"
        >
          Dismiss
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-background border border-border p-3">
        <code className="flex-1 font-mono text-sm text-[#153E35] select-all">
          {password}
        </code>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={copy}
          className="rounded-none"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <p className="text-xs text-[#153E35]/70 font-sans">
        This password is shown once. If lost, use the key icon on the user
        row to generate a new one.
      </p>
    </div>
  );
}

// ── Role Badge ──────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: Profile["role"] }) {
  return (
    <span
      className={`
        inline-block px-2 py-0.5 text-[10px] font-sans uppercase tracking-wide
        ${role === "master_admin"
          ? "bg-[#173F35]/10 text-[#173F35]"
          : "bg-luxury-gold/10 text-luxury-brown"
        }
      `}
    >
      {role === "master_admin" ? "Master" : "Property"}
    </span>
  );
}

// ── Shared Form Fields ──────────────────────────────────────────────────────
// Reused by both the create form and the inline edit form. In edit mode
// email is read-only (Supabase treats email changes as a separate flow
// involving confirmation) and password is hidden.

function UserFormFields({
  hotels,
  mode,
  user,
}: {
  hotels: Hotel[];
  mode: "create" | "edit";
  user?: UserRow;
}) {
  // Track role locally so the hotel select can show/hide in real time.
  const [role, setRole] = useState<Profile["role"]>(
    user?.role ?? "property_admin"
  );

  // Generate a default temp password per render of the create form. Only
  // recomputed when the create form mounts, so edits don't shuffle it.
  const defaultTempPassword = useMemo(
    () => (mode === "create" ? generateTempPassword() : ""),
    [mode]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* Email */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-[#153E35]">
          Email <span className="text-luxury-gold">*</span>
        </Label>
        <Input
          name="email"
          type="email"
          required={mode === "create"}
          disabled={mode === "edit"}
          defaultValue={user?.email ?? ""}
          placeholder="name@banyantree.com"
          className="rounded-none h-10 bg-background border-border text-[#153E35] disabled:opacity-60"
        />
      </div>

      {/* Full name */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-[#153E35]">
          Full Name
        </Label>
        <Input
          name="full_name"
          defaultValue={user?.full_name ?? ""}
          placeholder="Jane Doe"
          className="rounded-none h-10 bg-background border-border text-[#153E35]"
        />
      </div>

      {/* Role — native select keeps FormData flow simple */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-[#153E35]">
          Role <span className="text-luxury-gold">*</span>
        </Label>
        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value as Profile["role"])}
          className="w-full rounded-none h-10 bg-background border border-border text-[#153E35] px-3 text-sm"
        >
          <option value="property_admin">Property Admin</option>
          <option value="master_admin">Master Admin</option>
        </select>
      </div>

      {/* Hotel — only meaningful for property_admin */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-[#153E35]">
          Hotel {role === "property_admin" && <span className="text-luxury-gold">*</span>}
        </Label>
        <select
          name="hotel_id"
          disabled={role === "master_admin"}
          defaultValue={user?.hotel_id ?? ""}
          className="w-full rounded-none h-10 bg-background border border-border text-[#153E35] px-3 text-sm disabled:opacity-60"
        >
          <option value="">
            {role === "master_admin" ? "— All hotels —" : "Select a hotel…"}
          </option>
          {hotels.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>

      {/* Temporary password — only on create */}
      {mode === "create" && (
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs uppercase tracking-wider text-[#153E35]">
            Temporary Password <span className="text-luxury-gold">*</span>
          </Label>
          <Input
            name="password"
            required
            minLength={8}
            defaultValue={defaultTempPassword}
            className="rounded-none h-10 bg-background border-border text-[#153E35] font-mono"
          />
          <p className="text-xs text-[#153E35]/70 font-sans">
            Auto-generated. Feel free to replace it — the user will be asked
            to set a permanent password on first login.
          </p>
        </div>
      )}
    </div>
  );
}
