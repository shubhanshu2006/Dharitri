"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type Status = "acquired" | "pending" | "verified" | "delayed";

const STATUS_STYLES: Record<
  Status,
  {
    dot: string;
    cell: string;
    label: string;
    fill: string;
    stroke: string;
  }
> = {
  acquired: {
    dot: "bg-emerald-500",
    cell: "bg-emerald-500/15 border-emerald-500/40",
    label: "Acquired",
    fill: "#10b981",
    stroke: "#059669",
  },
  pending: {
    dot: "bg-amber-400",
    cell: "bg-amber-400/15 border-amber-400/40",
    label: "Pending",
    fill: "#fbbf24",
    stroke: "#d97706",
  },
  verified: {
    dot: "bg-muted",
    cell: "bg-paper-dim border-paper-line",
    label: "Verified",
    fill: "#94a3b8",
    stroke: "#64748b",
  },
  delayed: {
    dot: "bg-clay-500",
    cell: "bg-clay-500/15 border-clay-500/40",
    label: "Delayed",
    fill: "#b96b4b",
    stroke: "#9a563c",
  },
};

type Parcel = {
  id: string;
  status: Status;
  area: number;
  village: string;
};

const INITIAL: Parcel[] = [
  {
    id: "P001",
    status: "acquired",
    area: 2.4,
    village: "Kondapur",
  },
  {
    id: "P002",
    status: "pending",
    area: 1.1,
    village: "Kondapur",
  },
  {
    id: "P003",
    status: "acquired",
    area: 3.0,
    village: "Rampur",
  },
  {
    id: "P004",
    status: "verified",
    area: 0.9,
    village: "Rampur",
  },
  {
    id: "P005",
    status: "delayed",
    area: 1.6,
    village: "Sitapur",
  },
  {
    id: "P006",
    status: "acquired",
    area: 2.1,
    village: "Sitapur",
  },
  {
    id: "P007",
    status: "verified",
    area: 1.3,
    village: "Bhelupur",
  },
  {
    id: "P008",
    status: "acquired",
    area: 2.8,
    village: "Bhelupur",
  },
];

const PARCEL_SHAPES = [
  {
    id: "P001",
    points: "34,38 150,24 184,87 142,125 52,111",
    label: { x: 103, y: 76 },
  },
  {
    id: "P002",
    points: "150,24 265,34 282,91 184,87",
    label: { x: 220, y: 61 },
  },
  {
    id: "P003",
    points: "34,38 52,111 26,174 102,185 142,125",
    label: { x: 79, y: 145 },
  },
  {
    id: "P004",
    points: "142,125 184,87 282,91 259,158 177,174",
    label: { x: 215, y: 132 },
  },
  {
    id: "P005",
    points: "26,174 102,185 119,257 44,274 12,225",
    label: { x: 65, y: 226 },
  },
  {
    id: "P006",
    points: "102,185 177,174 207,239 119,257",
    label: { x: 151, y: 216 },
  },
  {
    id: "P007",
    points: "177,174 259,158 299,211 207,239",
    label: { x: 239, y: 198 },
  },
  {
    id: "P008",
    points: "207,239 299,211 324,273 230,292",
    label: { x: 265, y: 259 },
  },
];

export function GISParcelWidget() {
  const [parcels, setParcels] = useState<Parcel[]>(INITIAL);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pulseId, setPulseId] = useState<string | null>(null);

  useEffect(() => {
    const cycle: Status[] = ["pending", "verified", "acquired"];

    const interval = setInterval(() => {
      setParcels((prev) => {
        const idx = Math.floor(Math.random() * prev.length);
        const target = prev[idx];

        if (!target || target.status === "delayed") {
          return prev;
        }

        const currentIndex = cycle.indexOf(target.status);

        const nextStatus =
          cycle[(currentIndex + 1) % cycle.length] ?? "acquired";

        setPulseId(target.id);

        const next = [...prev];

        next[idx] = {
          ...target,
          status: nextStatus,
        };

        return next;
      });
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!pulseId) return;

    const timeout = setTimeout(() => {
      setPulseId(null);
    }, 900);

    return () => clearTimeout(timeout);
  }, [pulseId]);

  const active = useMemo(
    () => parcels.find((p) => p.id === activeId) ?? null,
    [parcels, activeId],
  );

  return (
    <div className="space-y-3">
      {/* GIS MAP */}
      <div className="relative h-[310px] overflow-hidden rounded-2xl border border-paper-line bg-[#dfe7dc]">
        {/* Terrain texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.7) 0 1px, transparent 1px),
              radial-gradient(circle at 70% 60%, rgba(21,32,27,0.08) 0 1px, transparent 1px),
              repeating-linear-gradient(
                125deg,
                transparent 0px,
                transparent 14px,
                rgba(21,32,27,0.035) 15px,
                transparent 16px
              )
            `,
            backgroundSize: "18px 18px, 23px 23px, auto",
          }}
        />

        {/* Soft terrain patches */}
        <div className="absolute -left-10 top-20 h-40 w-56 rounded-full bg-emerald-700/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-44 w-64 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-32 w-72 rounded-full bg-emerald-600/10 blur-3xl" />

        {/* Water / natural feature */}
        <svg
          viewBox="0 0 340 310"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M-20 245 C55 215 73 270 129 235 C186 199 194 228 240 184 C279 147 306 163 360 125"
            fill="none"
            stroke="rgba(59,130,246,0.15)"
            strokeWidth="28"
          />

          <path
            d="M-20 245 C55 215 73 270 129 235 C186 199 194 228 240 184 C279 147 306 163 360 125"
            fill="none"
            stroke="rgba(59,130,246,0.35)"
            strokeWidth="2"
          />

          {/* Main road */}
          <path
            d="M-15 84 C75 106 109 99 166 121 C225 144 268 135 355 164"
            fill="none"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth="13"
          />

          <path
            d="M-15 84 C75 106 109 99 166 121 C225 144 268 135 355 164"
            fill="none"
            stroke="rgba(86,99,87,0.35)"
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />

          {/* Secondary road */}
          <path
            d="M212 -10 C196 62 203 108 184 165 C166 216 169 263 191 325"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="9"
          />

          <path
            d="M212 -10 C196 62 203 108 184 165 C166 216 169 263 191 325"
            fill="none"
            stroke="rgba(86,99,87,0.3)"
            strokeWidth="1"
            strokeDasharray="4 5"
          />
        </svg>

        {/* Map parcels */}
        <svg
          viewBox="0 0 340 310"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          {PARCEL_SHAPES.map((shape) => {
            const parcel = parcels.find((p) => p.id === shape.id);

            if (!parcel) return null;

            const style = STATUS_STYLES[parcel.status];
            const isActive = activeId === parcel.id;
            const isPulsing = pulseId === parcel.id;

            return (
              <g
                key={parcel.id}
                onMouseEnter={() => setActiveId(parcel.id)}
                onMouseLeave={() =>
                  setActiveId((current) =>
                    current === parcel.id ? null : current,
                  )
                }
                className="cursor-pointer"
              >
                {/* Pulse */}
                {isPulsing && (
                  <motion.polygon
                    points={shape.points}
                    initial={{
                      opacity: 0.6,
                      scale: 0.94,
                      transformOrigin: "center",
                    }}
                    animate={{
                      opacity: 0,
                      scale: 1.08,
                    }}
                    transition={{
                      duration: 0.9,
                    }}
                    fill={style.fill}
                  />
                )}

                {/* Parcel shadow */}
                <polygon
                  points={shape.points}
                  fill="rgba(21,32,27,0.10)"
                  transform="translate(1 2)"
                />

                {/* Parcel */}
                <motion.polygon
                  points={shape.points}
                  initial={false}
                  animate={{
                    fill: isActive ? style.fill : `${style.fill}B8`,
                    stroke: isActive ? style.stroke : "rgba(255,255,255,0.8)",
                    strokeWidth: isActive ? 3 : 1.5,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="origin-center"
                />

                {/* Parcel inner boundary */}
                <polygon
                  points={shape.points}
                  fill="none"
                  stroke="rgba(21,32,27,0.16)"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                />

                {/* Parcel label */}
                <text
                  x={shape.label.x}
                  y={shape.label.y}
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                  fill={isActive ? "#ffffff" : "#15201b"}
                  fontSize="8"
                  fontWeight="700"
                  letterSpacing="0.5"
                >
                  {parcel.id}
                </text>

                {/* Status dot */}
                <circle
                  cx={shape.label.x}
                  cy={shape.label.y + 10}
                  r="2.5"
                  fill={style.fill}
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="1"
                />
              </g>
            );
          })}
        </svg>

        {/* Top-left map label */}
        <div className="absolute left-3 top-3 rounded-lg border border-white/70 bg-white/75 px-2.5 py-1.5 shadow-sm backdrop-blur-md">
          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-text/60">
            Cadastral View
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-text">
            Acquisition Zone · 04
          </p>
        </div>

        {/* Map controls */}
        <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-lg border border-white/70 bg-white/80 shadow-sm backdrop-blur-md">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center text-sm font-medium text-text/70 transition-colors hover:bg-white hover:text-text"
            aria-label="Zoom in"
          >
            +
          </button>

          <div className="h-px bg-paper-line" />

          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center text-sm font-medium text-text/70 transition-colors hover:bg-white hover:text-text"
            aria-label="Zoom out"
          >
            −
          </button>
        </div>

        {/* Active parcel floating information */}
        <AnimatePresence>
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-3 left-3 min-w-[165px] rounded-xl border border-white/70 bg-white/90 px-3 py-2.5 shadow-lg backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
                    Selected Parcel
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-text">
                    {active.id} · {active.village}
                  </p>

                  <p className="mt-1 text-[10px] text-muted">
                    {active.area} ha · {STATUS_STYLES[active.status].label}
                  </p>
                </div>

                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    STATUS_STYLES[active.status].dot
                  }`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scale */}
        <div className="absolute bottom-3 right-3 flex items-end gap-1.5 rounded-md bg-white/60 px-2 py-1 backdrop-blur-sm">
          <span className="h-2 w-10 border-b border-l border-r border-text/50" />
          <span className="text-[8px] font-medium text-text/60">500 m</span>
        </div>
      </div>

      {/* Legend / status bar */}
      <div className="flex min-h-[54px] items-center justify-between rounded-xl border border-paper-line bg-paper px-3.5 py-2.5">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="flex w-full items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-text">
                  Parcel {active.id} · {active.village}
                </p>

                <p className="text-[11px] text-muted">
                  {active.area} ha · {STATUS_STYLES[active.status].label}
                </p>
              </div>

              <span
                className={`h-2 w-2 rounded-full ${
                  STATUS_STYLES[active.status].dot
                }`}
              />
            </motion.div>
          ) : (
            <motion.div
              key="legend"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="flex w-full flex-wrap items-center justify-between gap-2 text-[10px] text-muted"
            >
              {(Object.keys(STATUS_STYLES) as Status[]).map((status) => (
                <span key={status} className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      STATUS_STYLES[status].dot
                    }`}
                  />

                  {STATUS_STYLES[status].label}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
