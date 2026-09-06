import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export function SectionHeading({
  kicker,
  title,
  description,
  align = "center",
  tone = "light",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const isDark = tone === "dark";

  return (
    <div
      className={`flex flex-col gap-4 ${
        isCenter ? "items-center text-center" : "items-start text-left"
      }`}
    >
      <Reveal>
        <span
          className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] ${
            isDark ? "text-emerald-200" : "text-emerald-600"
          }`}
        >
          <span className="h-px w-6 bg-current opacity-60" />
          {kicker}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight ${
            isDark ? "text-cream" : "text-text"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.16}>
          <p
            className={`max-w-2xl text-base sm:text-lg leading-relaxed ${
              isDark ? "text-cream-muted" : "text-muted"
            }`}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
