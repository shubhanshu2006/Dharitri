"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useUser";
import { Permission } from "@/lib/constants/permissions";
import {
  LayoutDashboard,
  FolderKanban,
  Map,
  FileText,
  Users,
  DollarSign,
  Home,
  CheckCircle,
  MapPin,
  Bell,
  BarChart3,
  Sparkles,
  Settings,
  Shield,
} from "lucide-react";

import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: Permission; // Optional permission required to see this item
}

const navigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    permission: Permission.DASHBOARD_VIEW,
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: <FolderKanban className="w-4 h-4" />,
    permission: Permission.PROJECT_VIEW,
  },
  {
    label: "GIS & Maps",
    href: "/dashboard/gis",
    icon: <Map className="w-4 h-4" />,
    permission: Permission.GIS_VIEW,
  },
  {
    label: "Parcels",
    href: "/dashboard/parcels",
    icon: <MapPin className="w-4 h-4" />,
    permission: Permission.PARCEL_VIEW,
  },
  {
    label: "Verification",
    href: "/dashboard/verification",
    icon: <CheckCircle className="w-4 h-4" />,
    permission: Permission.VERIFICATION_VIEW,
  },
  {
    label: "Acquisition",
    href: "/dashboard/acquisition",
    icon: <FolderKanban className="w-4 h-4" />,
    permission: Permission.ACQUISITION_VIEW,
  },
  {
    label: "Compensation",
    href: "/dashboard/compensation",
    icon: <DollarSign className="w-4 h-4" />,
    permission: Permission.COMPENSATION_VIEW,
  },
  {
    label: "R&R",
    href: "/dashboard/rr",
    icon: <Home className="w-4 h-4" />,
    permission: Permission.RR_VIEW,
  },
  {
    label: "Beneficiaries",
    href: "/dashboard/beneficiaries",
    icon: <Users className="w-4 h-4" />,
    permission: Permission.BENEFICIARY_VIEW,
  },
  {
    label: "Documents",
    href: "/dashboard/documents",
    icon: <FileText className="w-4 h-4" />,
    permission: Permission.DOCUMENT_VIEW,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: <Bell className="w-4 h-4" />,
    permission: Permission.NOTIFICATION_VIEW,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="w-4 h-4" />,
    permission: Permission.ANALYTICS_VIEW,
  },
  {
    label: "AI Insights",
    href: "/dashboard/ai",
    icon: <Sparkles className="w-4 h-4" />,
    permission: Permission.AI_DECISION_SUPPORT_VIEW,
  },
  {
    label: "Admin",
    href: "/dashboard/admin/users",
    icon: <Shield className="w-4 h-4" />,
    permission: Permission.USER_MANAGE,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();

  // Filter navigation based on user permissions
  const visibleNavigation = navigation.filter((item) => {
    if (!item.permission) return true; // No permission required
    return user?.permissions?.includes(item.permission);
  });

  return (
    <aside
      className="w-64 bg-white border-r border-paper-line/80 flex flex-col shadow-[1px_0_12px_rgba(0,0,0,0.02)] z-20 font-sans"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="h-18 px-5 flex items-center justify-between border-b border-paper-line/70 bg-paper/30">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          aria-label="DHARITRI Dashboard Home"
        >
          <div className="relative flex items-center">
            <Image
              src="/images/Dharitri.png"
              alt="DHARITRI"
              width={140}
              height={44}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
        </Link>
        <span className="flex h-2 w-2 relative" title="National Gateway Active">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-6" aria-label="Primary">
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted/80">
            Platform Menu
          </p>
          <ul className="space-y-1" role="list">
            {visibleNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-all duration-150",
                      isActive
                        ? "bg-emerald-50/90 text-emerald-900 font-semibold shadow-xs border border-emerald-200/80"
                        : "text-muted hover:bg-paper-dim/80 hover:text-text"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className={cn(
                        "transition-colors",
                        isActive ? "text-emerald-700" : "text-muted group-hover:text-text"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="tracking-tight">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Settings & System status */}
      <div className="p-3 border-t border-paper-line/70 bg-paper/20">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-all duration-150",
            pathname === "/dashboard/settings"
              ? "bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200"
              : "text-muted hover:bg-paper-dim/80 hover:text-text"
          )}
          aria-current={pathname === "/dashboard/settings" ? "page" : undefined}
        >
          <Settings className="w-4 h-4 text-muted" />
          <span className="tracking-tight">System Settings</span>
        </Link>
      </div>
    </aside>
  );
}
