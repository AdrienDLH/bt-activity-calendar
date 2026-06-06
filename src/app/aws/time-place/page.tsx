/**
 * TIME & PLACE — /aws/time-place
 *
 * Welcome message + a responsive "General Information" panel. On mobile the
 * info items stack; on sm+ they flow into two readable columns.
 */
import Link from "next/link";
import { IconBrandWechat } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { EventShell } from "@/components/event/event-shell";
import { ResortMap } from "@/components/event/resort-map";
import { WechatDownload } from "@/components/event/wechat-download";
import { TIME_AND_PLACE as T } from "@/lib/event-data";

export default function TimePlacePage() {
  return (
    <EventShell backHref="/aws" contentClassName="max-w-2xl">
      {/* ---- Welcome ---- */}
      <section className="text-center">
        <p className="font-reforma-negra text-sm uppercase tracking-[0.15em] text-luxury-gold sm:text-base">
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

      {/* ---- Resort Map ----
          Same card surface as the panels above. The centre artwork is shown
          (tap to zoom) with the two numbered legends recreated responsively
          below — see <ResortMap />. */}
      <section className="mt-10 rounded-[2px] bg-card p-6 sm:mt-12 sm:p-8">
        <h2 className="text-center font-reforma-negra text-sm uppercase tracking-[0.15em] text-[#153E35]">
          Resort Map
        </h2>
        <div className="mt-6">
          <ResortMap />
        </div>
      </section>

      {/* ---- WeChat section ----
          Bridges "Communication (+86)" above to the app download + setup guide.
          Wrapped in a card container (bg-card rounded-[2px], no shadow — same
          surface as the activity cards) so it reads as a defined block rather
          than floating text at the foot of the page. */}
      <section className="mt-10 sm:mt-12">
        <div className="rounded-[2px] bg-card p-6 text-center sm:p-8">
          {/* Section title — Reforma Gris, same treatment as other card titles */}
          <h3 className="font-reforma-gris text-xl font-semibold tracking-[0.02em] text-[#153E35]">
            Staying Connected on WeChat
          </h3>

          {/* Intro 1 — download the app */}
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#153E35]/80">
            Planning to use WeChat in China? Download the app to get started.
          </p>

          {/* Download the app (Apple + Google Play) — filled bronze buttons */}
          <WechatDownload className="mt-4" />

          {/* Intro 2 — troubleshooting (no max-width so it sits on one line) */}
          <p className="mt-8 text-sm leading-relaxed text-[#153E35]/80">
            Trouble setting up or verifying your account? Follow our step-by-step guide.
          </p>

          {/* Link through to the full setup & verification guide — bronze OUTLINE
              (same colour as the filled buttons, not the default grey outline). */}
          <Button
            asChild
            variant="outline"
            className="mt-3 border-[#85754E] bg-transparent text-[#85754E] shadow-none hover:bg-[#85754E]/10 hover:text-[#85754E]"
          >
            <Link href="/aws/wechat">
              <IconBrandWechat aria-hidden />
              WeChat Setup &amp; Help
            </Link>
          </Button>
        </div>
      </section>
    </EventShell>
  );
}
