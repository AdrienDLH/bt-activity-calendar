"use client";

/**
 * DEMO — Guest Itinerary Builder
 *
 * Standalone showcase page for the Banyan Tree workshop.
 * Uses project brand colours/fonts. Mobile-first layout.
 * ⚠️  DELETE THIS PAGE after the workshop.
 */

import { useState } from "react";
import {
  MapPin, Users, Calendar, Leaf, Pencil, Plus, Share2,
  Clock, UtensilsCrossed, Waves, Dumbbell, BookOpen,
  Wind, Sparkles, X, BedDouble, LogOut, ChevronRight,
  Check, Copy,
} from "lucide-react";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

type Category = "spa" | "dining" | "tour" | "workshop" | "wellness" | "arrival" | "departure";

interface Experience {
  id: string;
  time: string;
  title: string;
  subtitle?: string;
  category: Category;
  duration?: string;
  location?: string;
  sustainability?: string;
}

interface ItineraryDay {
  date: string;       // e.g. "Saturday, 5 April"
  dayNum: number;     // 1-based day number relative to check-in
  experiences: Experience[];
}

// ── Hardcoded Demo Data ────────────────────────────────────────────────────────

const STAY = {
  property: "Banyan Tree Bintan",
  location: "Lagoi Bay, Bintan Island, Indonesia",
  checkIn: "Saturday, 5 April 2026",
  checkOut: "Tuesday, 8 April 2026",
  nights: 3,
  guests: "2 Adults",
  room: "Garden Pool Villa",
  confirmation: "BT-2026-04821",
};

const DAYS: ItineraryDay[] = [
  {
    date: "Saturday, 5 April",
    dayNum: 1,
    experiences: [
      {
        id: "1",
        time: "14:00",
        title: "Arrival & Check-in",
        subtitle: "Garden Pool Villa — Level 2, East Wing",
        category: "arrival",
        location: "Main Reception",
      },
      {
        id: "2",
        time: "15:30",
        title: "Welcome Property Walk",
        subtitle: "Guided orientation with your host",
        category: "tour",
        duration: "45 min",
        location: "Lobby",
        sustainability:
          "Your guide shares Bintan's conservation story and points out rewilded wildlife corridors across the estate.",
      },
      {
        id: "3",
        time: "18:30",
        title: "Sunset Cocktails",
        subtitle: "Treetops Bar & Lounge",
        category: "dining",
        duration: "90 min",
        location: "Treetops, Level 5",
      },
      {
        id: "4",
        time: "20:00",
        title: "Dinner at Saffron",
        subtitle: "Thai tasting menu — Chef's selection",
        category: "dining",
        duration: "2 hrs",
        location: "Saffron Restaurant",
        sustainability:
          "90% of produce is sourced from local Bintan farmers and our on-site herb garden — reducing food miles by over 1,400 km.",
      },
    ],
  },
  {
    date: "Sunday, 6 April",
    dayNum: 2,
    experiences: [
      {
        id: "5",
        time: "07:00",
        title: "Sunrise Beach Yoga",
        subtitle: "Flow & Breathwork · All levels welcome",
        category: "wellness",
        duration: "60 min",
        location: "Beachfront Pavilion",
        sustainability:
          "Each session ends with a 15-minute shoreline cleanup. Gloves and biodegradable bags provided.",
      },
      {
        id: "6",
        time: "09:00",
        title: "Breakfast at Cinnamon",
        subtitle: "À la carte or full buffet",
        category: "dining",
        duration: "Open seating",
        location: "Cinnamon Restaurant",
      },
      {
        id: "7",
        time: "11:00",
        title: "Mangrove Kayaking",
        subtitle: "Guided eco-tour · Max 8 guests",
        category: "tour",
        duration: "2.5 hrs",
        location: "South Jetty",
        sustainability:
          "Each booking directly funds 5 mangrove saplings planted in Bintan's coastal restoration belt.",
      },
      {
        id: "8",
        time: "14:30",
        title: "Rainforest Ritual",
        subtitle: "Banyan Tree Spa — 90 min signature treatment",
        category: "spa",
        duration: "90 min",
        location: "The Sanctuary Spa",
        sustainability:
          "Treatment uses wild-harvested Bintan botanicals. Zero single-use plastics. Towels are organic-cotton, locally woven.",
      },
      {
        id: "9",
        time: "19:30",
        title: "Private Beach Dinner",
        subtitle: "5-course set menu for 2",
        category: "dining",
        duration: "2.5 hrs",
        location: "Tanjong Beach",
      },
    ],
  },
  {
    date: "Monday, 7 April",
    dayNum: 3,
    experiences: [
      {
        id: "10",
        time: "08:30",
        title: "Batik Making Workshop",
        subtitle: "Traditional Malay textile art with local artisans",
        category: "workshop",
        duration: "2 hrs",
        location: "Arts Studio",
        sustainability:
          "Artisan-led session supports the Bintan Craft Cooperative. Only natural indigo and plant-based dyes are used.",
      },
      {
        id: "11",
        time: "11:00",
        title: "Coral Snorkelling Tour",
        subtitle: "Marine biodiversity · Certified guide",
        category: "tour",
        duration: "90 min",
        location: "Coral Bay, North Shore",
        sustainability:
          "Reef-safe sunscreen required (provided). 10% of tour fees go directly to the Coral Triangle Initiative.",
      },
      {
        id: "12",
        time: "15:00",
        title: "Deep Tissue Massage",
        subtitle: "Banyan Tree Spa",
        category: "spa",
        duration: "60 min",
        location: "The Sanctuary Spa",
      },
      {
        id: "13",
        time: "17:30",
        title: "Tropical Mixology Workshop",
        subtitle: "Cocktail crafting with the bar team",
        category: "workshop",
        duration: "75 min",
        location: "Treetops Bar",
        sustainability:
          "All spirits are locally distilled on Bintan. Fresh fruit and herbs are harvested from our kitchen garden.",
      },
      {
        id: "14",
        time: "20:00",
        title: "Chef's Table",
        subtitle: "7-course tasting with sommelier wine pairing",
        category: "dining",
        duration: "3 hrs",
        location: "Private Dining Room",
      },
    ],
  },
  {
    date: "Tuesday, 8 April",
    dayNum: 4,
    experiences: [
      {
        id: "15",
        time: "08:00",
        title: "Farewell Breakfast",
        subtitle: "Full buffet on the rooftop terrace",
        category: "dining",
        duration: "Open until 10:30",
        location: "Cinnamon Rooftop",
      },
      {
        id: "16",
        time: "11:00",
        title: "Departure Transfer",
        subtitle: "Private car to Bintan Ferry Terminal",
        category: "departure",
        duration: "30 min",
        location: "Main Entrance",
      },
    ],
  },
];

// ── Category Config ────────────────────────────────────────────────────────────

const CAT: Record<
  Category,
  { label: string; textColor: string; bgColor: string; Icon: React.ElementType }
> = {
  spa:       { label: "Spa",       textColor: "text-purple-700", bgColor: "bg-purple-50",       Icon: Sparkles },
  dining:    { label: "Dining",    textColor: "text-amber-700",  bgColor: "bg-amber-50",        Icon: UtensilsCrossed },
  tour:      { label: "Tour",      textColor: "text-blue-700",   bgColor: "bg-blue-50",         Icon: Waves },
  workshop:  { label: "Workshop",  textColor: "text-orange-700", bgColor: "bg-orange-50",       Icon: BookOpen },
  wellness:  { label: "Wellness",  textColor: "text-teal-700",   bgColor: "bg-teal-50",         Icon: Wind },
  arrival:   { label: "Arrival",   textColor: "text-[#173F35]",  bgColor: "bg-[#173F35]/10",    Icon: BedDouble },
  departure: { label: "Departure", textColor: "text-[#153E35]", bgColor: "bg-[#153E35]/8", Icon: LogOut },
};

// ── Edit / Add Modal ───────────────────────────────────────────────────────────

function ExperienceModal({
  mode,
  experience,
  onClose,
}: {
  mode: "edit" | "add";
  experience?: Experience;
  onClose: () => void;
}) {
  const isEdit = mode === "edit";

  function handleSave() {
    toast.success(isEdit ? "Experience updated." : "Experience added.");
    onClose();
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end"
      onClick={onClose}
    >
      {/* Sheet */}
      <div
        className="w-full bg-white rounded-t-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#153E35]/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-[#153E35]/10">
          <h2 className="font-reforma-negra text-base uppercase tracking-[0.15em] text-[#153E35]">
            {isEdit ? "Edit Experience" : "Add Experience"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-[#153E35]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form body */}
        <div className="px-5 py-5 space-y-4">
          {/* Category chips */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#153E35] font-sans mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {(["spa", "dining", "tour", "workshop", "wellness"] as Category[]).map((cat) => {
                const c = CAT[cat];
                const isActive = experience?.category === cat;
                return (
                  <span
                    key={cat}
                    className={`px-3 py-1 text-xs font-sans uppercase tracking-wide ${c.bgColor} ${c.textColor} ${isActive ? "ring-1 ring-current" : ""}`}
                  >
                    {c.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#153E35] font-sans mb-1.5">Experience</p>
            <input
              defaultValue={experience?.title}
              placeholder="e.g. Sunrise Yoga"
              className="w-full h-10 border border-[#153E35]/20 px-3 text-sm text-[#153E35] bg-[#FFFFFF] outline-none focus:border-luxury-gold font-sans"
            />
          </div>

          {/* Time + Duration row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#153E35] font-sans mb-1.5">Time</p>
              <input
                defaultValue={experience?.time}
                placeholder="09:00"
                className="w-full h-10 border border-[#153E35]/20 px-3 text-sm text-[#153E35] bg-[#FFFFFF] outline-none focus:border-luxury-gold font-sans"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#153E35] font-sans mb-1.5">Duration</p>
              <input
                defaultValue={experience?.duration}
                placeholder="60 min"
                className="w-full h-10 border border-[#153E35]/20 px-3 text-sm text-[#153E35] bg-[#FFFFFF] outline-none focus:border-luxury-gold font-sans"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#153E35] font-sans mb-1.5">Location</p>
            <input
              defaultValue={experience?.location}
              placeholder="e.g. Beachfront Pavilion"
              className="w-full h-10 border border-[#153E35]/20 px-3 text-sm text-[#153E35] bg-[#FFFFFF] outline-none focus:border-luxury-gold font-sans"
            />
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#153E35] font-sans mb-1.5">Notes</p>
            <textarea
              defaultValue={experience?.subtitle}
              placeholder="Special requests, dietary requirements…"
              rows={2}
              className="w-full border border-[#153E35]/20 px-3 py-2.5 text-sm text-[#153E35] bg-[#FFFFFF] outline-none focus:border-luxury-gold font-sans resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-8 pt-1 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 border border-[#153E35]/20 text-sm text-[#153E35] font-sans uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 h-11 bg-luxury-gold text-white text-sm font-sans uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Check className="h-3.5 w-3.5" />
            {isEdit ? "Save Changes" : "Add to Itinerary"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Experience Card ────────────────────────────────────────────────────────────

function ExperienceCard({
  exp,
  onEdit,
}: {
  exp: Experience;
  onEdit: (exp: Experience) => void;
}) {
  const c = CAT[exp.category];
  const CatIcon = c.Icon;

  return (
    <div className="bg-white border border-[#153E35]/8 overflow-hidden">
      {/* Time + category row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          {/* Time badge */}
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-luxury-gold" />
            <span className="font-reforma-gris text-sm text-[#153E35]">{exp.time}</span>
          </div>
          {/* Category chip */}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-sans uppercase tracking-wide ${c.bgColor} ${c.textColor}`}>
            <CatIcon className="h-2.5 w-2.5" />
            {c.label}
          </span>
        </div>

        {/* Edit button — not shown for arrival/departure */}
        {exp.category !== "arrival" && exp.category !== "departure" && (
          <button
            onClick={() => onEdit(exp)}
            className="w-7 h-7 flex items-center justify-center text-[#153E35] hover:text-luxury-gold transition-colors"
            aria-label={`Edit ${exp.title}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Title + subtitle */}
      <div className="px-4 pb-3">
        <p className="font-reforma-gris text-[#153E35] text-base leading-snug">{exp.title}</p>
        {exp.subtitle && (
          <p className="text-xs text-[#153E35] font-sans mt-0.5">{exp.subtitle}</p>
        )}
      </div>

      {/* Location + duration row */}
      {(exp.location || exp.duration) && (
        <div className="flex items-center gap-4 px-4 pb-3">
          {exp.location && (
            <span className="flex items-center gap-1 text-xs text-[#153E35] font-sans">
              <MapPin className="h-3 w-3" />
              {exp.location}
            </span>
          )}
          {exp.duration && (
            <span className="flex items-center gap-1 text-xs text-[#153E35] font-sans">
              <Clock className="h-3 w-3" />
              {exp.duration}
            </span>
          )}
        </div>
      )}

      {/* Sustainability badge */}
      {exp.sustainability && (
        <div className="mx-4 mb-4 bg-[#173F35]/6 border-l-2 border-[#173F35] px-3 py-2.5 flex gap-2.5">
          <Leaf className="h-3.5 w-3.5 text-[#173F35] shrink-0 mt-0.5" />
          <p className="text-xs text-[#173F35] font-sans leading-relaxed">
            {exp.sustainability}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Add Experience Button ──────────────────────────────────────────────────────

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-11 border border-dashed border-luxury-gold/50 text-luxury-gold flex items-center justify-center gap-2 text-xs font-sans uppercase tracking-widest hover:bg-luxury-gold/5 transition-colors"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function ItineraryDemoPage() {
  const [modal, setModal] = useState<{ mode: "edit" | "add"; experience?: Experience } | null>(null);

  // Share handler — Web Share API on mobile, clipboard fallback on desktop
  async function handleShare() {
    const shareData = {
      title: `${STAY.property} — Your Itinerary`,
      text: `Your personalised stay itinerary for ${STAY.checkIn} – ${STAY.checkOut}`,
      url: window.location.href,
    };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
      } catch {
        // User dismissed the sheet — no need to show an error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard.");
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">

      {/* ── Sticky Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#153E35] text-white px-5 py-3.5 flex items-center justify-between">
        <p className="font-reforma-negra text-sm uppercase tracking-[0.15em]">
          My Itinerary
        </p>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 bg-luxury-gold px-3 h-8 text-white text-xs font-sans uppercase tracking-wider"
        >
          <Share2 className="h-3 w-3" />
          Share
        </button>
      </header>

      <div className="px-4 py-5 space-y-5 max-w-md mx-auto">

        {/* ── Stay Details Card ──────────────────────────────────────── */}
        <div className="bg-[#153E35] text-white overflow-hidden">
          {/* Gold accent bar */}
          <div className="h-1 bg-luxury-gold w-full" />

          <div className="p-5">
            {/* Property name */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-sans mb-1">
                Your Stay
              </p>
              <h1 className="font-reforma-negra text-xl uppercase tracking-[0.1em]">
                {STAY.property}
              </h1>
              <p className="flex items-center gap-1 text-xs text-white/50 font-sans mt-1">
                <MapPin className="h-3 w-3" />
                {STAY.location}
              </p>
            </div>

            {/* Stay details grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/6 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-sans mb-0.5 flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" /> Check-in
                </p>
                <p className="text-sm font-reforma-gris">{STAY.checkIn}</p>
              </div>
              <div className="bg-white/6 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-sans mb-0.5 flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" /> Check-out
                </p>
                <p className="text-sm font-reforma-gris">{STAY.checkOut}</p>
              </div>
              <div className="bg-white/6 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-sans mb-0.5 flex items-center gap-1">
                  <BedDouble className="h-2.5 w-2.5" /> Room
                </p>
                <p className="text-sm font-reforma-gris">{STAY.room}</p>
              </div>
              <div className="bg-white/6 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-sans mb-0.5 flex items-center gap-1">
                  <Users className="h-2.5 w-2.5" /> Guests
                </p>
                <p className="text-sm font-reforma-gris">{STAY.guests}</p>
              </div>
            </div>

            {/* Confirmation */}
            <p className="mt-3 text-[10px] text-white/30 font-sans uppercase tracking-wider">
              Confirmation #{STAY.confirmation} · {STAY.nights} nights
            </p>
          </div>
        </div>

        {/* ── Day Sections ───────────────────────────────────────────── */}
        {DAYS.map((day) => (
          <div key={day.date} className="space-y-3">

            {/* Day header */}
            <div className="flex items-center gap-3">
              {/* Day number badge */}
              <div className="w-8 h-8 bg-luxury-gold flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-reforma-negra leading-none">
                  {day.dayNum}
                </span>
              </div>
              <div>
                <p className="font-reforma-gris text-[#153E35] text-sm leading-tight">{day.date}</p>
                {day.dayNum === 1 && (
                  <p className="text-[10px] text-[#153E35] font-sans uppercase tracking-wider">
                    Arrival Day
                  </p>
                )}
                {day.dayNum === DAYS.length && (
                  <p className="text-[10px] text-[#153E35] font-sans uppercase tracking-wider">
                    Departure Day
                  </p>
                )}
              </div>
            </div>

            {/* Experience cards */}
            <div className="space-y-2 pl-11">
              {day.experiences.map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  exp={exp}
                  onEdit={(e) => setModal({ mode: "edit", experience: e })}
                />
              ))}

              {/* Add experience button (not shown on departure day) */}
              {day.dayNum !== DAYS.length && (
                <AddButton
                  label="Add an experience"
                  onClick={() => setModal({ mode: "add" })}
                />
              )}
            </div>
          </div>
        ))}

        {/* ── Add Experience (bottom of full itinerary) ──────────────── */}
        <AddButton
          label="Add experience to any day"
          onClick={() => setModal({ mode: "add" })}
        />

        {/* ── Sustainability Summary ─────────────────────────────────── */}
        <div className="bg-[#173F35] text-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="h-4 w-4 text-luxury-gold" />
            <p className="font-reforma-negra text-xs uppercase tracking-[0.15em]">
              Your Sustainability Impact
            </p>
          </div>
          <p className="text-sm text-white/70 font-sans leading-relaxed">
            Your itinerary includes{" "}
            <span className="text-white font-semibold">
              {DAYS.flatMap((d) => d.experiences).filter((e) => e.sustainability).length} sustainable experiences
            </span>{" "}
            supporting mangrove restoration, local artisan communities, reef conservation, and zero-waste dining.
          </p>
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
            {[
              { value: "5", label: "Mangroves planted" },
              { value: "3", label: "Local producers" },
              { value: "0", label: "Single-use plastics" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-reforma-negra text-luxury-gold text-lg">{stat.value}</p>
                <p className="text-[10px] text-white/50 font-sans uppercase tracking-wide leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Share CTA ─────────────────────────────────────────────── */}
        <button
          onClick={handleShare}
          className="w-full h-12 bg-luxury-gold text-white font-sans uppercase tracking-widest text-xs flex items-center justify-center gap-2"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share My Itinerary
        </button>

        {/* Bottom spacing for safe area */}
        <div className="h-6" />
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────── */}
      {modal && (
        <ExperienceModal
          mode={modal.mode}
          experience={modal.experience}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
