import {
  ArrowDownRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  Package,
  ShoppingBag,
  Wallet,
} from "lucide-react";

import type { DashboardKPI } from "@/lib/dashboard-data";

type DashboardKpisProps = {
  kpis: DashboardKPI[];
};

const iconMap = {
  sales: Wallet,
  orders: ShoppingBag,
  profit: ChartNoAxesCombined,
  inventory: Package,
};

const iconStyles = {
  sales: "bg-indigo-50 text-indigo-600",
  orders: "bg-blue-50 text-blue-600",
  profit: "bg-emerald-50 text-emerald-600",
  inventory: "bg-amber-50 text-amber-600",
};

export default function DashboardKpis({ kpis }: DashboardKpisProps) {
  return (
    <section
      aria-label="Business key performance indicators"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {kpis.map((kpi) => {
        const Icon = iconMap[kpi.icon];
        const isPositive = kpi.change >= 0;

        return (
          <article
            key={kpi.title}
            className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                  {kpi.value}
                </h2>
              </div>

              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconStyles[kpi.icon]}`}
              >
                <Icon size={21} strokeWidth={1.9} />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${
                  isPositive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}

                {Math.abs(kpi.change).toFixed(1)}%
              </span>

              <span className="text-xs text-muted-foreground">
                {kpi.description}
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}