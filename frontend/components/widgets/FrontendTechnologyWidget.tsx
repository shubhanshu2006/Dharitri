"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  FileText,
  Home,
  Map,
  Settings,
} from "lucide-react";

const STATS = [
  ["248", "Parcels"],
  ["36", "In Review"],
  ["189", "Completed"],
];

export function FrontendTechnologyWidget() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % STATS.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[178px] overflow-hidden rounded-2xl border border-black/10 bg-white/75 p-3 shadow-sm">
      <div className="flex h-full overflow-hidden rounded-xl border border-black/5 bg-white">
        {/* Sidebar */}
        <div className="w-[25%] border-r border-black/5 bg-slate-50 p-2">
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100">
              <Home className="h-3 w-3 text-emerald-700" />
            </div>

            <span className="text-[8px] font-semibold text-slate-700">
              DHARITRI
            </span>
          </div>

          <div className="mt-4 space-y-1">
            {[
              [Map, "Dashboard"],
              [FileText, "Parcels"],
              [BarChart3, "Reports"],
              [Bell, "Alerts"],
              [Settings, "Settings"],
            ].map(([Icon, label], i) => (
              <motion.div
                key={label as string}
                animate={{
                  x: active === i % 3 ? 2 : 0,
                  opacity: active === i % 3 ? 1 : 0.55,
                }}
                className="flex items-center gap-1.5 rounded-md px-1.5 py-1"
              >
                <Icon className="h-2.5 w-2.5 text-slate-500" />

                <span className="text-[7px] text-slate-500">
                  {label as string}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dashboard */}
        <div className="relative flex-1 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-sm text-slate-900">
                Land Dashboard
              </p>

              <p className="text-[7px] text-slate-400">
                Acquisition overview
              </p>
            </div>

            <motion.div
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="h-2 w-2 rounded-full bg-emerald-500"
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-1.5">
            {STATS.map(([value, label], i) => (
              <motion.div
                key={label}
                animate={{
                  y: active === i ? -3 : 0,
                  scale: active === i ? 1.03 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 18,
                }}
                className="rounded-lg bg-emerald-50 p-2"
              >
                <p className="font-serif text-base text-slate-900">
                  {value}
                </p>

                <p className="text-[6px] text-slate-500">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Moving graph */}
          <div className="mt-4 flex h-9 items-end gap-1">
            {[30, 45, 35, 65, 50, 75, 58, 85, 68, 92].map(
              (height, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [
                      `${height * 0.7}%`,
                      `${height}%`,
                      `${height * 0.8}%`,
                      `${height}%`,
                    ],
                  }}
                  transition={{
                    duration: 2 + i * 0.12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex-1 rounded-t-sm bg-emerald-400/60"
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}