"use client";

import { motion } from "framer-motion";
import {
  FileCheck2,
  Landmark,
  ShieldCheck,
  WalletCards,
  Network,
} from "lucide-react";

const SYSTEMS = [
  {
    label: "Land Records",
    icon: FileCheck2,
    position: "left-0 top-0",
  },
  {
    label: "Revenue",
    icon: Landmark,
    position: "right-0 top-0",
  },
  {
    label: "Environment",
    icon: ShieldCheck,
    position: "left-0 bottom-0",
  },
  {
    label: "Finance",
    icon: WalletCards,
    position: "right-0 bottom-0",
  },
];

export function GovernmentIntegrationWidget() {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative min-h-[300px] overflow-hidden rounded-3xl border border-violet-200 bg-[#f7f1ff] p-6 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-violet-300 hover:shadow-[0_30px_60px_-30px_rgba(120,70,200,0.25)] sm:p-7"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-300/0 blur-3xl transition-all duration-500 group-hover:bg-violet-300/20" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <motion.span
            whileHover={{ scale: 1.08 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700"
          >
            <Network className="h-5 w-5" />
          </motion.span>

          <h3 className="font-serif text-xl text-text">
            Government Integration
          </h3>
        </div>

        <div className="mt-6 flex items-center justify-between gap-5">
          <div className="shrink-0">
            <p className="font-serif text-6xl tracking-tight text-text">
              8+
            </p>

            <p className="mt-1 max-w-[170px] text-sm leading-relaxed text-muted">
              Government systems designed to integrate
            </p>
          </div>

          <div className="relative h-[145px] w-[270px] shrink-0">
            {/* Connections */}
            {[
              "left-[25%] top-[28%] rotate-[25deg]",
              "right-[25%] top-[28%] -rotate-[25deg]",
              "bottom-[28%] left-[25%] -rotate-[25deg]",
              "bottom-[28%] right-[25%] rotate-[25deg]",
            ].map((position, i) => (
              <motion.div
                key={position}
                animate={{
                  opacity: [0.2, 0.9, 0.2],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                className={`absolute ${position} h-px w-[25%] bg-emerald-500/60`}
              />
            ))}

            {/* Central node */}
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                boxShadow: [
                  "0 8px 20px rgba(6,78,59,0.18)",
                  "0 12px 30px rgba(6,78,59,0.3)",
                  "0 8px 20px rgba(6,78,59,0.18)",
                ],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-900 text-xs font-medium text-white"
            >
              DHARITRI
            </motion.div>

            {/* Systems */}
            {SYSTEMS.map(({ label, icon: Icon, position }, index) => (
              <motion.div
                key={label}
                animate={{
                  y: [0, -4, 0],
                  opacity: [0.75, 1, 0.75],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.45,
                  ease: "easeInOut",
                }}
                className={`absolute ${position} flex items-center gap-2 rounded-full border border-white bg-white/80 px-3 py-2 text-[10px] text-text shadow-sm backdrop-blur-sm`}
              >
                <Icon className="h-3.5 w-3.5 text-emerald-600" />
                {label}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}