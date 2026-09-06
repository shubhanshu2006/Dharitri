"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

import { LandCoverageWidget } from "@/components/widgets/LandCoverageWidget";
import { FasterReportingWidget } from "@/components/widgets/FasterReportingWidget";
import { CompensationImpactWidget } from "@/components/widgets/CompensationImpactWidget";
import { GovernmentIntegrationWidget } from "@/components/widgets/GovernmentIntegrationWidget";
import { AuditActivityWidget } from "@/components/widgets/AuditActivityWidget";

export function Impact() {
  return (
    <section
      id="impact"
      className="section-scroll-anchor relative overflow-hidden bg-white/90 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          kicker="Impact"
          title={
            <>
              From reactive reporting to
              <br />
              <span className="italic text-emerald-600">
                proactive monitoring.
              </span>
            </>
          }
          description="Transparency, accountability and earlier intervention - measured, not assumed."
        />

        <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-muted sm:text-base">
          Measured across land, workflow, compensation and government
          integration.
        </p>

        {/* =====================================================
            IMPACT WIDGETS
        ====================================================== */}

        <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-2">
          <Reveal delay={0.05} className="h-full">
            <LandCoverageWidget />
          </Reveal>

          <Reveal delay={0.1} className="h-full">
            <FasterReportingWidget />
          </Reveal>

          <Reveal delay={0.15} className="h-full">
            <CompensationImpactWidget />
          </Reveal>

          <Reveal delay={0.2} className="h-full">
            <GovernmentIntegrationWidget />
          </Reveal>
        </div>

        {/* =====================================================
            CONTINUOUS AUDIT
        ====================================================== */}

        <Reveal delay={0.3} className="mt-5">
          <AuditActivityWidget />
        </Reveal>
      </div>
    </section>
  );
}
