/**
 * WECHAT SETUP & VERIFICATION — /aws/wechat
 *
 * A step-by-step guide for setting up WeChat in China and recovering from the
 * common "Security Verification Failed" error. Linked from the Time & Place
 * page. Each step is its own numbered card (bg-card, rounded-[2px], no shadow),
 * mirroring the ActivityCard surface; titles use Reforma Gris like the
 * calendar's section headings.
 *
 * Content lives in WECHAT_GUIDE (src/lib/event-data.ts) — edit copy there.
 */
import { IconExternalLink } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { EventShell } from "@/components/event/event-shell";
import { WECHAT_GUIDE as G } from "@/lib/event-data";

export default function WechatGuidePage() {
  return (
    <EventShell backHref="/aws/time-place" contentClassName="max-w-2xl">
      {/* ---- Header ---- */}
      <section className="text-center">
        <p className="font-reforma-negra text-xs uppercase tracking-[0.15em] text-luxury-gold sm:text-sm">
          {G.kicker}
        </p>
        <h1 className="mt-2 font-reforma-negra text-xl uppercase tracking-[0.15em] text-[#153E35] sm:text-2xl">
          {G.title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[#153E35]/90 sm:text-base">
          {G.intro}
        </p>
      </section>

      {/* ---- Steps ---- */}
      <div className="mt-10 space-y-4 sm:mt-12">
        {G.steps.map((step, i) => (
          <section key={step.title} className="rounded-[2px] bg-card p-6 sm:p-7">
            {/* Step header: bronze number badge + Reforma Gris title */}
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] bg-[#85754E] font-reforma-negra text-sm leading-none text-white">
                {i + 1}
              </span>
              <h2 className="mt-0.5 font-reforma-gris text-lg font-semibold leading-tight tracking-[0.02em] text-[#153E35]">
                {step.title}
              </h2>
            </div>

            {step.intro && (
              <p className="mt-3 text-sm leading-relaxed text-[#153E35]/80">{step.intro}</p>
            )}

            {/* Groups: optional sub-heading + intro + bullet list */}
            <div className="mt-4 space-y-5">
              {step.groups.map((group, gi) => (
                <div key={group.subtitle ?? gi}>
                  {group.subtitle && (
                    <h3 className="font-reforma-gris text-base font-semibold tracking-[0.02em] text-[#153E35]">
                      {group.subtitle}
                    </h3>
                  )}
                  {group.intro && (
                    <p className="mt-1.5 text-sm leading-relaxed text-[#153E35]/80">
                      {group.intro}
                    </p>
                  )}
                  <ul className="mt-2 space-y-2">
                    {group.points.map((point, pi) => (
                      <li
                        key={pi}
                        className="flex gap-2.5 text-sm leading-relaxed text-[#153E35]/80"
                      >
                        {/* Bronze dot marker (same accent as the agenda timeline) */}
                        <span
                          className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#85754E]"
                          aria-hidden
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Optional external-link button (shared bronze Button) */}
              {step.cta && (
                <Button asChild className="mt-1">
                  <a href={step.cta.href} target="_blank" rel="noopener noreferrer">
                    {step.cta.label}
                    <IconExternalLink aria-hidden />
                  </a>
                </Button>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* ---- Pro tip callout ---- */}
      <aside className="mt-6 rounded-[2px] border border-[#85754E]/25 bg-[#85754E]/[0.07] p-5 sm:p-6">
        <p className="font-sans text-[11px] font-semibold uppercase leading-none tracking-[0.1em] text-[#85754E]">
          Pro Tip
        </p>
        <p className="mt-2.5 text-sm leading-relaxed text-[#153E35]/85">{G.proTip}</p>
      </aside>
    </EventShell>
  );
}
