"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

const STEP_IMAGES = [
  "/images/one.png",
  "/images/two.png",
  "/images/three.png",
  "/images/four.png",
  "/images/five.png",
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-scroll-anchor relative bg-white/90 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          kicker="How It Works"
          title={
            <>
              One parcel. One case.
              <br />
              <span className="italic text-emerald-600">
                One traceable journey.
              </span>
            </>
          }
          description="DHARITRI connects every stage of land acquisition - from proposal to possession - into a single, verifiable lifecycle."
        />

        <div className="relative mt-16">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-paper-line lg:block" />

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformOrigin: "left" }}
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 lg:block"
          />

          {/* 3 cards + 2 cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-3">
            {HOW_IT_WORKS_STEPS.map((step, i) => {
              const image = STEP_IMAGES[i];
              const isFirstRow = i < 3;

              return (
                <Reveal
                  key={step.id}
                  delay={i * 0.1}
                  className={`min-w-0 ${i < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="group relative flex h-full min-h-[330px] w-full min-w-0 overflow-hidden rounded-2xl border border-paper-line bg-black shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-all duration-500 hover:border-emerald-400/60 hover:shadow-[0_24px_50px_-25px_rgba(20,110,71,0.35)]"
                  >
                    {/* Background image */}
                    <div
                      aria-hidden
                      className={`absolute inset-0 scale-100 bg-center bg-no-repeat transition-all duration-700 ease-out group-hover:scale-105 group-hover:blur-[3px] ${
                        isFirstRow
                          ? "bg-[length:100%_100%]"
                          : "bg-contain lg:bg-cover"
                      }`}
                      style={{
                        backgroundImage: `url("${image}")`,
                      }}
                    />

                    {/* Base image readability layer */}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-black/10 transition-all duration-500 group-hover:bg-black/45"
                    />

                    {/* Content */}
                    <div className="relative z-10 flex min-h-[330px] w-full min-w-0 flex-col p-6">

                      {/* Hover-only content */}
                      <div className="mt-auto min-w-0 translate-y-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <h3 className="font-serif text-2xl text-white drop-shadow-lg break-words">
                          {step.title}
                        </h3>

                        <p className="mt-3 max-w-full break-words text-sm leading-relaxed text-white/85 drop-shadow-md">
                          {step.description}
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-emerald-300"></div>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}