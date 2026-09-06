"use client";

import { motion } from "framer-motion";
import {
  FileCheck2,
  FileClock,
  FileText,
  ShieldCheck,
  LockKeyhole,
  File,
} from "lucide-react";

const DOCUMENTS = [
  {
    version: "v1.0",
    label: "Award Notice",
    icon: FileText,
    status: "Issued",
    accent: "bg-blue-500",
    accentSoft: "bg-blue-500/10",
    accentText: "text-blue-600",
  },
  {
    version: "v1.1",
    label: "Survey Sketch",
    icon: FileClock,
    status: "Reviewed",
    accent: "bg-amber-400",
    accentSoft: "bg-amber-400/10",
    accentText: "text-amber-600",
  },
  {
    version: "v1.2",
    label: "Verified Title",
    icon: FileCheck2,
    status: "Verified",
    accent: "bg-emerald-500",
    accentSoft: "bg-emerald-500/10",
    accentText: "text-emerald-600",
  },
];

const LOG = [
  {
    actor: "Officer A",
    action: "Verified Parcel P1024",
    time: "2m ago",
  },
  {
    actor: "Officer B",
    action: "Approved Award",
    time: "15m ago",
  },
  {
    actor: "Finance",
    action: "Payment credited",
    time: "1h ago",
  },
  {
    actor: "System",
    action: "New version uploaded",
    time: "3h ago",
  },
];

export function DocumentVaultWidget() {
  return (
    <div>
      {/* =========================================
          DOCUMENT STACK
      ========================================== */}

      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="relative mb-6 flex h-[132px] items-center justify-center"
      >
        {DOCUMENTS.map((doc, i) => {
          const Icon = doc.icon;

          const offset =
            i - (DOCUMENTS.length - 1) / 2;

          const isLatest =
            i === DOCUMENTS.length - 1;

          return (
            <motion.div
              key={doc.version}
              variants={{
                rest: {
                  x: offset * 22,
                  y: -Math.abs(offset) * 6,
                  rotate: offset * 5,
                  zIndex:
                    DOCUMENTS.length -
                    Math.abs(i - 1),
                },

                hover: {
                  x: offset * 82,
                  y: -14,
                  rotate: offset * 3,
                  zIndex:
                    DOCUMENTS.length -
                    Math.abs(i - 1),
                },
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 20,
              }}
              className="absolute flex h-[112px] w-[94px] flex-col overflow-hidden rounded-xl border border-paper-line bg-white shadow-[0_14px_30px_-12px_rgba(0,0,0,0.18)]"
            >
              {/* =================================
                  PDF COLOR STRIP
              ================================== */}

              <div
                className={`h-1.5 w-full ${doc.accent}`}
              />

              <div className="flex flex-1 flex-col items-center justify-center px-2">
                {/* PDF icon */}
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${doc.accentSoft}`}
                >
                  <Icon
                    className={`h-5 w-5 ${doc.accentText}`}
                    strokeWidth={1.7}
                  />
                </div>

                {/* Document label */}
                <span className="mt-2 max-w-[78px] truncate text-[10px] font-semibold text-text">
                  {doc.label}
                </span>

                {/* PDF badge */}
                <div className="mt-1.5 flex items-center gap-1">
                  <File
                    className={`h-2.5 w-2.5 ${doc.accentText}`}
                    strokeWidth={2}
                  />

                  <span
                    className={`text-[8px] font-bold uppercase tracking-wider ${doc.accentText}`}
                  >
                    PDF
                  </span>
                </div>

                {/* Version */}
                <span className="mt-1 text-[8px] font-medium text-muted">
                  {doc.version}
                </span>
              </div>

              {/* Verified indicator */}
              {isLatest && (
                <div className="absolute right-2 top-3 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(47,197,127,0.12)]" />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* =========================================
          LATEST VERIFIED RECORD
      ========================================== */}

      <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.045] px-3.5 py-3.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <FileCheck2
                className="h-4.5 w-4.5 text-emerald-600"
                strokeWidth={1.7}
              />
            </div>

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                Latest record
              </p>

              <p className="mt-0.5 text-[11px] font-semibold text-text">
                Verified Title
              </p>
            </div>
          </div>

          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[8px] font-semibold text-emerald-700">
            v1.2
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-emerald-500/10 pt-2.5">
          <div>
            <p className="text-[8px] uppercase tracking-[0.12em] text-muted">
              Parcel
            </p>

            <p className="mt-0.5 text-[9px] font-semibold text-text">
              P1024 · Kondapur
            </p>
          </div>

          <div className="text-right">
            <p className="text-[8px] uppercase tracking-[0.12em] text-muted">
              Verification
            </p>

            <p className="mt-0.5 flex items-center justify-end gap-1 text-[9px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Verified
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          AUDIT ACTIVITY
      ========================================== */}

      <div className="relative h-[86px] overflow-hidden rounded-xl border border-paper-line bg-[#f4edff]">
        {/* Top fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 bg-gradient-to-b from-paper to-transparent" />

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-5 bg-gradient-to-t from-paper to-transparent" />

        {/* Activity stream */}
        <div className="animate-marquee-up flex flex-col gap-2.5 px-3.5 py-3">
          {[...LOG, ...LOG].map((entry, i) => (
            <div
              key={`${entry.actor}-${entry.time}-${i}`}
              className="flex items-center gap-2.5"
            >
              {/* Activity indicator */}
              <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>

              {/* Activity text */}
              <p className="min-w-0 flex-1 truncate text-[10px] text-text">
                <span className="font-semibold">
                  {entry.actor}
                </span>{" "}
                <span className="text-muted">
                  {entry.action}
                </span>
              </p>

              {/* Time */}
              <span className="shrink-0 text-[9px] text-muted/70">
                {entry.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          VAULT STATUS
      ========================================== */}

      <div className="mt-3 flex items-center justify-between rounded-xl border border-paper-line bg-[#f4edff] px-3.5 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10">
            <ShieldCheck
              className="h-4 w-4 text-emerald-600"
              strokeWidth={1.7}
            />
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
              Document integrity
            </p>

            <p className="text-[10px] font-semibold text-text">
              All records verified
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <LockKeyhole
            className="h-3 w-3 text-muted"
            strokeWidth={1.7}
          />

          <span className="text-[9px] font-medium text-emerald-700">
            3 versions
          </span>
        </div>
      </div>
    </div>
  );
}