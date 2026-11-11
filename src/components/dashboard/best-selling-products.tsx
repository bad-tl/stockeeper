
"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  Package,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import type { BestSellingProduct } from "@/lib/dashboard-data";

type DashboardSectionStatus = "success" | "loading" | "error";
type SortBy = "unitsSold" | "revenue";

type BestSellingProductsProps = {
  products: BestSellingProduct[];
  status?: DashboardSectionStatus;
  errorMessage?: string;
  onRetry?: () => void;
  onViewAll?: () => void;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function LoadingState() {
  return (
    <div
      className="mt-6 space-y-5"
      aria-label="Loading best-selling products"
      aria-busy="true"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex animate-pulse items-center gap-3">
          <div className="size-9 rounded-lg bg-muted" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-2/3 rounded bg-muted" />
            <div className="h-2.5 w-1/3 rounded bg-muted" />
          </div>
          <div className="h-3 w-16 rounded bg-muted" />
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
    <div className="py-10 text-center" role="alert" aria-live="assertive">
      <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-red-50 text-red-600">
        <TrendingUp size={21} aria-hidden="true" />
      </div>

      <p className="mt-3 text-sm font-semibold text-foreground">
        Unable to load product performance
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
          <RefreshCw size={14} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}

export default function BestSellingProducts({
  products,
  status = "success",
  errorMessage = "Please try again. If the problem continues, contact your administrator.",
  onRetry,
  onViewAll,
}: BestSellingProductsProps) {
  const [sortBy, setSortBy] = useState<SortBy>("unitsSold");

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (sortBy === "revenue") {
        return b.revenue - a.revenue;
      }

      return b.unitsSold - a.unitsSold;
    });
  }, [products, sortBy]);

  const maxValue = Math.max(
    ...sortedProducts.map((product) =>
      sortBy === "unitsSold" ? product.unitsSold : product.revenue,
    ),
    1,
  );

  return (
    <section
      aria-labelledby="best-selling-heading"
      className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2
              id="best-selling-heading"
              className="text-base font-semibold text-foreground"
            >
              Best-Selling Products
            </h2>
            <Award
              size={17}
              className="text-amber-500"
              aria-hidden="true"
            />
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Products performing best in your business
          </p>
        </div>

        <div
          className="inline-flex w-fit rounded-lg border border-border bg-muted/50 p-1"
          role="group"
          aria-label="Sort products by"
        >
          <button
            type="button"
            onClick={() => setSortBy("unitsSold")}
            aria-pressed={sortBy === "unitsSold"}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              sortBy === "unitsSold"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Units sold
          </button>

          <button
            type="button"
            onClick={() => setSortBy("revenue")}
            aria-pressed={sortBy === "revenue"}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              sortBy === "revenue"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Revenue
          </button>
        </div>
      </div>

      {status === "loading" && <LoadingState />}

      {status === "error" && (
        <ErrorState message={errorMessage} onRetry={onRetry} />
      )}

      {status === "success" && sortedProducts.length === 0 && (
        <div className="py-10 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Package size={21} aria-hidden="true" />
          </div>

          <p className="mt-3 text-sm font-semibold text-foreground">
            No product sales yet
          </p>

          <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
            Product performance will appear here after sales are recorded.
          </p>
        </div>
      )}

      {status === "success" && sortedProducts.length > 0 && (
        <>
          <div className="mt-6 space-y-5">
            {sortedProducts.map((product, index) => {
              const value =
                sortBy === "unitsSold"
                  ? product.unitsSold
                  : product.revenue;

              const percentage = (value / maxValue) * 100;

              return (
                <article
                  key={product.id}
                  className="flex items-start gap-3"
                >
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      index === 0
                        ? "bg-amber-50 text-amber-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                    aria-label={`Rank ${index + 1}`}
                  >
                    {index === 0 ? (
                      <Award size={17} aria-hidden="true" />
                    ) : (
                      `#${index + 1}`
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {product.category}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold tabular-nums text-foreground">
                          {sortBy === "unitsSold"
                            ? `${product.unitsSold.toLocaleString()} units`
                            : formatCurrency(product.revenue)}
                        </p>

                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {sortBy === "unitsSold"
                            ? formatCurrency(product.revenue)
                            : `${product.unitsSold.toLocaleString()} units sold`}
                        </p>
                      </div>
                    </div>

                    <div
                      className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-label={`${product.name} relative performance`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(percentage)}
                    >
                      <div
                        className={`h-full rounded-full ${
                          index === 0 ? "bg-indigo-600" : "bg-indigo-400"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View product performance
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          )}
        </>
      )}
    </section>
  );
}
