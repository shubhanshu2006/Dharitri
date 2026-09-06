"use client";

import { motion } from "framer-motion";
import { Check, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const STAGES = [
  { label: "Assessed", amount: "₹42.5L" },
  { label: "Awarded", amount: "₹42.5L" },
  { label: "Initiated", amount: "₹42.5L" },
  { label: "Credited", amount: "₹42.5L" },
];

export function CompensationImpactWidget() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative min-h-[300px] overflow-hidden rounded-3xl border border-sky-200 bg-[#eff9ff] p-6 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-sky-300 hover:shadow-[0_30px_60px_-30px_rgba(30,120,180,0.25)] sm:p-7"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-sky-300/0 blur-3xl transition-all duration-500 group-hover:bg-sky-300/20" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <motion.span
            animate={{
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
          >
            <WalletCards className="h-5 w-5" />
          </motion.span>

          <h3 className="font-serif text-xl text-text">
            Compensation Traceability
          </h3>
        </div>

        <div className="mt-7 flex flex-col gap-5">
          <div className="flex items-end justify-between">
            <div>
              <AnimatedCounter
                value={100}
                suffix="%"
                className="font-serif text-6xl tracking-tight text-text"
              />

              <p className="mt-1 text-sm text-muted">
                Traceable compensation lifecycle
              </p>
            </div>

            <motion.div
              key={STAGES[activeStage].label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-right"
            >
              <p className="text-xs uppercase tracking-wider text-muted">
                Current stage
              </p>

              <p className="mt-1 font-serif text-xl text-emerald-700">
                {STAGES[activeStage].label}
              </p>

              <p className="text-xs text-muted">
                {STAGES[activeStage].amount}
              </p>
            </motion.div>
          </div>

          <div className="flex items-center">
            {STAGES.map((stage, i) => (
              <div
                key={stage.label}
                className="flex flex-1 items-center"
              >
                <motion.div
                  animate={{
                    scale: i === activeStage ? 1.12 : 1,
                    opacity: i <= activeStage ? 1 : 0.45,
                  }}
                  transition={{ duration: 0.35 }}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-4 ${
                    i <= activeStage
                      ? "border-emerald-100 bg-emerald-500 text-white"
                      : "border-slate-200 bg-white text-slate-300"
                  }`}
                >
                  <Check className="h-4 w-4" />
                </motion.div>

                {i < STAGES.length - 1 && (
                  <motion.div
                    animate={{
                      opacity: i < activeStage ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.4 }}
                    className="mx-1 h-0.5 flex-1 bg-emerald-400"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[10px] font-medium text-muted">
            {STAGES.map((stage) => (
              <span key={stage.label}>{stage.label}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}