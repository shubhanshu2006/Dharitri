"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

type Bottleneck = {
  label: string;
  value: number;
  max: number;
};

type RiskLevel = {
  score: number;
  label: "Low" | "Medium" | "High";
  color: string;
  description: string;
  bottlenecks: Bottleneck[];
};

const RISK_LEVELS: RiskLevel[] = [
  {
    score: 22,
    label: "Low",
    color: "#2fc57f",
    description: "Minor acquisition delays detected",
    bottlenecks: [
      {
        label: "Ownership",
        value: 8,
        max: 35,
      },
      {
        label: "Compensation",
        value: 4,
        max: 20,
      },
      {
        label: "Field verify",
        value: 2,
        max: 10,
      },
      {
        label: "Other",
        value: 1,
        max: 5,
      },
    ],
  },
  {
    score: 58,
    label: "Medium",
    color: "#f2b134",
    description: "Several parcels require intervention",
    bottlenecks: [
      {
        label: "Ownership",
        value: 20,
        max: 35,
      },
      {
        label: "Compensation",
        value: 12,
        max: 20,
      },
      {
        label: "Field verify",
        value: 6,
        max: 10,
      },
      {
        label: "Other",
        value: 3,
        max: 5,
      },
    ],
  },
  {
    score: 87,
    label: "High",
    color: "#c96a3e",
    description: "Ownership issues may delay acquisition",
    bottlenecks: [
      {
        label: "Ownership",
        value: 30,
        max: 35,
      },
      {
        label: "Compensation",
        value: 18,
        max: 20,
      },
      {
        label: "Field verify",
        value: 9,
        max: 10,
      },
      {
        label: "Other",
        value: 4,
        max: 5,
      },
    ],
  },
];

export function RiskDashboardWidget() {
  const [levelIndex, setLevelIndex] = useState(0);

  const score = useMotionValue(RISK_LEVELS[0].score);

  const [displayScore, setDisplayScore] = useState(RISK_LEVELS[0].score);

  const rotation = useTransform(score, [0, 100], [-90, 90]);

  /* =========================================
     RISK LEVEL CYCLING
  ========================================== */

  useEffect(() => {
    const interval = setInterval(() => {
      setLevelIndex((prev) => (prev + 1) % RISK_LEVELS.length);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  /* =========================================
     SCORE ANIMATION
  ========================================== */

  useEffect(() => {
    const controls = animate(score, RISK_LEVELS[levelIndex].score, {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        setDisplayScore(Math.round(value));
      },
    });

    return () => controls.stop();
  }, [levelIndex, score]);

  const level = RISK_LEVELS[levelIndex];

  const totalAffected = level.bottlenecks.reduce(
    (total, item) => total + item.value,
    0,
  );

  const primaryBottleneck = level.bottlenecks.reduce((largest, current) =>
    current.value > largest.value ? current : largest,
  );

  return (
    <div>
      {/* =========================================
          RISK INTELLIGENCE CANVAS
      ========================================== */}

      <div className="relative overflow-hidden rounded-2xl border border-paper-line bg-[#eef1e9] px-4 py-3">
        {/* Background texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 20% 30%,
                rgba(47,197,127,0.12) 0 1px,
                transparent 1px
              ),
              radial-gradient(
                circle at 80% 70%,
                rgba(21,32,27,0.07) 0 1px,
                transparent 1px
              ),
              repeating-linear-gradient(
                135deg,
                transparent 0px,
                transparent 15px,
                rgba(21,32,27,0.025) 16px,
                transparent 17px
              )
            `,
            backgroundSize: "20px 20px, 26px 26px, auto",
          }}
        />

        {/* Dynamic glow */}
        <motion.div
          animate={{
            backgroundColor: level.color,
            opacity:
              level.label === "High"
                ? 0.16
                : level.label === "Medium"
                  ? 0.1
                  : 0.07,
          }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full blur-3xl"
        />

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted">
              Acquisition risk
            </p>

            <p className="mt-0.5 text-xs font-semibold text-text">
              Delay intelligence
            </p>
          </div>

          {/* Live indicator */}
          <div className="rounded-full border border-paper-line bg-white/70 px-2.5 py-1 backdrop-blur-sm">
            <span className="flex items-center gap-1.5 text-[9px] font-semibold text-text">
              <motion.span
                animate={{
                  opacity: [1, 0.4, 1],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                }}
                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              />
              Live
            </span>
          </div>
        </div>

        {/* =====================================
            SCORE + GAUGE
        ====================================== */}

        <div className="relative z-10 mt-3 flex items-center gap-4">
          {/* Gauge */}
          <div className="relative h-[68px] w-[125px] shrink-0">
            <svg
              viewBox="0 0 125 68"
              className="h-full w-full overflow-visible"
              aria-hidden
            >
              {/* Base arc */}
              <path
                d="M 10 58 A 52 52 0 0 1 115 58"
                fill="none"
                stroke="#e2ddcc"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Active arc */}
              <motion.path
                d="M 10 58 A 52 52 0 0 1 115 58"
                fill="none"
                stroke={level.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={164}
                animate={{
                  strokeDashoffset: 164 - (displayScore / 100) * 164,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
              />
            </svg>

            {/* Needle */}
            <motion.div
              className="absolute bottom-1 left-1/2 h-[38px] w-[2px] origin-bottom rounded-full bg-ink"
              style={{
                rotate: rotation,
                translateX: "-50%",
              }}
            />

            {/* Needle center */}
            <span className="absolute bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-ink" />

            {/* Score */}
            <div className="absolute left-1/2 top-[68px] -translate-x-1/2">
              <p className="text-[10px] font-semibold text-muted">
                {displayScore}
              </p>
            </div>
          </div>

          {/* Risk information */}
          <div className="min-w-0">
            <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-muted">
              Current level
            </p>

            <motion.p
              key={level.label}
              initial={{
                opacity: 0,
                y: 4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="font-serif text-2xl"
              style={{
                color: level.color,
              }}
            >
              {level.label}
            </motion.p>

            <p className="text-[9px] text-muted">
              Risk score {displayScore}/100
            </p>
          </div>
        </div>

        {/* =====================================
            RISK DESCRIPTION
        ====================================== */}

        <motion.div
          key={level.description}
          initial={{
            opacity: 0,
            y: 4,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="relative z-10 mt-3 rounded-xl border border-paper-line bg-white/55 px-3 py-2 backdrop-blur-sm"
        >
          <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
            Assessment
          </p>

          <p className="mt-0.5 text-[9px] font-medium text-text">
            {level.description}
          </p>
        </motion.div>

        {/* =====================================
            BOTTLENECK ANALYSIS
        ====================================== */}

        <div className="relative z-10 mt-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-muted">
              Delay contributors
            </p>

            <span className="text-[8px] font-medium text-muted">
              Affected area
            </span>
          </div>

          <div className="space-y-2">
            {level.bottlenecks.map((item, i) => {
              const percentage = (item.value / item.max) * 100;

              return (
                <div key={item.label} className="flex items-center gap-2">
                  {/* Label */}
                  <span className="w-[72px] shrink-0 text-[9px] font-medium text-muted">
                    {item.label}
                  </span>

                  {/* Bar */}
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-line">
                    <motion.div
                      key={`${level.label}-${item.label}`}
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${percentage}%`,
                      }}
                      transition={{
                        duration: 0.7,
                        delay: i * 0.08,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: level.color,
                      }}
                    />
                  </div>

                  {/* Value */}
                  <motion.span
                    key={`${level.label}-${item.value}`}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="w-9 shrink-0 text-right text-[9px] font-semibold tabular-nums text-text"
                  >
                    {item.value}ha
                  </motion.span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================
            RISK SUMMARY
        ====================================== */}

        <div className="relative z-10 mt-3 flex items-center justify-between rounded-xl border border-paper-line bg-white/55 px-3 py-2 backdrop-blur-sm">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-muted">
              Primary bottleneck
            </p>

            <motion.p
              key={level.label}
              initial={{
                opacity: 0,
                y: 3,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-0.5 text-[9px] font-semibold text-text"
            >
              {primaryBottleneck.label}
            </motion.p>
          </div>

          <motion.div
            key={`${level.label}-status`}
            initial={{
              scale: 0.9,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
            }}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{
              backgroundColor: `${level.color}18`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: level.color,
              }}
            />

            <span
              className="text-[8px] font-semibold"
              style={{
                color: level.color,
              }}
            >
              {level.label} risk
            </span>
          </motion.div>
        </div>
      </div>

      {/* =========================================
          CURRENT STATUS
      ========================================== */}

      <div className="mt-2 flex min-h-[48px] items-center justify-between rounded-xl border border-paper-line bg-paper px-3.5 py-2">
        <div>
          <p className="text-[10px] font-semibold text-text">
            {level.label} acquisition risk
          </p>

          <p className="text-[9px] text-muted">
            Score {displayScore}/100 · {totalAffected}ha affected
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex items-center gap-1.5">
          {RISK_LEVELS.map((_, i) => (
            <motion.span
              key={i}
              animate={{
                width: i === levelIndex ? 14 : 5,
                opacity: i <= levelIndex ? 1 : 0.35,
              }}
              transition={{
                duration: 0.3,
              }}
              className="h-1 rounded-full"
              style={{
                backgroundColor: i <= levelIndex ? level.color : "#d9d4c7",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
