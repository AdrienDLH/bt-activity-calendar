"use client";

/**
 * ACTIVITY FORM — Create & Edit
 *
 * Shared form used for both creating and editing activities.
 * Controlled via react-hook-form + Zod validation.
 *
 * MODE:
 * - Create: `activity` prop is undefined — blank form, calls createActivity
 * - Edit:   `activity` prop is provided — pre-filled, calls updateActivity
 *
 * The form serialises data to FormData before calling the server action
 * so that image_urls (array) and tags (array) are handled correctly.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import { createActivity, updateActivity } from "@/app/admin/(dashboard)/activities/actions";
import type { Activity, ActivityType, Hotel } from "@/types/database";

// ── Zod Schema ─────────────────────────────────────────────────────────────
// Mirrors the DB schema. All optional fields are nullable/optional in Zod too.

const activitySchema = z.object({
  hotel_id: z.string().min(1, "Hotel is required"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  type_id: z.string().min(1, "Activity type is required"),
  time_of_day: z.enum(["Rise", "Shine", "Rest", "Revel"]).optional(),
  activity_date: z.string().min(1, "Date is required"),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  location: z.string().optional(),
  practitioner: z.string().optional(),
  equipment: z.string().optional(),
  tags: z.string().optional(), // comma-separated on the form, split on save
  cta_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  published: z.boolean(),
  auto_deactivate_at: z.string().optional(),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

// ── Props ─────────────────────────────────────────────────────────────────

interface ActivityFormProps {
  activity?: Activity;
  activityTypes: ActivityType[];
  hotels: Hotel[];
  defaultHotelId: string;
  isMasterAdmin: boolean;
}

// ── Component ──────────────────────────────────────────────────────────────

export function ActivityForm({
  activity,
  activityTypes,
  hotels,
  defaultHotelId,
  isMasterAdmin,
}: ActivityFormProps) {
  const router = useRouter();
  const isEditing = Boolean(activity);

  // Image URLs are managed outside react-hook-form because they're an array
  const [imageUrls, setImageUrls] = useState<string[]>(activity?.image_urls ?? []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      hotel_id: activity?.hotel_id ?? defaultHotelId,
      title: activity?.title ?? "",
      description: activity?.description ?? "",
      type_id: activity?.type_id ?? "",
      time_of_day: activity?.time_of_day ?? undefined,
      activity_date: activity?.activity_date ?? "",
      start_time: activity?.start_time?.slice(0, 5) ?? "", // strip seconds
      end_time: activity?.end_time?.slice(0, 5) ?? "",
      location: activity?.location ?? "",
      practitioner: activity?.practitioner ?? "",
      equipment: activity?.equipment ?? "",
      tags: activity?.tags?.join(", ") ?? "",
      cta_link: activity?.cta_link ?? "",
      published: activity?.published ?? false,
      auto_deactivate_at: activity?.auto_deactivate_at
        ? activity.auto_deactivate_at.slice(0, 16) // datetime-local format
        : "",
    },
  });

  // Watch published for the Switch component (controlled)
  const published = watch("published");

  // ── Submit Handler ─────────────────────────────────────────────────────

  async function onSubmit(values: ActivityFormValues) {
    // Build FormData — server actions receive FormData
    const fd = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        fd.set(key, String(val));
      }
    });

    // Serialize image URLs as JSON string
    fd.set("image_urls", JSON.stringify(imageUrls));
    fd.set("published", String(values.published));

    let result;
    if (isEditing && activity) {
      result = await updateActivity(activity.id, fd);
    } else {
      result = await createActivity(fd);
    }

    // Server actions return {error} on failure, or redirect on success
    if (result?.error) {
      toast.error(result.error);
    } else {
      // Success toast — the server action handles the redirect
      toast.success(isEditing ? "Activity updated." : "Activity created.");
    }
  }

  // ── Form Section Helper ────────────────────────────────────────────────
  // Consistent section wrapper with a title and optional description
  function Section({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="bg-card border border-border/50 p-6 space-y-5">
        <h2 className="font-reforma-gris text-sm uppercase tracking-wider text-[#153E35] border-b border-border/30 pb-3">
          {title}
        </h2>
        {children}
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* ── Core Details ─────────────────────────────────────────── */}
      <Section title="Core Details">

        {/* Hotel selector — only shown to master_admin with multiple hotels */}
        {isMasterAdmin && hotels.length > 1 && (
          <FormField label="Hotel" error={errors.hotel_id?.message} required>
            <Select
              defaultValue={activity?.hotel_id ?? defaultHotelId}
              onValueChange={(v) => setValue("hotel_id", v)}
            >
              <SelectTrigger className="rounded-none h-11 bg-background border-border">
                <SelectValue placeholder="Select hotel" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {hotels.map((h) => (
                  <SelectItem key={h.id} value={h.id} className="rounded-none">
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        )}

        {/* Title */}
        <FormField label="Title" error={errors.title?.message} required>
          <Input
            {...register("title")}
            placeholder="e.g. Sunrise Yoga on the Beach"
            className="rounded-none h-11 bg-background border-border text-[#153E35]"
          />
        </FormField>

        {/* Description */}
        <FormField label="Description" error={errors.description?.message}>
          <Textarea
            {...register("description")}
            placeholder="Describe the activity for guests..."
            rows={4}
            className="rounded-none bg-background border-border text-[#153E35] resize-none"
          />
        </FormField>

        {/* Type + Time of Day — side by side on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Activity Type" error={errors.type_id?.message} required>
            <Select
              defaultValue={activity?.type_id ?? ""}
              onValueChange={(v) => setValue("type_id", v)}
            >
              <SelectTrigger className="rounded-none h-11 bg-background border-border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {activityTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id} className="rounded-none">
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Time of Day" error={errors.time_of_day?.message}>
            <Select
              defaultValue={activity?.time_of_day ?? ""}
              onValueChange={(v) =>
                setValue("time_of_day", v as ActivityFormValues["time_of_day"])
              }
            >
              <SelectTrigger className="rounded-none h-11 bg-background border-border">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {/* Labels match the app's time-of-day segments */}
                <SelectItem value="Rise" className="rounded-none">Rise (6am–9am)</SelectItem>
                <SelectItem value="Shine" className="rounded-none">Shine (9am–12pm)</SelectItem>
                <SelectItem value="Rest" className="rounded-none">Rest (12pm–5pm)</SelectItem>
                <SelectItem value="Revel" className="rounded-none">Revel (5pm+)</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </Section>

      {/* ── Schedule ─────────────────────────────────────────────── */}
      <Section title="Schedule">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Date" error={errors.activity_date?.message} required>
            <Input
              type="date"
              {...register("activity_date")}
              className="rounded-none h-11 bg-background border-border text-[#153E35]"
            />
          </FormField>

          <FormField label="Start Time" error={errors.start_time?.message}>
            <Input
              type="time"
              {...register("start_time")}
              className="rounded-none h-11 bg-background border-border text-[#153E35]"
            />
          </FormField>

          <FormField label="End Time" error={errors.end_time?.message}>
            <Input
              type="time"
              {...register("end_time")}
              className="rounded-none h-11 bg-background border-border text-[#153E35]"
            />
          </FormField>
        </div>

        {/* Auto-deactivate — optional scheduled unpublish */}
        <FormField
          label="Auto-deactivate at"
          error={errors.auto_deactivate_at?.message}
          hint="Automatically unpublish this activity at the specified date and time."
        >
          <Input
            type="datetime-local"
            {...register("auto_deactivate_at")}
            className="rounded-none h-11 bg-background border-border text-[#153E35]"
          />
        </FormField>
      </Section>

      {/* ── Location & Staff ──────────────────────────────────────── */}
      <Section title="Location & Staff">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Location" error={errors.location?.message}>
            <Input
              {...register("location")}
              placeholder="e.g. Oceanfront Pavilion"
              className="rounded-none h-11 bg-background border-border text-[#153E35]"
            />
          </FormField>

          <FormField label="Practitioner" error={errors.practitioner?.message}>
            <Input
              {...register("practitioner")}
              placeholder="e.g. Chef Marco"
              className="rounded-none h-11 bg-background border-border text-[#153E35]"
            />
          </FormField>
        </div>

        <FormField label="Equipment / What to bring" error={errors.equipment?.message}>
          <Input
            {...register("equipment")}
            placeholder="e.g. Yoga mat provided"
            className="rounded-none h-11 bg-background border-border text-[#153E35]"
          />
        </FormField>
      </Section>

      {/* ── Media ─────────────────────────────────────────────────── */}
      <Section title="Images">
        {/* ImageUploader handles drag-drop uploads to Supabase Storage */}
        <ImageUploader
          value={imageUrls}
          onChange={setImageUrls}
          hotelId={watch("hotel_id") || defaultHotelId}
        />
      </Section>

      {/* ── Tags & CTA ───────────────────────────────────────────── */}
      <Section title="Tags & Link">
        <FormField
          label="Tags"
          error={errors.tags?.message}
          hint="Comma-separated. e.g. yoga, wellness, outdoor"
        >
          <Input
            {...register("tags")}
            placeholder="yoga, morning, beach"
            className="rounded-none h-11 bg-background border-border text-[#153E35]"
          />
        </FormField>

        <FormField
          label="CTA Link"
          error={errors.cta_link?.message}
          hint="Optional booking or info URL."
        >
          <Input
            {...register("cta_link")}
            type="url"
            placeholder="https://..."
            className="rounded-none h-11 bg-background border-border text-[#153E35]"
          />
        </FormField>
      </Section>

      {/* ── Publishing ────────────────────────────────────────────── */}
      <Section title="Publishing">
        {/* Switch component — controlled via watch/setValue */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium text-[#153E35]">
              Published
            </Label>
            <p className="text-xs text-[#153E35]">
              {published
                ? "Visible to guests on the public calendar."
                : "Hidden — save as draft until ready."}
            </p>
          </div>
          <Switch
            checked={published}
            onCheckedChange={(checked) => setValue("published", checked)}
            className="data-[state=checked]:bg-[#173F35]"
          />
        </div>
      </Section>

      {/* ── Form Actions ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/activities")}
          className="rounded-none border-border text-[#153E35]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-none min-w-[140px]"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Create Activity"
          )}
        </Button>
      </div>
    </form>
  );
}

// ── FormField Helper ────────────────────────────────────────────────────────
// Wraps a label + input + error/hint message for consistent layout.

function FormField({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-[#153E35]">
        {label}
        {required && <span className="text-luxury-gold ml-1">*</span>}
      </Label>
      {children}
      {/* Show error if present, otherwise show hint */}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[#153E35]">{hint}</p>
      ) : null}
    </div>
  );
}
