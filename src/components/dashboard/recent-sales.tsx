
import {
  ArrowRight,
  CreditCard,
  ReceiptText,
  RefreshCw,
} from "lucide-react";

import type { RecentSale } from "@/lib/dashboard-data";

type DashboardSectionStatus = "success" | "loading" | "error";

type RecentSalesProps = {
  sales: RecentSale[];
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
      className="mt-6 space-y-4"
      aria-label="Loading recent sales"
      aria-busy="true"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-4"
        >
          <div className="h-4 w-20 rounded bg-muted" />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-2/3 rounded bg-muted" />
            <div className="h-2.5 w-1/3 rounded bg-muted" />
          </div>

          <div className="h-4 w-20 rounded bg-muted" />
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
        <ReceiptText size={21} aria-hidden="true" />
      </div>

      <p className="mt-3 text-sm font-semibold text-foreground">
        Unable to load recent sales
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

function SaleStatus({ status }: { status: RecentSale["status"] }) {
  const isCompleted = status === "Completed";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isCompleted
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function RecentSales({
  sales,
  status = "success",
  errorMessage = "Please try again. If the problem continues, contact your administrator.",
  onRetry,
  onViewAll,
}: RecentSalesProps) {
  return (
    <section
      aria-labelledby="recent-sales-heading"
      className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2
            id="recent-sales-heading"
            className="text-base font-semibold text-foreground"
          >
            Recent Sales
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Latest transactions from your business
          </p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <ReceiptText size={20} aria-hidden="true" />
        </div>
      </div>

      {status === "loading" && <LoadingState />}

      {status === "error" && (
        <ErrorState message={errorMessage} onRetry={onRetry} />
      )}

      {status === "success" && sales.length === 0 && (
        <div className="py-10 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <ReceiptText size={21} aria-hidden="true" />
          </div>

          <p className="mt-3 text-sm font-semibold text-foreground">
            No sales recorded yet
          </p>

          <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
            Completed transactions will appear here when your business
            starts making sales.
          </p>
        </div>
      )}

      {status === "success" && sales.length > 0 && (
        <>
          {/* Desktop transaction table */}
          <div className="mt-6 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th scope="col" className="pb-3 pr-4 font-medium">
                    Sale ID
                  </th>

                  <th scope="col" className="pb-3 pr-4 font-medium">
                    Customer
                  </th>

                  <th scope="col" className="pb-3 pr-4 font-medium">
                    Date
                  </th>

                  <th scope="col" className="pb-3 pr-4 font-medium">
                    Payment
                  </th>

                  <th scope="col" className="pb-3 pr-4 text-right font-medium">
                    Amount
                  </th>

                  <th scope="col" className="pb-3 text-right font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {sales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="whitespace-nowrap py-4 pr-4 text-xs font-semibold text-foreground">
                      {sale.id}
                    </td>

                    <td className="py-4 pr-4 text-sm font-medium text-foreground">
                      {sale.customer}
                    </td>

                    <td className="whitespace-nowrap py-4 pr-4 text-xs text-muted-foreground">
                      {sale.date}
                    </td>

                    <td className="whitespace-nowrap py-4 pr-4 text-xs text-muted-foreground">
                      {sale.paymentMethod}
                    </td>

                    <td className="whitespace-nowrap py-4 pr-4 text-right text-sm font-semibold tabular-nums text-foreground">
                      {formatCurrency(sale.amount)}
                    </td>

                    <td className="py-4 text-right">
                      <SaleStatus status={sale.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile transaction cards */}
          <div className="mt-5 space-y-3 md:hidden">
            {sales.map((sale) => (
              <article
                key={sale.id}
                className="rounded-lg border border-border p-3.5 transition-colors hover:bg-muted/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      {sale.id}
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-foreground">
                      {sale.customer}
                    </p>
                  </div>

                  <SaleStatus status={sale.status} />
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {sale.date}
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CreditCard size={13} aria-hidden="true" />
                      {sale.paymentMethod}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-bold tabular-nums text-foreground">
                    {formatCurrency(sale.amount)}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View all sales
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          )}
        </>
      )}
    </section>
  );
}
