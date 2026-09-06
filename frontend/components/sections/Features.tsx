import { Archive, Bell, Map, Radar, Wallet } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/widgets/FeatureCard";
import { GISParcelWidget } from "@/components/widgets/GISParcelWidget";
import { CompensationWidget } from "@/components/widgets/CompensationWidget";
import { DocumentVaultWidget } from "@/components/widgets/DocumentVaultWidget";
import { RiskDashboardWidget } from "@/components/widgets/RiskDashboardWidget";
import { AlertsFeedWidget } from "@/components/widgets/AlertsFeedWidget";

export function Features() {
  return (
    <section
      id="features"
      className="section-scroll-anchor relative bg-white/90 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          kicker="Features"
          title={
            <>
              A living console for
              <br />
              <span className="italic text-emerald-600">
                every land parcel.
              </span>
            </>
          }
          description="Not just a records viewer - each module behaves like a real, connected part of the platform. Hover and watch them respond."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <FeatureCard
            icon={<Map className="h-5 w-5" strokeWidth={1.7} />}
            title="GIS parcel intelligence"
            description="Live parcel-level status overlaid on the cadastral grid — synced continuously, not reported manually."
            className="lg:col-span-2"
            bgClassName="bg-[#F2F8FC]"
            borderClassName="border-[#C7E4F4]"
            hoverBorderClassName="hover:border-[#1686C9]/50"
            iconBgClassName="bg-[#B8E2FA]"
            iconColorClassName="text-[#1686C9]"
            glowClassName="group-hover:bg-[#1686C9]/15"
          >
            <GISParcelWidget />
          </FeatureCard>

          <FeatureCard
            icon={<Wallet className="h-5 w-5" strokeWidth={1.7} />}
            title="Verified compensation"
            description="Assessment, award, initiation and credit — tracked as distinct, auditable events."
            delay={0.08}
            bgClassName="bg-[#F3F9EC]"
            borderClassName="border-[#D0E7B8]"
            hoverBorderClassName="hover:border-[#249B63]/50"
            iconBgClassName="bg-[#BFE5A5]"
            iconColorClassName="text-[#249B63]"
            glowClassName="group-hover:bg-[#249B63]/15"
          >
            <CompensationWidget />
          </FeatureCard>

          <FeatureCard
            icon={<Archive className="h-5 w-5" strokeWidth={1.7} />}
            title="Document vault & audit trail"
            description="Every version and every action, retained and traceable — nothing overwritten, nothing lost."
            delay={0.16}
            bgClassName="bg-[#FFF7EF]"
            borderClassName="border-[#FFD0A5]"
            hoverBorderClassName="hover:border-[#FFD0A5]/50"
            iconBgClassName="bg-[#D9C4FA]"
            iconColorClassName="text-[#7438E8]"
            glowClassName="group-hover:bg-[#7438E8]/15"
          >
            <DocumentVaultWidget />
          </FeatureCard>

          <FeatureCard
            icon={<Radar className="h-5 w-5" strokeWidth={1.7} />}
            title="Predictive risk & bottlenecks"
            description="Explainable delay scoring that shows exactly which stage is holding a project back."
            delay={0.24}
            bgClassName="bg-[#F8F4FC]"
            borderClassName="border-[#E5DDF2]"
            hoverBorderClassName="hover:border-[#D8CBEA]/50"
            iconBgClassName="bg-[#FFD0A5]"
            iconColorClassName="text-[#D95724]"
            glowClassName="group-hover:bg-[#D95724]/15"
          >
            <RiskDashboardWidget />
          </FeatureCard>

          <FeatureCard
            icon={<Bell className="h-5 w-5" strokeWidth={1.7} />}
            title="Real-time alerts"
            description="Deadlines, payments, R&R milestones and flagged cases — surfaced the moment they happen."
            delay={0.32}
            bgClassName="bg-[#E0F7E8]"
            borderClassName="border-[#B9E6C8]"
            hoverBorderClassName="hover:border-[#249B63]/50"
            iconBgClassName="bg-[#B9E6C8]"
            iconColorClassName="text-[#249B63]"
            glowClassName="group-hover:bg-[#249B63]/15"
          >
            <AlertsFeedWidget />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
