"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, PlayCircle } from "lucide-react";
import type { ReactNode } from "react";
import { HERO_CATEGORIES, HERO_MARKERS } from "@/lib/constants";
import { CATEGORY_ICONS } from "@/lib/icons";
import { PillButton } from "@/components/ui/PillButton";

type InfraBannerProps = {
  id?: string;
  as?: "section" | "div";
  className?: string;
  contentClassName?: string;
  imageUrl: string;
  fallbackGradient: string;
  kicker?: string;
  heading: ReactNode;
  headingTag?: "h1" | "h2";
  headingClassName?: string;
  kickerClassName?: string;
  descriptionClassName?: string;
  descriptionOverlay?: boolean;
  secondaryButtonClassName?: string;
  /** Applied to the text content wrapper so it cascades to kicker, description, buttons and category labels. */
  contentFontClassName?: string;
  description: string;
  buttonId?: string;
  showMarkers?: boolean;
  showCategories?: boolean;
  centerContent?: boolean;
  /** Renders a left-to-right dark scrim over the photo so overlaid text stays legible. */
  overlay?: boolean;
  /** Tightens vertical padding/spacing for a shorter banner. */
  compact?: boolean;
};

export function InfraBanner({
  id,
  as = "div",
  className = "",
  contentClassName = "",
  imageUrl,
  fallbackGradient,
  kicker,
  kickerClassName,
  heading,
  headingTag = "h2",
  headingClassName,
  contentFontClassName = "",
  description,
  descriptionClassName,
  secondaryButtonClassName,
  buttonId,
  showMarkers = true,
  showCategories = true,
  centerContent = false,
  descriptionOverlay = false,
  overlay = false,
  compact = false,
}: InfraBannerProps) {
  const Wrapper = as;
  const Heading = headingTag;

  const defaultHeadingClassName = `font-serif ${compact ? "text-4xl sm:text-5xl md:text-6xl" : "text-5xl sm:text-6xl md:text-7xl"} leading-[1.05] tracking-tight text-cream-muted drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)]`;
  const resolvedHeadingClassName = headingClassName ?? defaultHeadingClassName;

  return (
    <Wrapper
      id={id}
      className={`relative flex items-center overflow-hidden bg-ink ${className}`}
    >
      {/* Background photograph, shown as-is — no filters, no overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${imageUrl}'), ${fallbackGradient}` }}
      />

      {/* Scrim so overlaid text stays readable against the photo */}
      {overlay && (
        <div className="absolute inset-0 bg-linear-to-r from-ink/90 via-ink/55 to-ink/10 sm:from-ink/85 sm:via-ink/40 sm:to-transparent" />
      )}

      {descriptionOverlay && (
        <div className="absolute left-1/2 top-[46%] h-16 w-[85%] -translate-x-1/2 bg-linear-to-r from-white via-white to-white blur-2xl" />
      )}

      {/* Decorative animated map markers */}
      {showMarkers && (
        <div className="absolute inset-0 hidden lg:block">
          {HERO_MARKERS.map((marker, i) => (
            <motion.div
              key={marker.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
              className="absolute flex flex-col items-center gap-2"
              style={{ top: marker.top, left: marker.left }}
            >
              <span className="whitespace-nowrap rounded-full border border-white/15 bg-ink/60 px-3 py-1 text-[11px] font-medium tracking-wide text-cream/90">
                {marker.label}
              </span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-400" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_2px_rgba(79,219,146,0.9)]" />
              </span>
            </motion.div>
          ))}

          {/* Highlighted parcel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.7 }}
            className="absolute h-20 w-28 rounded-md border-2 border-dashed border-emerald-400/80"
            style={{ top: "38%", left: "38%" }}
          >
            <MapPin className="absolute -top-6 left-1/2 h-5 w-5 -translate-x-1/2 text-emerald-400 drop-shadow-[0_0_8px_rgba(79,219,146,0.9)]" />
          </motion.div>
        </div>
      )}

      <div
        className={`relative z-10 w-full px-6 sm:px-10 lg:px-16 ${compact ? "py-10 sm:py-12" : "py-16"} ${centerContent ? "mx-auto max-w-6xl flex flex-col items-center text-center" : ""} ${contentClassName}`}
      >
        <div
          className={`max-w-3xl ${contentFontClassName} ${centerContent ? "flex flex-col items-center" : ""}`}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`${kickerClassName ?? "inline-block text-xs font-semibold uppercase tracking-[0.35em] text-cream-muted drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"} ${compact ? "mb-3" : "mb-6"}`}
          >
            {kicker}
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Heading className={resolvedHeadingClassName}>{heading}</Heading>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`${descriptionClassName ?? "max-w-lg text-base leading-relaxed text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-lg"} ${compact ? "mt-4" : "mt-6"}`}
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className={`flex flex-wrap items-center gap-4 ${compact ? "mt-6" : "mt-9"} ${centerContent ? "justify-center" : ""}`}
          >
            <PillButton
              id={buttonId}
              href="/login"
              icon={
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              }
            >
              Get Started
            </PillButton>
            <PillButton
              href="#how-it-works"
              variant="outline"
              className={secondaryButtonClassName}
              icon={
                <PlayCircle className="h-4 w-4 text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
              }
            >
              See How It Works
            </PillButton>
          </motion.div>

          {showCategories && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className={`grid grid-cols-2 gap-x-8 border-t border-white/10 sm:grid-cols-4 ${compact ? "mt-8 gap-y-4 pt-5" : "mt-14 gap-y-6 pt-8"}`}
            >
              {HERO_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.label];
                return (
                  <div key={cat.label} className="flex flex-col gap-2">
                    <Icon
                      className="h-5 w-5 text-emerald-300"
                      strokeWidth={1.6}
                    />
                    <div>
                      <p className="text-sm font-semibold text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                        {cat.label}
                      </p>
                      <p className="text-xs text-cream-muted drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                        {cat.sub}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
