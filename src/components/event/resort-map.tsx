"use client";

/**
 * RESORT MAP
 *
 * Renders the resort map illustration plus two recreated legends, shown in a
 * compact tabbed layout (Banyan Tree / Angsana) using the shared Tabs
 * component. Each tab's entries are laid out in a responsive grid (not a long
 * list) to save vertical space. Legend numbers correspond to the markers
 * drawn on the map artwork. Chinese labels use the FZKai typeface (font-kai).
 *
 * The map image is tappable — it opens a full-screen zoom overlay (the larger
 * artwork) so the small on-map labels can be read on any device. The backdrop
 * uses the SAME neutral black scrim as the Interactive Calendar's activity
 * modal (bg-black/60) — never a coloured tint.
 */
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IconX, IconZoomIn } from "@tabler/icons-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RESORT_MAP as M, type MapLegend } from "@/lib/event-data";

/**
 * Brand colours taken from the original map's two coloured legend panels:
 * Banyan Tree = forest green, Angsana = burnt orange. These intentionally
 * step outside the site's bronze/forest palette so the numbered pills match
 * the map artwork's own colour-coding.
 */
const BRAND_COLORS: Record<string, string> = {
  "Banyan Tree": "#0E5A2A",
  Angsana: "#B45309",
};

export function ResortMap() {
  const [zoomed, setZoomed] = useState(false);

  // Close the zoom overlay on Escape; lock body scroll while it's open.
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoomed(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoomed]);

  return (
    <div>
      {/* ---- Map artwork (tap to zoom) ---- */}
      <button
        type="button"
        onClick={() => setZoomed(true)}
        className="group relative block w-full overflow-hidden rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#85754E] focus-visible:ring-offset-2"
        aria-label="Enlarge resort map"
      >
        <Image
          src={M.art}
          alt="Illustrated map of the resort showing Banyan Tree and Angsana venues"
          width={1400}
          height={987}
          sizes="(max-width: 768px) 100vw, 672px"
          className="h-auto w-full"
        />
        {/* Zoom affordance — small bronze chip, bottom-right */}
        <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-[2px] bg-[#85754E] px-2 py-1 text-xs font-semibold uppercase leading-none tracking-[0.1em] text-[#EAE7E4] opacity-90 transition-opacity group-hover:opacity-100">
          <IconZoomIn className="h-3.5 w-3.5" stroke={2} aria-hidden />
          Tap to zoom
        </span>
      </button>

      {/* ---- Recreated legends — tabbed (compact) ---- */}
      <Tabs defaultValue={M.legends[0].brand} className="mt-6 block">
        <div className="flex justify-center">
          <TabsList className="grid-cols-2">
            {M.legends.map((l) => (
              <TabsTrigger key={l.brand} value={l.brand}>
                {l.brand}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {/* Relative wrapper so the OUTGOING panel can be absolutely positioned
            while it fades out — keeping it out of the layout flow prevents the
            container from briefly ballooning to fit both panels on tab switch. */}
        <div className="relative mt-4">
          {M.legends.map((l) => (
            <TabsContent
              key={l.brand}
              value={l.brand}
              className="mt-0 data-[state=inactive]:pointer-events-none data-[state=inactive]:absolute data-[state=inactive]:inset-x-0 data-[state=inactive]:top-0"
            >
              <LegendGrid legend={l} accent={BRAND_COLORS[l.brand] ?? "#85754E"} />
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {/* ---- Zoom overlay ---- */}
      <AnimatePresence>
        {zoomed && (
          <>
            {/* Neutral black scrim — matches the calendar's activity modal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setZoomed(false)}
              className="fixed inset-0 z-50 bg-black/60"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setZoomed(false)}
              role="dialog"
              aria-modal="true"
              aria-label="Resort map (enlarged)"
            >
              <button
                type="button"
                onClick={() => setZoomed(false)}
                className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-[2px] bg-black/30 text-white transition-colors hover:bg-black/50"
                aria-label="Close enlarged map"
              >
                <IconX stroke={2} aria-hidden />
              </button>
              {/* Stop propagation so tapping the image itself doesn't close it */}
              <div className="max-h-full max-w-full overflow-auto" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={M.artLarge}
                  alt="Illustrated map of the resort, enlarged"
                  width={2600}
                  height={1833}
                  className="h-auto w-auto max-w-none rounded-[2px]"
                  style={{ maxHeight: "85vh" }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---- A brand legend laid out as a compact grid ---- */
function LegendGrid({ legend, accent }: { legend: MapLegend; accent: string }) {
  return (
    <ol className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3">
      {legend.items.map((item, i) => (
        <li key={item.en} className="flex items-start gap-2">
          <span
            className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold leading-none text-white"
            style={{ backgroundColor: accent }}
          >
            {i + 1}
          </span>
          <span className="leading-tight">
            <span className="block font-kai text-sm leading-snug text-[#153E35]">{item.zh}</span>
            <span className="block text-[13px] leading-tight text-[#153E35]/60">{item.en}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
