"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  TimerReset,
} from "lucide-react";

type AlertTone = "amber" | "emerald" | "clay";

type AlertItem = {
  icon: typeof TimerReset;
  tone: AlertTone;
  category: string;
  title: string;
  meta: string;
  status: string;
};

const ALERTS: AlertItem[] = [
  {
    icon: TimerReset,
    tone: "amber",
    category: "Deadline",
    title: "Milestone deadline in 5 days",
    meta: "Project NH-44 · Section 3",
    status: "Attention",
  },
  {
    icon: BadgeCheck,
    tone: "emerald",
    category: "Payment",
    title: "Payment credited & verified",
    meta: "Parcel P1024 · ₹4,25,000",
    status: "Verified",
  },
  {
    icon: AlertTriangle,
    tone: "clay",
    category: "Ownership",
    title: "Parcel flagged for review",
    meta: "Parcel P0562 · Ownership issue",
    status: "Review",
  },
  {
    icon: Bell,
    tone: "emerald",
    category: "R&R",
    title: "R&R entitlement approved",
    meta: "12 families · Sitapur cluster",
    status: "Approved",
  },
];

const TONE_STYLES: Record<
  AlertTone,
  {
    icon: string;
    dot: string;
    badge: string;
  }
> = {
  amber: {
    icon: "bg-amber-400/15 text-amber-500",
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-600",
  },

  emerald: {
    icon: "bg-emerald-500/15 text-emerald-600",
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-700",
  },

  clay: {
    icon: "bg-clay-500/15 text-clay-500",
    dot: "bg-clay-500",
    badge: "bg-clay-500/10 text-clay-600",
  },
};

export function AlertsFeedWidget() {
  return (
    <div>
      {/* =========================================
          ALERT OVERVIEW
      ========================================== */}

      <div className="mb-3 rounded-xl border border-paper-line bg-[#eaffdf] px-3.5 py-2.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-muted">
              Alert overview
            </p>

            <p className="mt-0.5 text-[11px] font-semibold text-text">
              Current acquisition events
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-paper-line bg-white px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-[8px] font-semibold text-text">
              4 active
            </span>
          </div>
        </div>

        {/* Severity distribution */}
        <div className="mt-2 grid grid-cols-3 gap-2">
          {/* Attention */}
          <div className="rounded-lg border border-amber-400/15 bg-amber-400/[0.06] px-2.5 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />

              <span className="text-[8px] font-semibold text-muted">
                Attention
              </span>
            </div>

            <p className="mt-1 font-serif text-lg text-amber-600">
              1
            </p>
          </div>

          {/* Review */}
          <div className="rounded-lg border border-clay-500/15 bg-clay-500/[0.06] px-2.5 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-clay-500" />

              <span className="text-[8px] font-semibold text-muted">
                Review
              </span>
            </div>

            <p className="mt-1 font-serif text-lg text-clay-500">
              1
            </p>
          </div>

          {/* Resolved */}
          <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/[0.05] px-2.5 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-[8px] font-semibold text-muted">
                Resolved
              </span>
            </div>

            <p className="mt-1 font-serif text-lg text-emerald-600">
              2
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          LIVE ALERT HEADER
      ========================================== */}

      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-muted">
            Live alerts
          </p>

          <p className="mt-1 text-xs font-semibold text-text">
            Acquisition activity
          </p>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 rounded-full border border-paper-line bg-[#eaffdf] px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>

          <span className="text-[9px] font-semibold text-text">
            Live
          </span>
        </div>
      </div>

      {/* =========================================
          ALERT STREAM
      ========================================== */}

      <div
        className="relative h-[196px] overflow-hidden rounded-2xl border border-paper-line bg-[#eef1e9]"
        onMouseEnter={(e) => {
          const stream = e.currentTarget.querySelector(
            ".alert-stream"
          ) as HTMLElement | null;

          if (stream) {
            stream.style.animationPlayState = "paused";
          }
        }}
        onMouseLeave={(e) => {
          const stream = e.currentTarget.querySelector(
            ".alert-stream"
          ) as HTMLElement | null;

          if (stream) {
            stream.style.animationPlayState = "running";
          }
        }}
      >
        {/* Background texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 20% 30%,
                rgba(47,197,127,0.12) 0 1px,
                transparent 1px
              ),
              radial-gradient(
                circle at 80% 70%,
                rgba(21,32,27,0.06) 0 1px,
                transparent 1px
              ),
              repeating-linear-gradient(
                135deg,
                transparent 0px,
                transparent 15px,
                rgba(21,32,27,0.025) 16px,
                transparent 17px
              )
            `,
            backgroundSize:
              "20px 20px, 26px 26px, auto",
          }}
        />

        {/* Top fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-8 bg-gradient-to-b from-[#eef1e9] to-transparent" />

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-8 bg-gradient-to-t from-[#eef1e9] to-transparent" />

        {/* Timeline */}
        <div className="pointer-events-none absolute bottom-0 left-[25px] top-0 w-px bg-[#eaffdf]-line" />

        {/* =====================================
            SCROLLING EVENTS
        ====================================== */}

        <div className="alert-stream animate-marquee-up flex flex-col gap-2.5 p-3">
          {[...ALERTS, ...ALERTS].map(
            (alert, i) => {
              const Icon = alert.icon;
              const tone = TONE_STYLES[alert.tone];

              return (
                <div
                  key={`${alert.title}-${i}`}
                  className="relative flex min-h-[62px] items-center gap-2.5 rounded-xl border border-paper-line bg-white/85 px-3 py-2.5 shadow-[0_8px_20px_-15px_rgba(0,0,0,0.2)] backdrop-blur-sm"
                >
                  {/* Timeline dot */}
                  <span
                    className={`absolute -left-[3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${tone.dot}`}
                  />

                  {/* Icon */}
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tone.icon}`}
                  >
                    <Icon
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />
                  </span>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <span className="truncate text-[8px] font-bold uppercase tracking-[0.13em] text-muted">
                      {alert.category}
                    </span>

                    <p className="mt-0.5 truncate text-[11px] font-semibold text-text">
                      {alert.title}
                    </p>

                    <p className="mt-0.5 truncate text-[9px] text-muted">
                      {alert.meta}
                    </p>
                  </div>

                  {/* Status */}
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-semibold ${tone.badge}`}
                  >
                    {alert.status}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* =========================================
          MONITORING SUMMARY
      ========================================== */}

      <div className="mt-3 flex min-h-[54px] items-center justify-between rounded-xl border border-paper-line bg-[#eaffdf] px-3.5 py-2.5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
            Monitoring
          </p>

          <p className="mt-0.5 text-[10px] font-semibold text-text">
            4 acquisition events tracked
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {ALERTS.map((alert, i) => (
            <span
              key={`${alert.category}-${i}`}
              className={`h-1.5 w-1.5 rounded-full ${
                TONE_STYLES[alert.tone].dot
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}