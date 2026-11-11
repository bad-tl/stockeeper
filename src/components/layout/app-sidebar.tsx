
import Link from "next/link";
import { Boxes, CircleHelp } from "lucide-react";
import NavLinks from "./nav-links";

export default function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden h-dvh w-[260px] min-h-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
      {/* Brand header */}
      <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
          <Boxes size={21} strokeWidth={2.2} />
        </div>

        <div>
          <p className="text-[19px] font-bold tracking-tight text-white">
            Stockeeper
          </p>
          <p className="text-[10px] tracking-wide text-sidebar-muted">
            BUSINESS MANAGEMENT
          </p>
        </div>
      </div>

      {/* Scrollable navigation */}
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-7">
        <NavLinks />
      </div>

      {/* Fixed footer */}
      <div className="shrink-0 border-t border-sidebar-border p-4">
        <Link
          href="/help"
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-sidebar-muted transition-colors hover:bg-white/10 hover:text-white"
        >
          <CircleHelp size={18} />
          <span>Help & Support</span>
        </Link>

        <div className="mt-3 rounded-xl border border-sidebar-border bg-white/5 p-3">
          <p className="text-xs font-semibold text-white">
            Stockeeper Workspace
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-sidebar-muted">
            Manage your business operations in one place.
          </p>
        </div>
      </div>
    </aside>
  );
}
