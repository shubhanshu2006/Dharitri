"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

const STAGES = [
  {
    label: "Assessed",
    amount: 4250000,
    description: "Land value assessed",
    verification: "Assessment recorded",
    verificationDetail: "Valuation verified",
  },
  {
    label: "Awarded",
    amount: 4250000,
    description: "Compensation awarded",
    verification: "Award approved",
    verificationDetail: "Compensation sanctioned",
  },
  {
    label: "Initiated",
    amount: 4250000,
    description: "Payment initiated",
    verification: "Payment initiated",
    verificationDetail: "Transfer authorized",
  },
  {
    label: "Credited",
    amount: 4250000,
    description: "Credit confirmed",
    verification: "Credit confirmed",
    verificationDetail: "Amount received",
  },
];

function formatINR(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function formatLakhs(value: number) {
  return `₹${(value / 100000).toFixed(1)}L`;
}

export function CompensationWidget() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const amount = useMotionValue(STAGES[0].amount);

  const [display, setDisplay] = useState(formatINR(STAGES[0].amount));

  /* --------------------------------
     Lifecycle animation
  -------------------------------- */

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % STAGES.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [paused]);

  /* --------------------------------
     Animated amount
  -------------------------------- */

  useEffect(() => {
    const controls = animate(amount, STAGES[active].amount, {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        setDisplay(formatINR(value));
      },
    });

    return () => controls.stop();
  }, [active, amount]);

  const currentStage = STAGES[active];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="space-y-3"
    >
      {/* =========================================
          COMPENSATION LIFECYCLE
      ========================================== */}

      <div className="relative overflow-hidden rounded-2xl border border-paper-line bg-[#eef1e9] p-4">
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

        {/* Soft glow */}
        <motion.div
          animate={{
            opacity: active === 3 ? 0.32 : 0.14,
            scale: active === 3 ? 1.15 : 1,
          }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl"
        />

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted">
              Compensation lifecycle
            </p>

            <p className="mt-1 text-xs font-semibold text-text">
              Verified payment trail
            </p>
          </div>

          <div className="rounded-full border border-paper-line bg-white/70 px-2.5 py-1 backdrop-blur-sm">
            <span className="flex items-center gap-1.5 text-[9px] font-semibold text-text">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>
        </div>

        {/* Current amount */}
        <div className="relative z-10 mt-5">
          <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted">
            {currentStage.label}
          </p>

          <motion.p
            key={active}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-0.5 font-serif text-3xl tracking-tight text-text tabular-nums"
          >
            {display}
          </motion.p>

          <p className="mt-1 text-[10px] text-muted">
            {currentStage.description}
          </p>
        </div>

        {/* =====================================
            LIFECYCLE
        ====================================== */}

        <div className="relative z-10 mt-7">
          {/* Base line */}
          <div className="absolute left-[7%] right-[7%] top-[13px] h-[2px] rounded-full bg-paper-line">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              animate={{
                width: `${(active / (STAGES.length - 1)) * 100}%`,
              }}
              transition={{
                duration: 0.65,
                ease: "easeOut",
              }}
            />
          </div>

          {/* Stages */}
          <div className="relative flex justify-between">
            {STAGES.map((stage, i) => {
              const completed = i <= active;
              const isCurrent = i === active;

              return (
                <div
                  key={stage.label}
                  className="flex w-1/4 flex-col items-center"
                >
                  {/* Node */}
                  <motion.div
                    animate={{
                      scale: isCurrent ? 1.2 : 1,
                      backgroundColor: completed ? "#2fc57f" : "#efebde",
                      borderColor: completed ? "#2fc57f" : "#d9d4c7",
                    }}
                    transition={{ duration: 0.35 }}
                    className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2"
                  >
                    {isCurrent && (
                      <motion.span
                        animate={{
                          opacity: [0.5, 0],
                          scale: [1, 2.3],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                        className="absolute inset-0 rounded-full bg-emerald-400"
                      />
                    )}

                    <span
                      className={`relative z-10 h-1.5 w-1.5 rounded-full ${
                        completed ? "bg-white" : "bg-text/20"
                      }`}
                    />
                  </motion.div>

                  {/* Stage label */}
                  <p
                    className={`mt-2 text-[9px] font-semibold transition-colors duration-300 ${
                      completed ? "text-text" : "text-muted"
                    }`}
                  >
                    {stage.label}
                  </p>

                  {/* SAME compensation amount */}
                  <p
                    className={`mt-0.5 text-[9px] tabular-nums transition-colors duration-300 ${
                      isCurrent
                        ? "font-semibold text-emerald-700"
                        : "text-muted"
                    }`}
                  >
                    {formatLakhs(stage.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================
            STAGE VERIFICATION
        ====================================== */}

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 mt-6 flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15">
              <span className="text-xs text-emerald-700">✓</span>
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
                {currentStage.verification}
              </p>

              <p className="text-[10px] font-semibold text-text">
                {currentStage.verificationDetail}
              </p>
            </div>
          </div>

          <span className="text-[9px] font-medium text-muted">
            {active + 1}/{STAGES.length}
          </span>
        </motion.div>
      </div>

      {/* =========================================
          CURRENT STATUS
      ========================================== */}

      <div className="flex min-h-[54px] items-center justify-between rounded-xl border border-paper-line bg-paper px-3.5 py-2.5">
        <div>
          <p className="text-xs font-semibold text-text">
            {currentStage.label}
          </p>

          <p className="text-[11px] text-muted">
            {currentStage.description} · {formatLakhs(currentStage.amount)}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {STAGES.map((_, i) => (
            <motion.span
              key={i}
              animate={{
                width: i === active ? 14 : 5,
                opacity: i <= active ? 1 : 0.35,
              }}
              transition={{ duration: 0.3 }}
              className="h-1 rounded-full bg-emerald-500"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
