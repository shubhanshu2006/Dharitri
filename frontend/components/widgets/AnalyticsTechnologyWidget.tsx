"use client";

import { motion } from "framer-motion";

const EVENTS = [
  ["Parcel Risk", "High", "87%"],
  ["Delay Prediction", "Medium", "64%"],
  ["Fraud Detection", "Low", "18%"],
  ["Compensation Risk", "Medium", "57%"],
  ["Acquisition Forecast", "Low", "24%"],
];

export function AnalyticsTechnologyWidget() {
  return (
    <div className="relative h-[178px] overflow-hidden rounded-2xl border border-black/10 bg-white/80 p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] font-semibold text-slate-800">
            Decision Engine
          </p>
          <p className="text-[9px] text-slate-400">
            Live model inference
          </p>
        </div>

        <span className="flex items-center gap-1.5 text-[9px] font-medium text-violet-600">
          <motion.span
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
            }}
            className="h-1.5 w-1.5 rounded-full bg-violet-500"
          />
          Running
        </span>
      </div>

      <div className="relative mt-3 h-[130px] overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-7 bg-gradient-to-b from-white/90 to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-7 bg-gradient-to-t from-white/90 to-transparent" />

        <motion.div
          animate={{ y: ["0%", "-50%"] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex flex-col gap-1.5"
        >
          {[...EVENTS, ...EVENTS].map(([name, level, score], i) => (
            <div
              key={`${name}-${i}`}
              className="flex items-center gap-2 rounded-lg border border-black/5 bg-slate-50/80 px-2.5 py-2"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-violet-400" />

              <span className="min-w-0 flex-1 truncate text-[9px] font-medium text-slate-700">
                {name}
              </span>

              <span
                className={`rounded-full px-2 py-0.5 text-[8px] font-medium ${
                  level === "High"
                    ? "bg-red-100 text-red-700"
                    : level === "Medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {level}
              </span>

              <span className="text-[9px] font-semibold text-violet-600">
                {score}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}