"use client";

import { motion } from "framer-motion";
import { Gauge } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export function FasterReportingWidget() {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative min-h-[250px] overflow-hidden rounded-3xl border border-amber-200 bg-[#fffaf0] p-6 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-amber-300 hover:shadow-[0_30px_60px_-30px_rgba(180,120,40,0.25)] sm:p-7"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-300/0 blur-3xl transition-all duration-500 group-hover:bg-amber-300/20" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <motion.span
            whileHover={{ scale: 1.08 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700"
          >
            <Gauge className="h-5 w-5" />
          </motion.span>

          <h3 className="font-serif text-xl text-text">
            Faster Reporting
          </h3>
        </div>

        <div className="mt-7 grid grid-cols-[0.8fr_1fr_1fr] items-center gap-5">
          <div>
            <AnimatedCounter
              value={5}
              suffix="×"
              className="font-serif text-6xl tracking-tight text-text"
            />

            <p className="mt-1 text-sm leading-relaxed text-muted">
              Faster status reporting
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Manual
            </p>

            <p className="mt-2 font-serif text-2xl text-text">
              5 days
            </p>

            <div className="mt-3 flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.span
                  key={i}
                  animate={{
                    opacity: [0.35, 0.75, 0.35],
                    scaleY: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.12,
                    ease: "easeInOut",
                  }}
                  className="h-9 w-2.5 origin-bottom rounded-sm bg-black/10"
                />
              ))}
            </div>
          </div>

          <div className="border-l border-paper-line pl-5">
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-700">
              DHARITRI
            </p>

            <p className="mt-2 font-serif text-2xl text-text">
              1 day
            </p>

            <div className="mt-3 flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.span
                  key={i}
                  animate={{
                    opacity:
                      i < 3
                        ? [0.5, 1, 0.5]
                        : [0.35, 0.65, 0.35],
                    scaleY:
                      i < 3
                        ? [0.8, 1, 0.8]
                        : [1, 1, 1],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                  className={`h-9 w-2.5 origin-bottom rounded-sm ${
                    i < 3
                      ? "bg-emerald-500"
                      : "bg-emerald-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}