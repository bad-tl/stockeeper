
import Link from "next/link";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  PackagePlus,
  ShoppingCart,
  Truck,
  type LucideIcon,
} from "lucide-react";

export type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: "product" | "sale" | "purchase" | "report";
  href?: string;
  disabled?: boolean;
  availabilityLabel?: string;
  permission?: string;
};

type QuickActionsProps = {
  actions: QuickAction[];
};

const iconMap: Record<QuickAction["icon"], LucideIcon> = {
  product: PackagePlus,
  sale: ShoppingCart,
  purchase: Truck,
  report: ChartNoAxesCombined,
};

const iconStyles: Record<QuickAction["icon"], string> = {
  product: "bg-indigo-50 text-indigo-600",
  sale: "bg-emerald-50 text-emerald-600",
  purchase: "bg-amber-50 text-amber-600",
  report: "bg-blue-50 text-blue-600",
};

function ActionContent({
  action,
}: {
  action: QuickAction;
}) {
  const Icon = iconMap[action.icon];

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconStyles[action.icon]}`}
        >
          <Icon size={19} aria-hidden="true" />
        </div>

        {action.disabled ? (
          <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground">
            Coming soon
          </span>
        ) : (
          <ArrowUpRight
            size={17}
            className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-foreground">
          {action.title}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {action.description}
        </p>

        {action.disabled && action.availabilityLabel && (
          <p className="mt-2 text-[11px] font-medium text-muted-foreground">
            {action.availabilityLabel}
          </p>
        )}
      </div>
    </>
  );
}

export default function QuickActions({
  actions,
}: QuickActionsProps) {
  return (
    <section
      aria-labelledby="quick-actions-heading"
      className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div>
        <h2
          id="quick-actions-heading"
          className="text-base font-semibold text-foreground"
        >
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Shortcuts to your everyday business operations
        </p>
      </div>

      {actions.length === 0 ? (
        <div className="py-9 text-center">
          <p className="text-sm font-semibold text-foreground">
            No quick actions available
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Available actions will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {actions.map((action) => {
            const content = <ActionContent action={action} />;

            if (action.disabled) {
              return (
                <div
                  key={action.id}
                  aria-disabled="true"
                  className="rounded-xl border border-border bg-background/60 p-4 opacity-75"
                >
                  {content}
                </div>
              );
            }

            if (action.href) {
              return (
                <Link
                  key={action.id}
                  href={action.href}
                  className="group rounded-xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={action.id}
                className="rounded-xl border border-border bg-background p-4"
              >
                {content}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
