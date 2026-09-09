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
import { useParcels } from "@/hooks/useParcels";
import { useProjects } from "@/hooks/useProjects";

export default function DashboardPage() {
  const { data: projectsData } = useProjects({ limit: 3 });
  const { data: parcelsData } = useParcels({ limit: 1 });
  const projects = projectsData?.data ?? [];
  const totalProjects = projectsData?.pagination.total ?? 0;
  const totalParcels = parcelsData?.pagination.total ?? 0;

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
      value: "₹45.2 Cr",
      change: "+₹8.4 Cr this month",
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      permission: Permission.COMPENSATION_VIEW,
    },
    {
      label: "Verified Cases",
      value: "892",
      change: "96% completion",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      permission: Permission.VERIFICATION_VIEW,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text font-instrument-sans">
            Dashboard
          </h1>
          <p className="text-muted mt-1">
            Welcome back! Here's an overview of your land acquisition projects.
          </p>
        </div>
        <CanView permission={Permission.PROJECT_CREATE}>
          <Link href="/dashboard/projects/new">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              New Project
            </Button>
          </Link>
        </CanView>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <CanView key={index} permission={stat.permission}>
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-text mb-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-emerald-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </CanView>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CanView permission={Permission.PROJECT_VIEW}>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-paper-dim transition-colors"
                  >
                    <div>
                      <p className="font-medium text-text">
                        {project.name}
                      </p>
                      <p className="text-sm text-muted">{project.code}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      {project.status.replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
                {projects.length === 0 && (
                  <p className="p-3 text-sm text-muted">No projects found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </CanView>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-paper-dim transition-colors"
                >
                  <div>
                    <p className="font-medium text-text">
                      Verification approval required
                    </p>
                    <p className="text-sm text-muted">Project REF-2024-089</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                    Urgent
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
