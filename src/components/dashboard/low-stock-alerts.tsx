
import {
  AlertTriangle,
  ArrowRight,
  Package,
  PackageX,
  RefreshCw,
} from "lucide-react";

import type { LowStockProduct } from "@/lib/dashboard-data";

type DashboardSectionStatus = "success" | "loading" | "error";
type LowStockSummary = {
  lowStock: number;
  outOfStock: number;
};

type LowStockAlertsProps = {
  products: LowStockProduct[];
  summary?: LowStockSummary;
  status?: DashboardSectionStatus;
  errorMessage?: string;
  onRetry?: () => void;
  onViewAll?: () => void;
};

function LoadingState() {
  return (
    <div className="mt-6 space-y-4" aria-label="Loading low-stock alerts">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex animate-pulse items-center gap-3">
          <div className="size-10 shrink-0 rounded-lg bg-muted" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-2/3 rounded bg-muted" />
            <div className="h-2.5 w-1/3 rounded bg-muted" />
          </div>
          <div className="h-3 w-14 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="py-10 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle size={21} />
      </div>

      <p className="mt-3 text-sm font-semibold text-foreground">
        Unable to load stock alerts
      </p>

      <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}

export default function LowStockAlerts({
  products,
  summary,
  status = "success",
  errorMessage = "Please try again. If the problem continues, contact your administrator.",
  onRetry,
  onViewAll,
}: LowStockAlertsProps) {
 const outOfStockCount =
  summary?.outOfStock ??
  products.filter((product) => product.currentStock <= 0).length;

const lowStockCount =
  summary?.lowStock ??
  products.filter((product) => product.currentStock > 0).length;

  return (
    <section
      aria-labelledby="low-stock-heading"
      className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2
            id="low-stock-heading"
            className="text-base font-semibold text-foreground"
          >
            Low-Stock Alerts
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {status === "success" && products.length > 0
  ? `Showing ${products.length} of ${lowStockCount + outOfStockCount} products needing attention`
  : "Products that need your attention"}
          </p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <AlertTriangle size={20} aria-hidden="true" />
        </div>
      </div>

      {status === "success" && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-amber-100 bg-amber-50/70 px-3 py-3">
            <p className="text-xl font-bold tabular-nums text-amber-700">
              {lowStockCount}
            </p>
            <p className="mt-1 text-xs font-medium text-amber-700">
              Low stock
            </p>
          </div>

          <div className="rounded-lg border border-red-100 bg-red-50/70 px-3 py-3">
            <p className="text-xl font-bold tabular-nums text-red-700">
              {outOfStockCount}
            </p>
            <p className="mt-1 text-xs font-medium text-red-700">
              Out of stock
            </p>
          </div>
        </div>
      )}

      {status === "loading" && <LoadingState />}

      {status === "error" && (
        <ErrorState message={errorMessage} onRetry={onRetry} />
      )}

      {status === "success" && products.length === 0 && (
        <div className="py-10 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Package size={21} />
          </div>

          <p className="mt-3 text-sm font-semibold text-foreground">
            Inventory looks healthy
          </p>

          <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
            No products are currently below their minimum stock level.
          </p>
        </div>
      )}

      {status === "success" && products.length > 0 && (
        <>
          <div className="mt-5 divide-y divide-border">
            {products.map((product) => {
              const isOutOfStock = product.currentStock <= 0;
              const stockPercentage =
                product.minimumStock > 0
                  ? Math.min(
                      (product.currentStock / product.minimumStock) * 100,
                      100,
                    )
                  : 100;

              return (
                <article
                  key={product.id}
                  className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                      isOutOfStock
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {isOutOfStock ? (
                      <PackageX size={18} aria-hidden="true" />
                    ) : (
                      <Package size={18} aria-hidden="true" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {product.name}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      SKU: {product.sku}
                    </p>

                    <div
                      className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-label={`${product.name} stock compared with minimum stock`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(stockPercentage)}
                    >
                      <div
                        className={`h-full rounded-full ${
                          isOutOfStock ? "bg-red-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${stockPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className={`text-sm font-bold tabular-nums ${
                        isOutOfStock ? "text-red-600" : "text-amber-600"
                      }`}
                    >
                      {product.currentStock}
                    </p>

                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Min. {product.minimumStock}
                    </p>

                    <span
                      className={`mt-1 inline-block text-[10px] font-semibold ${
                        isOutOfStock ? "text-red-600" : "text-amber-600"
                      }`}
                    >
                      {isOutOfStock ? "Out of stock" : "Low stock"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View all inventory alerts
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          )}
        </>
      )}
    </section>
  );
}
