"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const WEEKS = 26;
const DAYS = 7;

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const BASE = Array.from({ length: WEEKS * DAYS }, (_, i) =>
  Math.floor(seededRandom(i + 1) * 5)
);

const LEVEL_COLORS = [
  "bg-paper-line",
  "bg-emerald-200",
  "bg-emerald-400",
  "bg-emerald-500",
  "bg-emerald-700",
];

export function HeatmapWidget() {
  const [cells, setCells] = useState<number[]>(BASE);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCells((prev) => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        next[idx] = Math.min(4, next[idx] + 1);
        return next;
      });
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const columns = useMemo(() => {
    const cols: number[][] = [];
    for (let w = 0; w < WEEKS; w++) {
      cols.push(cells.slice(w * DAYS, w * DAYS + DAYS));
    }
    return cols;
  }, [cells]);

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-[3px] overflow-x-auto">
        {columns.map((col, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {col.map((level, di) => {
              const idx = wi * DAYS + di;
              return (
                <motion.div
                  key={idx}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered((cur) => (cur === idx ? null : cur))}
                  whileHover={{ scale: 1.3 }}
                  className={`h-2.5 w-2.5 rounded-[2px] transition-colors duration-500 ${LEVEL_COLORS[level]}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="hidden w-32 shrink-0 flex-col gap-1 sm:flex">
        <AnimatePresence mode="wait">
          <motion.div
            key={hovered ?? "default"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <p className="text-[11px] font-medium text-text">
              {hovered !== null ? `${cells[hovered]} audit events` : "Verification activity"}
            </p>
            <p className="text-[10px] text-muted">
              {hovered !== null ? "on this day" : "across the network, live"}
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-1 flex items-center gap-1">
          <span className="text-[10px] text-muted">Less</span>
          {LEVEL_COLORS.map((c) => (
            <span key={c} className={`h-2 w-2 rounded-[2px] ${c}`} />
          ))}
          <span className="text-[10px] text-muted">More</span>
        </div>
      </div>
    </div>
  );
}
