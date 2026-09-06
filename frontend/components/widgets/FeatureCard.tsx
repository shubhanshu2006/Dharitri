"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Background classes for the card surface itself, e.g. "bg-white/70" or "bg-[#E3F4FF]". */
  bgClassName?: string;
  /** Border classes for the card outline, e.g. "border-[#B8E2FA]". */
  borderClassName?: string;
  /** Border classes applied on hover, e.g. "hover:border-[#1686C9]/50". */
  hoverBorderClassName?: string;
  /** Background classes for the icon badge, e.g. "bg-[#B8E2FA]". */
  iconBgClassName?: string;
  /** Text color classes for the icon itself, e.g. "text-[#1686C9]". */
  iconColorClassName?: string;
  /** Full hover-glow classes including the `group-hover:` prefix, e.g. "group-hover:bg-[#1686C9]/15". */
  glowClassName?: string;
};

export function FeatureCard({
  icon,
  title,
  description,
  children,
  className = "",
  delay = 0,
  bgClassName = "bg-white/70",
  borderClassName = "border-paper-line",
  hoverBorderClassName = "hover:border-emerald-400/50",
  iconBgClassName = "bg-paper",
  iconColorClassName = "text-emerald-600",
  glowClassName = "group-hover:bg-emerald-400/15",
}: FeatureCardProps) {
  return (
    <Reveal delay={delay} className={className}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-colors duration-300 hover:shadow-[0_30px_60px_-30px_rgba(20,110,71,0.25)] sm:p-7 ${bgClassName} ${borderClassName} ${hoverBorderClassName}`}
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-transparent blur-3xl transition-colors duration-500 ${glowClassName}`}
        />

        <div className="relative z-10 mb-5 flex items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${borderClassName} ${iconBgClassName} ${iconColorClassName}`}
          >
            {icon}
          </span>
          <h3 className="font-serif text-xl text-text sm:text-2xl">{title}</h3>
        </div>

        <p className="relative z-10 mb-6 text-sm leading-relaxed text-muted">
          {description}
        </p>

        <div className="relative z-10 mt-auto">{children}</div>
      </motion.div>
    </Reveal>
  );
}
