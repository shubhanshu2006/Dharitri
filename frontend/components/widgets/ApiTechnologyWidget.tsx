"use client";

import { motion } from "framer-motion";

const REQUESTS = [
  ["GET", "/api/parcels", "200", "120ms"],
  ["POST", "/api/verify", "201", "340ms"],
  ["GET", "/api/land-records", "200", "210ms"],
  ["PUT", "/api/compensation", "200", "180ms"],
  ["GET", "/api/reports", "200", "95ms"],
];

export function ApiTechnologyWidget() {
  return (
    <div className="relative h-[178px] overflow-hidden rounded-2xl border border-black/10 bg-white/80 p-3 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] font-semibold text-slate-800">
            API Gateway
          </p>
          <p className="text-[11px] text-slate-400">
            Live service activity
          </p>
        </div>

        <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
            }}
            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
          />
          Operational
        </span>
      </div>

      {/* Live request stream */}
      <div className="relative mt-3 h-[130px] overflow-hidden">
        {/* Top fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-white/90 to-transparent" />

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-white/90 to-transparent" />

        <motion.div
          animate={{ y: ["0%", "-50%"] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex flex-col gap-1.5"
        >
          {[...REQUESTS, ...REQUESTS].map(
            ([method, endpoint, status, time], i) => (
              <div
                key={`${endpoint}-${i}`}
                className="flex items-center gap-2 rounded-lg border border-black/5 bg-slate-50/80 px-2.5 py-2"
              >
                <span
                  className={`w-9 rounded px-1 py-0.5 text-center text-[10px] font-bold ${
                    method === "POST"
                      ? "bg-blue-100 text-blue-700"
                      : method === "PUT"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {method}
                </span>

                <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-slate-600">
                  {endpoint}
                </span>

                <span className="text-[10px] font-semibold text-emerald-600">
                  {status}
                </span>

                <span className="w-10 text-right text-[10px] text-slate-400">
                  {time}
                </span>
              </div>
            ),
          )}
        </motion.div>
      </div>
    </div>
  );
}