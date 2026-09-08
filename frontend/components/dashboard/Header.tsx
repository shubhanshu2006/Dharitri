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
      className="h-16 bg-white border-b border-paper-line px-6 flex items-center justify-between"
      role="banner"
    >
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <label htmlFor="global-search" className="sr-only">
            Search projects, parcels, and cases
          </label>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
            aria-hidden="true"
          />
          <input
            id="global-search"
            type="search"
            placeholder="Search projects, parcels, cases..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-paper-line bg-paper focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            aria-label="Search projects, parcels, and cases"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notifications */}
        <NotificationBell />

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          {clerkLoaded && !dharitriLoading && dharitriUser && (
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-text">
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
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
