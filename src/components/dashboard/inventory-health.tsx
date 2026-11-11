
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  PackageX,
  RefreshCw,
} from "lucide-react";

import type { StockStatus } from "@/lib/dashboard-data";

type SectionStatus = "success" | "loading" | "error";

type InventoryHealthProps = {
  data: StockStatus[];
  status?: SectionStatus;
  errorMessage?: string;
  onRetry?: () => void;
  onViewInventory?: () => void;
};

const statusStyles = {
  emerald: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    background: "bg-emerald-50",
  },
  amber: {
    dot: "bg-amber-500",
    text: "text-amber-700",
    background: "bg-amber-50",
  },
  red: {
    dot: "bg-red-500",
    text: "text-red-700",
    background: "bg-red-50",
  },
} as const;

const statusIcons = {
  emerald: CheckCircle2,
  amber: AlertTriangle,
  red: PackageX,
} as const;

function LoadingState() {
  return (
    <div className="mt-6 animate-pulse space-y-5" aria-label="Loading inventory health">
      <div className="mx-auto size-40 rounded-full border-[18px] border-muted" />
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="size-3 rounded-full bg-muted" />
          <div className="h-3 flex-1 rounded bg-muted" />
          <div className="h-3 w-12 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export default function InventoryHealth({
  data,
  status = "success",
  errorMessage = "Inventory health information could not be loaded.",
  onRetry,
  onViewInventory,
}: InventoryHealthProps) {
  const totalProducts = data.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const healthyProducts =
    data.find((item) => item.color === "emerald")?.quantity ?? 0;

  const attentionProducts = data
    .filter((item) => item.color !== "emerald")
    .reduce((total, item) => total + item.quantity, 0);

  const segments = data.filter((item) => item.quantity > 0);

 const gradient = segments.reduce(
  (result, item) => {
      const percentage =
        totalProducts > 0 ? (item.quantity / totalProducts) * 100 : 0;

      const start = result.offset;
      const end = start + percentage;

      const color =
        item.color === "emerald"
          ? "#10b981"
          : item.color === "amber"
            ? "#f59e0b"
            : "#ef4444";

      result.stops.push(`${color} ${start}% ${end}%`);
      result.offset = end;

      return result;
    },
    { stops: [] as string[], offset: 0 },
  );

  const chartBackground =
    totalProducts > 0
      ? `conic-gradient(${gradient.stops.join(", ")})`
      : "conic-gradient(#e5e7eb 0% 100%)";

  return (
    <section
      aria-labelledby="inventory-health-heading"
      className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="inventory-health-heading"
            className="text-base font-semibold text-foreground"
          >
            Inventory Health
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Current stock availability across products
          </p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Package size={20} aria-hidden="true" />
        </div>
      </div>

      {status === "loading" && <LoadingState />}

      {status === "error" && (
        <div className="py-10 text-center" role="alert">
          <AlertTriangle
            size={24}
            className="mx-auto text-red-600"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm font-semibold text-foreground">
            Unable to load inventory health
          </p>
          <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
            {errorMessage}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          )}
        </div>
      )}

      {status === "success" && totalProducts === 0 && (
        <div className="py-10 text-center">
          <Package size={25} className="mx-auto text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold text-foreground">
            No inventory data available
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Stock distribution will appear when products are added.
          </p>
        </div>
      )}

      {status === "success" && totalProducts > 0 && (
        <>
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-around">
            {/* Stock distribution chart */}
            <div
              className="relative size-40 shrink-0 rounded-full"
              style={{ background: chartBackground }}
              role="img"
              aria-label={data
                .map(
                  (item) =>
                    `${item.label}: ${item.quantity} products`,
                )
                .join(", ")}
            >
              <div className="absolute inset-[19px] flex flex-col items-center justify-center rounded-full bg-card">
                <span className="text-3xl font-bold tabular-nums text-foreground">
                  {totalProducts.toLocaleString()}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  Total products
                </span>
              </div>
            </div>

            {/* Stock categories */}
            <div className="w-full min-w-0 space-y-4 sm:max-w-[210px]">
              {data.map((item) => {
                const styles = statusStyles[item.color];
                const Icon = statusIcons[item.color];
                const percentage =
                  totalProducts > 0
                    ? (item.quantity / totalProducts) * 100
                    : 0;

                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className={`size-2.5 shrink-0 rounded-full ${styles.dot}`}
                        />
                        <span className="truncate text-xs font-medium text-muted-foreground">
                          {item.label}
                        </span>
                      </div>

                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {item.quantity.toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${styles.dot}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-[10px] tabular-nums text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>

                    <span className="sr-only">
                      <Icon aria-hidden="true" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5">
            <div>
              <p className="text-xs text-muted-foreground">
                Healthy stock
              </p>
              <p className="mt-1 text-lg font-bold tabular-nums text-emerald-600">
                {healthyProducts.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
              <p className="mt-1 text-lg font-bold tabular-nums text-amber-600">
                {attentionProducts.toLocaleString()}
              </p>
            </div>
          </div>

          {onViewInventory && (
            <button
              type="button"
              onClick={onViewInventory}
              className="mt-5 w-full rounded-lg border border-border px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View inventory
            </button>
          )}
        </>
      )}
    </section>
  );
}
