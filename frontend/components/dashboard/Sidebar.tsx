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
} from "lucide-react";

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
    icon: <LayoutDashboard className="w-5 h-5" />,
    permission: Permission.DASHBOARD_VIEW,
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: <FolderKanban className="w-5 h-5" />,
    permission: Permission.PROJECT_VIEW,
  },
  {
    label: "GIS & Maps",
    href: "/dashboard/gis",
    icon: <Map className="w-5 h-5" />,
    permission: Permission.GIS_VIEW,
  },
  {
    label: "Parcels",
    href: "/dashboard/parcels",
    icon: <MapPin className="w-5 h-5" />,
    permission: Permission.PARCEL_VIEW,
  },
  {
    label: "Verification",
    href: "/dashboard/verification",
    icon: <CheckCircle className="w-5 h-5" />,
    permission: Permission.VERIFICATION_VIEW,
  },
  {
    label: "Compensation",
    href: "/dashboard/compensation",
    icon: <DollarSign className="w-5 h-5" />,
    permission: Permission.COMPENSATION_VIEW,
  },
  {
    label: "R&R",
    href: "/dashboard/rr",
    icon: <Home className="w-5 h-5" />,
    permission: Permission.RR_VIEW,
  },
  {
    label: "Beneficiaries",
    href: "/dashboard/beneficiaries",
    icon: <Users className="w-5 h-5" />,
    permission: Permission.BENEFICIARY_VIEW,
  },
  {
    label: "Documents",
    href: "/dashboard/documents",
    icon: <FileText className="w-5 h-5" />,
    permission: Permission.DOCUMENT_VIEW,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: <Bell className="w-5 h-5" />,
    permission: Permission.NOTIFICATION_VIEW,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    permission: Permission.ANALYTICS_VIEW,
  },
  {
    label: "AI Insights",
    href: "/dashboard/ai",
    icon: <Sparkles className="w-5 h-5" />,
    permission: Permission.AI_DECISION_SUPPORT_VIEW,
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
    <aside className="w-64 bg-white border-r border-paper-line flex flex-col">
      {/* Logo */}
      <div className="h-16 px-6 flex items-center border-b border-paper-line">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="font-semibold text-lg text-text font-[family-name:var(--font-instrument-sans)]">
            DHARITRI
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <div className="space-y-1">
          {visibleNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-sm"
                    : "text-muted hover:bg-paper-dim hover:text-text"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-paper-line">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            pathname === "/dashboard/settings"
              ? "bg-emerald-50 text-emerald-700"
              : "text-muted hover:bg-paper-dim hover:text-text"
          )}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
