/**
 * PRIVATE SESSION MODAL COMPONENT
 *
 * Form modal for requesting private sessions.
 * Generates a pre-filled WhatsApp/mailto link.
 *
 * Features:
 * - Activity type selection
 * - Date range picker (simplified)
 * - Time-of-day preference
 * - Participants count
 * - Notes field
 * - WhatsApp/email link generation
 *
 * CUSTOMIZATION:
 * - Form fields can be modified as needed
 * - Link generation logic in handleSubmit
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Calendar, Users, MessageSquare } from "lucide-react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ActivityType, TimeOfDay, Hotel } from "@/types/database";

interface PrivateSessionModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Hotel data for CTA link generation */
  hotel: Hotel;
  /** Available activity types for selection */
  activityTypes: ActivityType[];
}

/**
 * TIME_OF_DAY_OPTIONS
 *
 * Options for time-of-day preference selection.
 */
const TIME_OF_DAY_OPTIONS: { value: TimeOfDay; label: string }[] = [
  { value: "Rise", label: "Rise · Early Morning (6-9am)" },
  { value: "Shine", label: "Shine · Morning (9am-12pm)" },
  { value: "Rest", label: "Rest · Afternoon (12-5pm)" },
  { value: "Revel", label: "Glow · Evening (5pm onwards)" },
];

/**
 * PrivateSessionModal
 *
 * Renders a form modal for private session requests.
 * On submit, generates and opens a WhatsApp/mailto link.
 */
export function PrivateSessionModal({
  isOpen,
  onClose,
  hotel,
  activityTypes,
}: PrivateSessionModalProps) {
  // Form state
  const [activityType, setActivityType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(addDays(new Date(), 7), "yyyy-MM-dd")
  );
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | "">("");
  const [participants, setParticipants] = useState<string>("2");
  const [notes, setNotes] = useState<string>("");

  /**
   * Handle form submission
   *
   * Generates a pre-filled message and opens the CTA link.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get activity type name
    const activityTypeName =
      activityTypes.find((t) => t.id === activityType)?.name || "Private Session";

    // Build message
    const message = [
      `🌿 Private Session Request - ${hotel.name}`,
      ``,
      `Activity Type: ${activityTypeName}`,
      `Preferred Dates: ${format(new Date(startDate), "MMM d")} - ${format(new Date(endDate), "MMM d, yyyy")}`,
      timeOfDay ? `Time of Day: ${timeOfDay}` : null,
      `Number of Participants: ${participants}`,
      notes ? `\nAdditional Notes:\n${notes}` : null,
      ``,
      `Please let me know availability and pricing.`,
    ]
      .filter(Boolean)
      .join("\n");

    // Generate CTA link
    if (hotel.private_session_cta_base) {
      const encodedMessage = encodeURIComponent(message);
      const ctaLink = `${hotel.private_session_cta_base}${encodedMessage}`;

      // Open the link
      window.open(ctaLink, "_blank");

      // Show success toast
      toast.success("Request sent!", {
        description: "We'll get back to you shortly.",
      });

      // Close modal and reset form
      onClose();
      resetForm();
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(message);
      toast.success("Message copied!", {
        description: "Paste it in your preferred messaging app.",
      });
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setActivityType("");
    setStartDate(format(addDays(new Date(), 1), "yyyy-MM-dd"));
    setEndDate(format(addDays(new Date(), 7), "yyyy-MM-dd"));
    setTimeOfDay("");
    setParticipants("2");
    setNotes("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50",
              "md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
              "md:max-w-lg md:w-full md:mx-4",
              "bg-card rounded-none md:rounded-none",
              "max-h-[90vh] overflow-hidden flex flex-col"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-semibold text-[#153E35]">
                Request Private Session
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-none"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {/* Activity Type */}
              <div className="space-y-2">
                <Label htmlFor="activity-type">Activity Type</Label>
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger id="activity-type">
                    <SelectValue placeholder="Select an activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other / Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    From
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">To</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>
              </div>

              {/* Time of Day */}
              <div className="space-y-2">
                <Label htmlFor="time-of-day">Preferred Time of Day</Label>
                <Select
                  value={timeOfDay}
                  onValueChange={(v) => setTimeOfDay(v as TimeOfDay)}
                >
                  <SelectTrigger id="time-of-day">
                    <SelectValue placeholder="Select preferred time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OF_DAY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Participants */}
              <div className="space-y-2">
                <Label htmlFor="participants">
                  <Users className="inline h-4 w-4 mr-1" />
                  Number of Participants
                </Label>
                <Input
                  id="participants"
                  type="number"
                  min="1"
                  max="20"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">
                  <MessageSquare className="inline h-4 w-4 mr-1" />
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requests or requirements..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </form>

            {/* Footer with Submit */}
            <div className="p-4 border-t border-border bg-card pb-safe">
              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-full h-12 text-base"
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Request
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
