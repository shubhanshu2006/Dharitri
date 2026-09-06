"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const BARS = [
  35, 48, 42, 61, 75, 44, 31, 39,
  52, 43, 65, 56, 74, 48, 42, 68,
  57, 81, 73, 88, 70, 94, 82, 100,
];

const EVENTS = [
  ["Payment initiated", "12 minutes ago"],
  ["Verification completed", "28 minutes ago"],
  ["Land record matched", "43 minutes ago"],
  ["Approval granted", "1 hour ago"],
  ["Parcel updated", "1 hour ago"],
];

export function AuditActivityWidget() {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
      }}
      className="group relative overflow-hidden rounded-3xl border border-emerald-900 bg-emerald-950 p-5 text-white shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-emerald-700 hover:shadow-[0_30px_60px_-30px_rgba(20,110,71,0.5)] sm:p-6"
    >
      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <motion.div
        animate={{
          opacity: [0.06, 0.13, 0.06],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-emerald-400 blur-3xl"
      />

      <motion.div
        animate={{
          opacity: [0.03, 0.08, 0.03],
          x: [-20, 20, -20],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-emerald-400 blur-3xl"
      />

      <div className="relative z-10">
        {/* =====================================================
            MAIN TWO-COLUMN LAYOUT
        ====================================================== */}

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">

          {/* =================================================
              LEFT — CONTINUOUS AUDIT ACTIVITY
          ================================================== */}

          <div className="flex min-w-0 flex-col">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <motion.span
                    animate={{
                      scale: [1, 1.06, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300"
                  >
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </motion.span>

                  <h3 className="font-serif text-xl sm:text-2xl">
                    Continuous Audit Activity
                  </h3>
                </div>

                <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/60 sm:text-sm">
                  Every verification, approval and payment event mapped over
                  time.
                </p>
              </div>

              {/* Live */}
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-medium text-emerald-300 sm:px-3 sm:py-1.5 sm:text-xs">
                <motion.span
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                />
                Live
              </span>
            </div>

            {/* Audit chart card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="mt-4 flex flex-1 flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-serif text-3xl sm:text-4xl">
                    24,582
                  </p>

                  <p className="mt-1 text-xs text-white/55 sm:text-sm">
                    Total events this month
                  </p>
                </div>

                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] text-emerald-300 sm:px-3 sm:py-1.5 sm:text-xs">
                  ↑ 18%
                </span>
              </div>

              {/* Animated chart */}
              <div className="mt-5 flex h-[105px] flex-1 items-end gap-1 border-b border-white/10 sm:h-[120px] sm:gap-1.5">
                {BARS.map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [
                        `${height * 0.72}%`,
                        `${height}%`,
                        `${height * 0.82}%`,
                        `${height}%`,
                      ],
                      opacity: [0.55, 1, 0.7, 1],
                    }}
                    transition={{
                      duration: 2.5 + (i % 4) * 0.4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.08,
                      ease: "easeInOut",
                    }}
                    className="flex-1 rounded-t-sm bg-emerald-400/80"
                  />
                ))}
              </div>

              <div className="mt-2.5 flex justify-between text-[9px] text-white/35 sm:text-[10px]">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </motion.div>
          </div>

          {/* =================================================
              RIGHT — LIVE ACTIVITY FEED
          ================================================== */}

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
          >
            {/* Feed header */}
            <div className="flex shrink-0 items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300/60">
                  Live activity
                </p>

                <h3 className="mt-1 font-serif text-xl sm:text-2xl">
                  Live Activity Feed
                </h3>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1">
                <motion.span
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                />

                <span className="text-[10px] font-medium text-emerald-300">
                  Live
                </span>
              </div>
            </div>

            {/* Feed */}
            <div
              className="relative mt-4 h-[180px] overflow-hidden rounded-xl border border-white/10 bg-white/[0.025] sm:h-[205px]"
              onMouseEnter={(e) => {
                const stream = e.currentTarget.querySelector(
                  ".audit-stream"
                ) as HTMLElement | null;

                if (stream) {
                  stream.style.animationPlayState = "paused";
                }
              }}
              onMouseLeave={(e) => {
                const stream = e.currentTarget.querySelector(
                  ".audit-stream"
                ) as HTMLElement | null;

                if (stream) {
                  stream.style.animationPlayState = "running";
                }
              }}
            >
              {/* Top fade */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-10 bg-gradient-to-b from-emerald-950 to-transparent" />

              {/* Bottom fade */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-emerald-950 to-transparent" />

              {/* Timeline */}
              <div className="pointer-events-none absolute bottom-0 left-5 top-0 w-px bg-white/10" />

              {/* =================================================
                  CONTINUOUS SCROLL
              ================================================== */}

              <div className="audit-stream animate-marquee-up flex flex-col gap-2.5 p-3">
                {[...EVENTS, ...EVENTS].map(
                  ([event, time], i) => (
                    <motion.div
                      key={`${event}-${i}`}
                      className="relative flex min-h-[48px] items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2.5"
                      animate={{
                        opacity: [0.65, 1, 0.65],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.35,
                        ease: "easeInOut",
                      }}
                    >
                      {/* Timeline dot */}
                      <motion.span
                        animate={{
                          scale: [1, 1.35, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                          i % EVENTS.length === 3
                            ? "bg-amber-300"
                            : "bg-emerald-300"
                        }`}
                      />

                      {/* Event */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-medium text-white/90 sm:text-xs">
                          {event}
                        </p>

                        <p className="mt-0.5 text-[9px] text-white/40 sm:text-[10px]">
                          {time}
                        </p>
                      </div>

                      {/* Status */}
                      <motion.span
                        animate={{
                          opacity: [0.35, 1, 0.35],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.25,
                        }}
                        className="hidden text-[9px] font-medium text-emerald-300 sm:block"
                      >
                        Recorded
                      </motion.span>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="text-[10px] text-white/40 sm:text-xs">
            A more transparent land acquisition ecosystem.
          </p>
        </div>
      </div>
    </motion.div>
  );
}