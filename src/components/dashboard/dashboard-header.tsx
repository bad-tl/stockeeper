import type { DateRange } from "@/lib/dashboard-data";

type DashboardHeaderProps = {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
};

const dateRangeOptions: { label: string; value: DateRange }[] = [
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "7days" },
  { label: "Last 30 days", value: "30days" },
  { label: "This year", value: "12months" },
];

export default function DashboardHeader({
  dateRange,
  onDateRangeChange,
}: DashboardHeaderProps) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Overview
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your business.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:items-end">
        <label
          htmlFor="dashboard-date-range"
          className="text-xs font-medium text-muted-foreground"
        >
          Reporting period
        </label>

        <select
          id="dashboard-date-range"
          value={dateRange}
          onChange={(event) =>
            onDateRangeChange(event.target.value as DateRange)
          }
          className="h-10 w-full min-w-40 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/15 sm:w-auto"
        >
          {dateRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}