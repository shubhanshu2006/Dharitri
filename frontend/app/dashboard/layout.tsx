"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useCurrentUser } from "@/hooks/useUser";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect PENDING users to onboarding page
      if (user.status === "PENDING_APPROVAL") {
        router.push("/onboarding");
      }
      // Redirect REJECTED users to onboarding page (shows rejection message)
      else if (user.status === "REJECTED") {
        router.push("/onboarding");
      }
      // Only ACTIVE users can access dashboard
      else if (user.status !== "ACTIVE") {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while checking user status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if user is not active
  if (user?.status !== "ACTIVE") {
    return null;
  }

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main
          id="main-content"
          role="main"
          tabIndex={-1}
          className="flex-1 p-6 lg:p-8 overflow-auto focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
