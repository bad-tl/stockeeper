
import {
  AlertTriangle,
  Boxes,
  Calculator,
  Package,
  RefreshCw,
  Wallet,
} from "lucide-react";

type InventoryValuationData = {
  inventoryValue: number;
  totalUnits: number;
  totalProducts: number;
};

type SectionStatus = "success" | "loading" | "error";

type InventoryValuationProps = {
  data: InventoryValuationData;
  status?: SectionStatus;
  errorMessage?: string;
  onRetry?: () => void;
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
    <div className="mt-6 animate-pulse space-y-5" aria-label="Loading inventory valuation">
      <div className="h-8 w-2/3 rounded bg-muted" />
      <div className="h-4 w-1/2 rounded bg-muted" />
      <div className="grid grid-cols-2 gap-3 pt-3">
        <div className="h-20 rounded-lg bg-muted" />
        <div className="h-20 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function InventoryValuation({
  data,
  status = "success",
  errorMessage = "Inventory valuation information could not be loaded.",
  onRetry,
}: InventoryValuationProps) {
  const averageValuePerUnit =
    data.totalUnits > 0
      ? data.inventoryValue / data.totalUnits
      : 0;

  return (
    <section
      aria-labelledby="inventory-valuation-heading"
      className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="inventory-valuation-heading"
            className="text-base font-semibold text-foreground"
          >
            Inventory Valuation
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Current value of your stock
          </p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Wallet size={20} aria-hidden="true" />
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
            Unable to load inventory valuation
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
              <RefreshCw size={14} aria-hidden="true" />
              Try again
            </button>
          )}
        </div>
      )}

      {status === "success" &&
        (data.totalUnits === 0 || data.totalProducts === 0) && (
          <div className="py-10 text-center">
            <Boxes
              size={25}
              className="mx-auto text-muted-foreground"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm font-semibold text-foreground">
              No inventory to value
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Inventory valuation will appear after stock is received.
            </p>
          </div>
        )}

      {status === "success" &&
        data.totalUnits > 0 &&
        data.totalProducts > 0 && (
          <>
            <div className="mt-6 rounded-xl bg-indigo-50/70 p-4">
              <p className="text-xs font-medium text-indigo-700">
                Total inventory value
              </p>

              <p className="mt-2 break-words text-2xl font-bold tracking-tight text-indigo-950 sm:text-3xl">
                {formatCurrency(data.inventoryValue)}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-indigo-700">
                <Calculator size={14} aria-hidden="true" />
                <span>Valued at moving weighted average cost</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Boxes size={16} aria-hidden="true" />
                  <span className="text-xs">Units in stock</span>
                </div>

                <p className="mt-2 text-xl font-bold tabular-nums text-foreground">
                  {data.totalUnits.toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package size={16} aria-hidden="true" />
                  <span className="text-xs">Products</span>
                </div>

                <p className="mt-2 text-xl font-bold tabular-nums text-foreground">
                  {data.totalProducts.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Average value per unit
                </p>
                <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                  {formatCurrency(averageValuePerUnit)}
                </p>
              </div>

              <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700">
                Cost valuation
              </span>
            </div>

            <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
              Inventory value represents the cost of currently held stock,
              calculated using the moving weighted average cost method.
              It is not based on selling prices.
            </p>
          </>
        )}
    </section>
  );
}
