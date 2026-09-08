import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
