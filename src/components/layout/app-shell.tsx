import type { ReactNode } from "react";
import AppSidebar from "./app-sidebar";
import AppHeader from "./app-header";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <div className="min-h-screen lg:pl-[260px]">
        <AppHeader />

        <main className="min-h-[calc(100vh-76px)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}