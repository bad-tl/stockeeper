
import { Suspense } from "react";
import { redirect } from "next/navigation";
import AppShell from "@/components/layout/app-shell";
import DashboardOverview from "@/components/dashboard/dashboard-overview";
import { getCurrentSession } from "@/lib/auth-session";

function DashboardLoading() {
  return (
    <AppShell>
      <div
        className="flex min-h-[60vh] items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-indigo-100 border-t-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your workspace...
          </p>
        </div>
      </div>
    </AppShell>
  );
}

async function ProtectedDashboard() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <AppShell>
      <DashboardOverview />
    </AppShell>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <ProtectedDashboard />
    </Suspense>
  );
}
