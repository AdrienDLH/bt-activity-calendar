/**
 * TIME & PLACE — /aws/time-place
 *
 * Welcome message + a responsive "General Information" panel. On mobile the
 * info items stack; on sm+ they flow into two readable columns.
 */
import { EventShell } from "@/components/event/event-shell";
import { TIME_AND_PLACE as T } from "@/lib/event-data";

export default function TimePlacePage() {
  return (
    <EventShell backHref="/aws" contentClassName="max-w-2xl">
      {/* ---- Welcome ---- */}
      <section className="text-center">
        <p className="font-reforma-negra text-xs uppercase tracking-[0.15em] text-luxury-gold sm:text-sm">
          {T.welcomeKicker}
        </p>
        <h1 className="mt-2 font-reforma-negra text-xl uppercase tracking-[0.15em] text-[#153E35] sm:text-2xl">
          {T.welcomeTitle}
        </h1>
        <div className="mx-auto mt-6 max-w-xl space-y-4 text-sm leading-relaxed text-[#153E35]/90 sm:text-base">
          {T.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* ---- General Information panel ----
          Card surface mirrors the ActivityCard: bg-card, rounded-[2px], no
          border/shadow. Item titles use Reforma Gris (semibold) like the
          calendar's section headings. */}
      <section className="mt-10 rounded-[2px] bg-card p-6 sm:mt-12 sm:p-8">
        <h2 className="text-center font-reforma-negra text-sm uppercase tracking-[0.15em] text-[#153E35]">
          General Information
        </h2>

        {/* About — full width */}
        <div className="mt-6 border-b border-[#85754E]/15 pb-6">
          <h3 className="font-reforma-gris text-lg font-semibold tracking-[0.02em] text-[#153E35]">
            {T.about.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#153E35]/80">{T.about.body}</p>
        </div>

        {/* Info items — two-column on sm+ */}
        <dl className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
          {T.info.map((item) => (
            <div key={item.title}>
              <dt className="font-reforma-gris text-base font-semibold tracking-[0.02em] text-[#153E35]">
                {item.title}
              </dt>
              <dd className="mt-1.5 space-y-1 text-sm leading-relaxed text-[#153E35]/80">
                {item.lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </EventShell>
  );
}
