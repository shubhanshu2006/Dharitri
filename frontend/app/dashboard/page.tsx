"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import {
  FolderKanban,
  MapPin,
  DollarSign,
  CheckCircle,
  TrendingUp,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";
import { useNationalDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { data: metrics } = useNationalDashboard();
  const { data: projectsData } = useProjects({ limit: 3 });
  const projects = projectsData?.data ?? [];
  const totalProjects = metrics?.projects.total ?? 0;
  const totalParcels = metrics?.parcels.total ?? 0;
  const verifiedCases = metrics?.verification?.verified ?? 0;
  const creditedAmount = metrics?.payments.creditedAmount ?? 0;
  const verifiedPercentage = totalParcels
    ? Math.round((verifiedCases / totalParcels) * 100)
    : 0;
  const creditedInCrores = creditedAmount / 10_000_000;

  const stats = [
    {
      label: "Total Projects",
      value: totalProjects.toLocaleString(),
      change: "Projects in your workspace",
      icon: <FolderKanban className="w-6 h-6" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      permission: Permission.PROJECT_VIEW,
    },
    {
      label: "Total Parcels",
      value: totalParcels.toLocaleString(),
      change: "Parcels across projects",
      icon: <MapPin className="w-6 h-6" />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      permission: Permission.PARCEL_VIEW,
    },
    {
      label: "Compensation Paid",
      value: `₹${creditedInCrores.toFixed(1)} Cr`,
      change: "Total credited payments",
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      permission: Permission.COMPENSATION_VIEW,
    },
    {
      label: "Verified Cases",
      value: verifiedCases.toLocaleString(),
      change: `${verifiedPercentage}% of total parcels`,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      permission: Permission.VERIFICATION_VIEW,
    },
  ];

  return (
    <div className="space-y-8 font-sans max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-paper-line/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider">
              National Intelligence Portal
            </span>
          </div>
          <h1 className="text-3xl font-bold text-text tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            Real-time telemetry, land acquisition milestones, and statutory financial disbursements across projects.
          </p>
        </div>
        <CanView permission={Permission.PROJECT_CREATE}>
          <Link href="/dashboard/projects/new">
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              className="shadow-sm hover:shadow-md"
            >
              New Project
            </Button>
          </Link>
        </CanView>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <CanView key={index} permission={stat.permission}>
            <div className="group relative bg-white rounded-2xl p-5 border border-paper-line/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-emerald-200 transition-all duration-200 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-text tracking-tight mb-2 font-sans">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div
                  className={`${stat.bg} ${stat.color} p-3 rounded-xl shadow-2xs border border-paper-line/50 transition-transform group-hover:scale-105 duration-200`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          </CanView>
        ))}
      </div>

      {/* Recent Activity & Action items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CanView permission={Permission.PROJECT_VIEW}>
          <div className="bg-white rounded-2xl border border-paper-line/90 shadow-xs p-6">
            <div className="flex items-center justify-between pb-4 border-b border-paper-line/70 mb-4">
              <div>
                <h3 className="text-base font-semibold text-text tracking-tight">Recent Projects</h3>
                <p className="text-xs text-muted mt-0.5">Active infrastructure and road corridors</p>
              </div>
              <Link href="/dashboard/projects" className="text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline">
                View all &rarr;
              </Link>
            </div>
            <div className="space-y-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-paper-line/60 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-150 group"
                >
                  <div>
                    <p className="font-semibold text-text text-sm tracking-tight group-hover:text-emerald-900">
                      {project.name}
                    </p>
                    <p className="text-xs font-mono text-muted mt-0.5">{project.code}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100/70 border border-emerald-200/80 text-emerald-800 text-xs font-medium rounded-full">
                    {project.status.replace(/_/g, " ")}
                  </span>
                </Link>
              ))}
              {projects.length === 0 && (
                <div className="py-8 text-center text-sm text-muted">
                  No projects recorded yet.
                </div>
              )}
            </div>
          </div>
        </CanView>

        <div className="bg-white rounded-2xl border border-paper-line/90 shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 border-b border-paper-line/70 mb-4">
            <div>
              <h3 className="text-base font-semibold text-text tracking-tight">Priority Actions</h3>
              <p className="text-xs text-muted mt-0.5">Statutory approvals requiring immediate review</p>
            </div>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-md border border-amber-200">
              3 Pending
            </span>
          </div>
          <div className="space-y-3">
            {[
              { title: "Verification field report review", ref: "PRJ-2026-001 • Parcel #48-A", priority: "High Priority" },
              { title: "Statutory compensation award signoff", ref: "PRJ-2026-002 • Parcel #12", priority: "Action Required" },
              { title: "e-Kuber payment clearance queue", ref: "Award AW-2026-004", priority: "Pending" },
            ].map((action, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-xl border border-paper-line/60 bg-paper/30 hover:bg-paper-dim/60 transition-colors"
              >
                <div>
                  <p className="font-medium text-text text-sm tracking-tight">{action.title}</p>
                  <p className="text-xs text-muted mt-0.5">{action.ref}</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-100/80 text-amber-800 border border-amber-200 text-xs font-medium rounded-full">
                  {action.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
