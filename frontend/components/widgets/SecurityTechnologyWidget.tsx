"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Check,
  FileCheck2,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const STEPS = [
  {
    label: "Identity",
    icon: UserRound,
  },
  {
    label: "MFA",
    icon: LockKeyhole,
  },
  {
    label: "Access",
    icon: FileCheck2,
  },
  {
    label: "Audit",
    icon: ShieldCheck,
  },
];

export function SecurityTechnologyWidget() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % STEPS.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[178px] overflow-hidden rounded-2xl border border-black/10 bg-white/80 p-3 shadow-sm">
      <div className="flex h-full gap-4">
        {/* Authentication flow */}
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-xs font-semibold text-slate-800">
            Secure access flow
          </p>

          <div className="mt-4 flex items-center justify-between">
            {STEPS.map((item, i) => {
              const Icon = item.icon;
              const completed = i <= active;

              return (
                <div
                  key={item.label}
                  className="relative flex flex-1 flex-col items-center"
                >
                  {i > 0 && (
                    <motion.div
                      animate={{
                        backgroundColor:
                          i <= active
                            ? "rgb(52 211 153)"
                            : "rgb(226 232 240)",
                      }}
                      className="absolute right-1/2 top-4 h-px w-full"
                    />
                  )}

                  <motion.div
                    animate={{
                      scale:
                        i === active
                          ? [1, 1.1, 1]
                          : 1,
                    }}
                    transition={{
                      duration: 0.8,
                      repeat:
                        i === active
                          ? Infinity
                          : 0,
                    }}
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-lg border ${
                      completed
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 ${
                        completed
                          ? "text-emerald-600"
                          : "text-slate-300"
                      }`}
                    />
                  </motion.div>

                  <span className="mt-1.5 text-[11px] text-slate-500">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          <motion.div
            key={active}
            initial={{
              opacity: 0,
              y: 4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-4 rounded-lg bg-emerald-50 px-2.5 py-2"
          >
            <div className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-emerald-600" />

              <span className="text-[11px] font-medium text-emerald-700">
                {STEPS[active].label} verified successfully
              </span>
            </div>
          </motion.div>
        </div>

        {/* Security status */}
        <div className="w-[28%] border-l border-black/5 pl-3">
          <div className="flex h-full flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-violet-600" />

              <span className="text-[11px] font-semibold text-slate-800">
                Protected
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {[
                "RBAC",
                "OAuth 2.0",
                "MFA",
                "Audit logs",
              ].map((item, i) => (
                <motion.div
                  key={item}
                  animate={{
                    opacity: i <= active ? 1 : 0.4,
                    x: i === active ? 2 : 0,
                  }}
                  className="flex items-center gap-1"
                >
                  <span className="h-1 w-1 rounded-full bg-violet-500" />

                  <span className="text-[11px] text-slate-500">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}