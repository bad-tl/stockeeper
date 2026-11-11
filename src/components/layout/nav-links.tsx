
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  ReceiptText,
  Users,
  Truck,
  ChartNoAxesCombined,
  UserRoundCog,
  Settings,
} from "lucide-react";

type Permission =
  | "dashboard:view"
  | "products:view"
  | "inventory:view"
  | "purchases:view"
  | "suppliers:view"
  | "sales:create"
  | "customers:view"
  | "reports:view"
  | "employees:view"
  | "settings:view";

type PlaceholderRole = "OWNER" | "MANAGER" | "CASHIER";

const currentRole: PlaceholderRole = "OWNER";

const rolePermissions: Record<PlaceholderRole, Permission[]> = {
  OWNER: [
    "dashboard:view",
    "products:view",
    "inventory:view",
    "purchases:view",
    "suppliers:view",
    "sales:create",
    "customers:view",
    "reports:view",
    "employees:view",
    "settings:view",
  ],

  MANAGER: [
    "dashboard:view",
    "products:view",
    "inventory:view",
    "purchases:view",
    "suppliers:view",
    "sales:create",
    "customers:view",
    "reports:view",
  ],

  CASHIER: [
    "dashboard:view",
    "sales:create",
    "customers:view",
  ],
};

const navigation: {
  title: string;
  items: {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    permission: Permission;
  }[];
}[] = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        permission: "dashboard:view",
      },
    ],
  },
  {
    title: "INVENTORY",
    items: [
      {
        label: "Products",
        href: "/products",
        icon: Package,
        permission: "products:view",
      },
      {
        label: "Inventory",
        href: "/inventory",
        icon: Boxes,
        permission: "inventory:view",
      },
      {
        label: "Purchases",
        href: "/purchases",
        icon: ShoppingCart,
        permission: "purchases:view",
      },
      {
        label: "Suppliers",
        href: "/suppliers",
        icon: Truck,
        permission: "suppliers:view",
      },
    ],
  },
  {
    title: "SALES",
    items: [
      {
        label: "Point of Sale",
        href: "/pos",
        icon: ReceiptText,
        permission: "sales:create",
      },
      {
        label: "Customers",
        href: "/customers",
        icon: Users,
        permission: "customers:view",
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        label: "Reports",
        href: "/reports",
        icon: ChartNoAxesCombined,
        permission: "reports:view",
      },
      {
        label: "Employees",
        href: "/employees",
        icon: UserRoundCog,
        permission: "employees:view",
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        permission: "settings:view",
      },
    ],
  },
];

type NavLinksProps = {
  onNavigate?: () => void;
};

export default function NavLinks({ onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  const permissions = rolePermissions[currentRole];

  return (
    <nav className="space-y-7">
      {navigation.map((section) => {
        const visibleItems = section.items.filter((item) =>
          permissions.includes(item.permission),
        );

        if (visibleItems.length === 0) return null;

        return (
          <div key={section.title}>
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.16em] text-sidebar-muted">
              {section.title}
            </p>

            <div className="space-y-1">
              {visibleItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                      isActive
                        ? "bg-sidebar-primary text-white shadow-sm"
                        : "text-sidebar-foreground hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.8}
                      className={
                        isActive
                          ? "text-white"
                          : "text-sidebar-muted group-hover:text-white"
                      }
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
