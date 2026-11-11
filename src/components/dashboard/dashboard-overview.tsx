
"use client";

import { useState } from "react";
import {
  AlertCircle,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";

import DashboardHeader from "./dashboard-header";
import DashboardKpis from "./dashboard-kpis";
import SalesPerformanceChart from "./sales-performance-chart";
import LowStockAlerts from "./low-stock-alerts";
import RecentSales from "./recent-sales";
import BestSellingProducts from "./best-selling-products";
import QuickActions, { type QuickAction } from "./quick-actions";
import InventoryHealth from "./inventory-health";
import InventoryValuation from "./inventory-valuation";

import {
  dashboardKpis,
  salesChartData,
  lowStockProducts,
  recentSales,
  bestSellingProducts,
  stockStatusData,
  inventorySummary,
  type DateRange,
} from "@/lib/dashboard-data";

type DashboardStatus = "success" | "loading" | "empty" | "error";

type DashboardOverviewProps = {
  status?: DashboardStatus;
  errorMessage?: string;
  onRetry?: () => void;
};

const quickActions: QuickAction[] = [
  {
    id: "add-product",
    title: "Add Product",
    description: "Create a new product in your catalog.",
    icon: "product",
    href: "/products/new",
    disabled: true,
    availabilityLabel: "Available in the Products phase",
    permission: "products.create",
  },
  {
    id: "new-sale",
    title: "New Sale",
    description: "Open the point of sale and serve a customer.",
    icon: "sale",
    href: "/sales/new",
    disabled: true,
    availabilityLabel: "Available in the POS phase",
    permission: "sales.create",
  },
  {
    id: "receive-stock",
    title: "Receive Stock",
    description: "Record goods received from a supplier.",
    icon: "purchase",
    href: "/purchases",
    disabled: true,
    availabilityLabel: "Available in the Purchases phase",
    permission: "purchases.receive",
  },
  {
    id: "view-reports",
    title: "View Reports",
    description: "Review sales and business performance.",
    icon: "report",
    href: "/reports",
    disabled: true,
    availabilityLabel: "Available in the Reports phase",
    permission: "reports.view",
  },
];

function DashboardLoadingState() {
  return (
    <div className="mx-auto max-w-7xl space-y-7" aria-busy="true">
      <div className="animate-pulse space-y-3">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-4 w-72 max-w-full rounded bg-muted" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-xl border border-border bg-card p-5"
          >
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="mt-5 h-7 w-36 rounded bg-muted" />
            <div className="mt-5 h-3 w-40 rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
        <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
        <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
      </div>
    </div>
  );
}

function DashboardEmptyState() {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <LayoutDashboard size={30} aria-hidden="true" />
      </div>

      <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
        Your dashboard is ready
      </h1>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Your business has no dashboard activity yet. Start by adding
        products and receiving stock. Your inventory and sales insights
        will appear here as your business grows.
      </p>

      <p className="mt-5 rounded-lg border border-border bg-card px-4 py-3 text-xs leading-5 text-muted-foreground">
        This is an empty-state view. No sample or real business figures
        are currently being displayed.
      </p>
    </div>
  );
}

function DashboardErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <AlertCircle size={30} aria-hidden="true" />
      </div>

      <h1 className="mt-5 text-xl font-bold text-foreground">
        Dashboard unavailable
      </h1>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <RefreshCw size={15} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}

export default function DashboardOverview({
  status = "success",
  errorMessage = "We couldn't retrieve your dashboard information. Please try again.",
  onRetry,
}: DashboardOverviewProps) {
  const [dateRange, setDateRange] = useState<DateRange>("30days");

  if (status === "loading") {
    return <DashboardLoadingState />;
  }

  if (status === "empty") {
    return <DashboardEmptyState />;
  }

  if (status === "error") {
    return (
      <DashboardErrorState
        message={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Dashboard heading and reporting period */}
      <DashboardHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Clearly identified demonstration data */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <span
          className="mt-0.5 size-2 shrink-0 rounded-full bg-amber-500"
          aria-hidden="true"
        />

        <div>
          <p className="text-xs font-semibold text-amber-800">
            Demonstration data
          </p>

          <p className="mt-0.5 text-xs leading-5 text-amber-700">
            These figures are sample data for dashboard development.
            They are not connected to a real business or database.
          </p>
        </div>
      </div>

      {/* Key performance indicators */}
      <DashboardKpis kpis={dashboardKpis} />

      {/* Sales performance */}
      <SalesPerformanceChart data={salesChartData[dateRange]} />

      {/* Inventory health and valuation */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <InventoryHealth data={stockStatusData} />

        <InventoryValuation
          data={{
            inventoryValue: inventorySummary.inventoryValue,
            totalUnits: inventorySummary.totalUnits,
            totalProducts: inventorySummary.totalProducts,
          }}
        />
      </div>

      {/* Inventory alerts and recent transactions */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <LowStockAlerts
  products={lowStockProducts}
  summary={{
    lowStock:
      stockStatusData.find((item) => item.color === "amber")?.quantity ?? 0,
    outOfStock:
      stockStatusData.find((item) => item.color === "red")?.quantity ?? 0,
  }}
/>
        <RecentSales sales={recentSales} />
      </div>

      {/* Product performance and business shortcuts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <BestSellingProducts products={bestSellingProducts} />
        <QuickActions actions={quickActions} />
      </div>
    </div>
  );
}
