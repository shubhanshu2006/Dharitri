"use client";

import { motion } from "framer-motion";
import { Map, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const PARCELS = [
  { id: "P1024", area: 2450, village: "Kondapur", status: "Verified" },
  { id: "P1031", area: 3180, village: "Madhapur", status: "Acquired" },
  { id: "P1042", area: 1920, village: "Gachibowli", status: "Verified" },
  { id: "P1056", area: 2840, village: "Nanakramguda", status: "Acquired" },
];

export function LandCoverageWidget() {
  const [parcelIndex, setParcelIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setParcelIndex((prev) => (prev + 1) % PARCELS.length);
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  const parcel = PARCELS[parcelIndex];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative min-h-[250px] overflow-hidden rounded-3xl border border-emerald-300/50 bg-emerald-950 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_30px_60px_-30px_rgba(20,110,71,0.45)]"
    >
      <motion.div
        aria-hidden
        animate={{
          scale: [1, 1.035, 1],
          x: [0, -5, 0],
          y: [0, 3, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage: "url('/images/land-map.png')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/80 to-emerald-950/20" />

      {/* Animated parcel pulse */}
      <motion.div
        key={parcel.id}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: [0, 1, 0], scale: [0.7, 1.15, 1.35] }}
        transition={{ duration: 2.2 }}
        className="absolute right-[24%] top-[42%] h-20 w-20 rounded-full border border-emerald-300/70 bg-emerald-400/10"
      />

      <div className="relative z-10 flex min-h-[250px] flex-col justify-between p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.span
              whileHover={{ scale: 1.08 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-emerald-600 shadow-sm"
            >
              <Map className="h-5 w-5" />
            </motion.span>

            <span className="font-medium text-white">
              Land Coverage
            </span>
          </div>

          <motion.span
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-full border border-emerald-300/30 bg-emerald-900/60 px-3 py-1.5 text-xs text-emerald-200"
          >
            ↑ 12%
          </motion.span>
        </div>

        <div>
          <AnimatedCounter
            value={100000}
            suffix="+"
            className="font-serif text-5xl tracking-tight text-white sm:text-6xl"
          />

          <p className="mt-2 max-w-[230px] text-sm leading-relaxed text-white/75">
            Hectares trackable at parcel level
          </p>

          <motion.div
            key={parcel.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-3"
          >
            <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
              {parcel.status}
            </span>

            <span className="text-xs text-white/70">
              {parcel.id} · {parcel.village}
            </span>
          </motion.div>
        </div>
      </div>

      <motion.div
        whileHover={{ x: 4 }}
        className="absolute bottom-6 right-6 flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300/40 text-emerald-300 transition-colors group-hover:border-emerald-300/80"
      >
        <ArrowUpRight className="h-4 w-4" />
      </motion.div>
    </motion.div>
  );
}