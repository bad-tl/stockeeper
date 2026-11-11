
"use client";

import type { SalesDataPoint } from "@/lib/dashboard-data";

type SalesPerformanceChartProps = {
  data: SalesDataPoint[];
};

const CHART_WIDTH = 760;
const CHART_HEIGHT = 300;

const MARGIN = {
  top: 24,
  right: 72,
  bottom: 48,
  left: 72,
};

const numberFormatter = new Intl.NumberFormat("en-US");

function formatTooltipValue(value: number) {
  return numberFormatter.format(value);
}

function formatAxisValue(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }

  return value.toString();
}

export default function SalesPerformanceChart({
  data,
}: SalesPerformanceChartProps) {
  const plotWidth = CHART_WIDTH - MARGIN.left - MARGIN.right;
  const plotHeight = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;

  if (data.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-foreground">
          Sales Performance
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sales and gross profit over the selected period
        </p>

        <div className="flex min-h-[260px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No sales data available for this period.
          </p>
        </div>
      </section>
    );
  }

  const maxSales = Math.max(...data.map((point) => point.sales), 1);
  const maxProfit = Math.max(...data.map((point) => point.profit), 1);

  const salesStep = Math.ceil(maxSales / 4);
  const profitStep = Math.ceil(maxProfit / 4);

  const salesMax = salesStep * 4;
  const profitMax = profitStep * 4;

  const getX = (index: number) =>
    MARGIN.left +
    (data.length === 1
      ? plotWidth / 2
      : (index / (data.length - 1)) * plotWidth);

  const getSalesY = (value: number) =>
    MARGIN.top + plotHeight - (value / salesMax) * plotHeight;

  const getProfitY = (value: number) =>
    MARGIN.top + plotHeight - (value / profitMax) * plotHeight;

  const profitPoints = data
    .map(
      (point, index) =>
        `${getX(index)},${getProfitY(point.profit)}`,
    )
    .join(" ");

  const barWidth = Math.min(32, plotWidth / data.length / 2);

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Sales Performance
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Sales and gross profit over the selected period
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-indigo-600" />
            <span className="text-muted-foreground">Sales</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Gross profit</span>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          role="img"
          aria-label="Sales performance chart showing sales bars and gross profit line"
          className="h-auto w-full min-w-[560px] overflow-visible"
        >
          {/* Grid lines and axis labels */}
          {Array.from({ length: 5 }, (_, index) => {
            const y = MARGIN.top + (index / 4) * plotHeight;
            const salesValue = salesMax - index * salesStep;
            const profitValue = profitMax - index * profitStep;

            return (
              <g key={index}>
                <line
                  x1={MARGIN.left}
                  y1={y}
                  x2={CHART_WIDTH - MARGIN.right}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.09"
                  strokeDasharray="4 5"
                />

                <text
                  x={MARGIN.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="currentColor"
                  opacity="0.55"
                >
                  {formatAxisValue(salesValue)}
                </text>

                <text
                  x={CHART_WIDTH - MARGIN.right + 12}
                  y={y + 4}
                  textAnchor="start"
                  fontSize="11"
                  fill="currentColor"
                  opacity="0.55"
                >
                  {formatAxisValue(profitValue)}
                </text>
              </g>
            );
          })}

          {/* Sales bars */}
          {data.map((point, index) => {
            const x = getX(index);
            const y = getSalesY(point.sales);
            const height = MARGIN.top + plotHeight - y;

            return (
              <g key={point.label}>
                <rect
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={height}
                  rx="5"
                  fill="#4f46e5"
                  opacity="0.85"
                >
                  <title>
  {`${point.label}: Sales ETB ${formatTooltipValue(point.sales)}`}
</title>
                </rect>

                <text
                  x={x}
                  y={CHART_HEIGHT - 18}
                  textAnchor="middle"
                  fontSize="11"
                  fill="currentColor"
                  opacity="0.65"
                >
                  {point.label}
                </text>
              </g>
            );
          })}

          {/* Gross profit line */}
          <polyline
            points={profitPoints}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gross profit points */}
          {data.map((point, index) => (
            <circle
              key={point.label}
              cx={getX(index)}
              cy={getProfitY(point.profit)}
              r="4"
              fill="#10b981"
              stroke="white"
              strokeWidth="2"
            >
             <title>
  {`${point.label}: Gross profit ETB ${formatTooltipValue(point.profit)}`}
</title>
            </circle>
          ))}
        </svg>
      </div>

      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        <span>Sales (ETB)</span>
        <span>Gross profit (ETB)</span>
      </div>
    </section>
  );
}
