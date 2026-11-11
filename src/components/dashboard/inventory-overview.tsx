
import { AlertTriangle, Package, Wallet } from "lucide-react";


import {
  inventorySummary,
  stockStatusData,
} from "@/lib/dashboard-data";

const statusStyles = {
  emerald: {
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  amber: {
    dot: "bg-amber-500",
    bar: "bg-amber-500",
  },
  red: {
    dot: "bg-red-500",
    bar: "bg-red-500",
  },
};

const formatETB = (value: number) =>
  `ETB ${value.toLocaleString("en-US")}`;

export default function InventoryOverview() {
  const totalProducts = stockStatusData.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {/* Inventory Health */}
      <article className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Inventory Health
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Current stock status across your products
            </p>
          </div>

          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Package size={20} />
          </div>
        </div>

        <div className="mt-7">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {totalProducts.toLocaleString("en-US")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Total products
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Stock distribution
            </p>
          </div>

          {/* Stock distribution bar */}
          <div
            className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-muted"
            role="img"
            aria-label={stockStatusData
              .map(
                (item) =>
                  `${item.quantity} ${item.label.toLowerCase()}`,
              )
              .join(", ")}
          >
            {stockStatusData.map((item) => (
              <div
                key={item.label}
                className={statusStyles[item.color].bar}
                style={{
                  width: `${(item.quantity / totalProducts) * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Stock status details */}
          <div className="mt-6 space-y-5">
            {stockStatusData.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`size-2.5 rounded-full ${statusStyles[item.color].dot}`}
                  />

                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    {item.quantity}
                  </span>

                  <span className="w-12 text-right text-xs text-muted-foreground">
                    {((item.quantity / totalProducts) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Inventory Valuation */}
      <article className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Inventory Valuation
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Estimated value of your current stock
            </p>
          </div>

          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Wallet size={20} />
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-medium text-muted-foreground">
            Total inventory value
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {formatETB(inventorySummary.inventoryValue)}
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            Based on illustrative sample inventory costs
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package size={16} />
              <span className="text-xs">Total products</span>
            </div>

            <p className="mt-2 text-xl font-bold text-foreground">
              {inventorySummary.totalProducts.toLocaleString("en-US")}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle size={16} />
              <span className="text-xs">Total units</span>
            </div>

            <p className="mt-2 text-xl font-bold text-foreground">
              {inventorySummary.totalUnits.toLocaleString("en-US")}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
