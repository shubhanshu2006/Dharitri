"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Layers, Map, Navigation } from "lucide-react";

const PARCELS = [
  {
    id: "P-1042",
    area: "4.25 acres",
    status: "Verified",
    x: "42%",
    y: "52%",
  },
  {
    id: "P-1056",
    area: "6.10 acres",
    status: "Matched",
    x: "67%",
    y: "37%",
  },
  {
    id: "P-1081",
    area: "3.82 acres",
    status: "Pending",
    x: "29%",
    y: "66%",
  },
];

export function SpatialTechnologyWidget() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PARCELS.length);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  const parcel = PARCELS[index];

  return (
    <div className="relative h-[178px] overflow-hidden rounded-2xl border border-black/10 bg-[#dcebd5] shadow-sm">
      {/* Map background */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#d9e9d2,#b8d39f_45%,#dce7bd_75%,#a9c78f)]" />

      {/* Field boundaries */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute left-[8%] top-[15%] h-[60%] w-[25%] rotate-[14deg] border border-white bg-emerald-400/10" />

        <div className="absolute left-[36%] top-[4%] h-[80%] w-[22%] -rotate-[9deg] border border-white bg-green-500/10" />

        <div className="absolute right-[8%] top-[12%] h-[65%] w-[28%] rotate-[12deg] border border-white bg-emerald-300/10" />
      </div>

      {/* Roads */}
      <div className="absolute left-[-10%] top-[57%] h-[2px] w-[120%] rotate-[7deg] bg-white/80" />

      <div className="absolute left-[54%] top-[-20%] h-[140%] w-[2px] rotate-[17deg] bg-white/70" />

      {/* Controls */}
      <div className="absolute left-2.5 top-2.5 flex flex-col gap-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 shadow-sm">
          <Map className="h-3.5 w-3.5 text-slate-700" />
        </div>

        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 shadow-sm">
          <Layers className="h-3.5 w-3.5 text-slate-700" />
        </div>
      </div>

      {/* Moving parcel */}
      <motion.div
        key={parcel.id}
        initial={{
          opacity: 0,
          scale: 0.7,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="absolute"
        style={{
          left: parcel.x,
          top: parcel.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.25, 0.08, 0.25],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute -inset-5 rounded-full bg-emerald-500"
        />

        <motion.div
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-lg"
        >
          <Navigation className="h-3.5 w-3.5 fill-white text-white" />
        </motion.div>
      </motion.div>

      {/* Parcel panel */}
      <motion.div
        key={`panel-${parcel.id}`}
        initial={{
          opacity: 0,
          x: 8,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        className="absolute right-2.5 top-2.5 w-[39%] rounded-xl border border-white/70 bg-white/90 p-2.5 shadow-lg backdrop-blur-sm"
      >
        <p className="text-[9px] font-semibold text-slate-900">
          {parcel.id}
        </p>

        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[6px] text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {parcel.status}
        </span>

        <div className="mt-2 border-t border-black/5 pt-1.5">
          <p className="text-[6px] text-slate-400">
            Parcel area
          </p>

          <p className="text-[9px] font-medium text-slate-800">
            {parcel.area}
          </p>

          <p className="mt-1 text-[6px] text-slate-400">
            Cadastral match
          </p>

          <p className="text-[8px] font-medium text-emerald-700">
            98.4%
          </p>
        </div>
      </motion.div>
    </div>
  );
}