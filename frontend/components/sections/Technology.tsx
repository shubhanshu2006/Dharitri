"use client";

import { Cpu, Layers, LayoutTemplate, LineChart, ShieldCheck } from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

import { FrontendTechnologyWidget } from "@/components/widgets/FrontendTechnologyWidget";
import { SpatialTechnologyWidget } from "@/components/widgets/SpatialTechnologyWidget";
import { ApiTechnologyWidget } from "@/components/widgets/ApiTechnologyWidget";
import { SecurityTechnologyWidget } from "@/components/widgets/SecurityTechnologyWidget";
import { AnalyticsTechnologyWidget } from "@/components/widgets/AnalyticsTechnologyWidget";

import { TECH_STACK } from "@/lib/constants";

const ICONS = [
  LayoutTemplate,
  Layers,
  Cpu,
  ShieldCheck,
  LineChart,
];

const CARD_STYLES = [
  {
    bg: "bg-[#eef9f3]",
    border: "border-[#c9ead8]",
    iconBg: "bg-[#d9f3e4]",
    iconText: "text-emerald-700",
    tag: "border-[#c9ead8] bg-white/70 text-emerald-700",
  },
  {
    bg: "bg-[#eef7fc]",
    border: "border-[#cbe4f3]",
    iconBg: "bg-[#dceff9]",
    iconText: "text-sky-700",
    tag: "border-[#cbe4f3] bg-white/70 text-sky-700",
  },
  {
    bg: "bg-[#fff8eb]",
    border: "border-[#f1dfb8]",
    iconBg: "bg-[#ffedc9]",
    iconText: "text-amber-700",
    tag: "border-[#f1dfb8] bg-white/70 text-amber-700",
  },
  {
    bg: "bg-[#f5effc]",
    border: "border-[#ded1f1]",
    iconBg: "bg-[#eadffc]",
    iconText: "text-violet-700",
    tag: "border-[#ded1f1] bg-white/70 text-violet-700",
  },
  {
    bg: "bg-[#eef9fc]",
    border: "border-[#cce7ee]",
    iconBg: "bg-[#ddf1f5]",
    iconText: "text-cyan-700",
    tag: "border-[#cce7ee] bg-white/70 text-cyan-700",
  },
];

export function Technology() {
  return (
    <section
      id="technology"
      className="section-scroll-anchor relative overflow-hidden bg-white/90 py-24 sm:py-32"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-sky-100/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          kicker="Technology"
          title={
            <>
              Built on a modern,
              <br />
              <span className="italic text-emerald-600">
                spatially-aware stack.
              </span>
            </>
          }
          description="A layered architecture designed for interoperability with authoritative government systems - GIS, records and finance alike."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {TECH_STACK.map((stack, i) => {
            const Icon = ICONS[i % ICONS.length];
            const style = CARD_STYLES[i % CARD_STYLES.length];

            const widthClass =
              i < 3 ? "lg:col-span-2" : "lg:col-span-3";

            return (
              <Reveal
                key={stack.title}
                delay={i * 0.08}
                className={`h-full ${widthClass}`}
              >
                <TechnologyCard
                  stack={stack}
                  index={i}
                  Icon={Icon}
                  style={style}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TECHNOLOGY CARD
========================================================= */

type TechnologyCardProps = {
  stack: (typeof TECH_STACK)[number];
  index: number;
  Icon: typeof LayoutTemplate;
  style: {
    bg: string;
    border: string;
    iconBg: string;
    iconText: string;
    tag: string;
  };
};

function TechnologyCard({
  stack,
  index,
  Icon,
  style,
}: TechnologyCardProps) {
  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_55px_-30px_rgba(20,110,71,0.25)] sm:p-6 ${style.bg} ${style.border}`}
    >
      {/* Moving top light */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
        <div
          className="absolute left-0 h-full w-1/3 animate-shimmer-x bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent"
          style={{
            animationDelay: `${index * 0.4}s`,
          }}
        />
      </div>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-white/60 blur-3xl transition-all duration-500 group-hover:scale-125" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/5 ${style.iconBg} ${style.iconText}`}
        >
          <Icon
            className="h-5 w-5"
            strokeWidth={1.7}
          />
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider ${style.tag}`}
        >
          {stack.tag}
        </span>
      </div>

      {/* Title */}
      <div className="relative z-10 mt-4">
        <h3 className="font-serif text-2xl tracking-tight text-slate-900">
          {stack.title}
        </h3>

        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {index === 0 &&
            "Modern interfaces for citizens, officials and administrators."}

          {index === 1 &&
            "Geospatial processing, mapping and cadastral intelligence."}

          {index === 2 &&
            "Scalable APIs and services for secure data exchange."}

          {index === 3 &&
            "Identity, access control and complete auditability."}

          {index === 4 &&
            "Analytics and machine learning for proactive decisions."}
        </p>
      </div>

      {/* =====================================================
          MOVING WIDGET
      ===================================================== */}

      <div className="relative z-10 mt-4">
        {index === 0 && <FrontendTechnologyWidget />}

        {index === 1 && <SpatialTechnologyWidget />}

        {index === 2 && <ApiTechnologyWidget />}

        {index === 3 && <SecurityTechnologyWidget />}

        {index === 4 && <AnalyticsTechnologyWidget />}
      </div>

      {/* Technology stack */}
      <div className="relative z-10 mt-3 flex flex-wrap gap-1.5">
        {stack.items.map((item, idx) => (
          <span
            key={item}
            className="rounded-full border border-black/10 bg-white/60 px-2.5 py-1 text-[10px] text-slate-600 transition-colors duration-300 group-hover:bg-white/85 group-hover:text-slate-800"
            style={{
              transitionDelay: `${idx * 30}ms`,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}