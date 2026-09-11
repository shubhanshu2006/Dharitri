"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Search } from "lucide-react";
import { useCurrentUser } from "@/hooks/useUser";
import { RoleBadge } from "@/components/auth/RoleBadge";
import { NotificationBell } from "@/components/notifications";

export function Header() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { data: dharitriUser, isLoading: dharitriLoading } = useCurrentUser();

  return (
    <header
      className="h-18 bg-white/90 backdrop-blur-md border-b border-paper-line/80 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-10 font-sans"
      role="banner"
    >
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <label htmlFor="global-search" className="sr-only">
            Search projects, parcels, and cases
          </label>
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/70"
            aria-hidden="true"
          />
          <input
            id="global-search"
            type="search"
            placeholder="Search projects, survey numbers, parcels..."
            className="w-full pl-10 pr-12 py-2 rounded-xl border border-paper-line bg-paper/60 hover:bg-paper focus:bg-white text-text focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 transition-all text-[13.5px] placeholder:text-muted/60"
            aria-label="Search projects, parcels, and cases"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-muted bg-paper-dim border border-paper-line rounded-md">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Environment Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Production Node</span>
        </div>

        {/* Notifications */}
        <NotificationBell />

        <div className="h-6 w-[1px] bg-paper-line hidden sm:block" />

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          {clerkLoaded && !dharitriLoading && dharitriUser && (
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-text tracking-tight">
                {dharitriUser.name || clerkUser?.emailAddresses[0]?.emailAddress}
              </p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                {dharitriUser.roles?.slice(0, 1).map((role) => (
                  <RoleBadge key={role} role={role} size="sm" />
                ))}
              </div>
            </div>
          )}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-white",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
