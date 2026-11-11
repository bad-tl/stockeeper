export type DateRange = "today" | "7days" | "30days" | "12months";

export type DashboardKPI = {
  title: string;
  value: string;
  change: number;
  description: string;
  icon: "sales" | "orders" | "profit" | "inventory";
};

export type SalesDataPoint = {
  label: string;
  sales: number;
  profit: number;
};

export type StockStatus = {
  label: string;
  quantity: number;
  color: "emerald" | "amber" | "red";
};

export type LowStockProduct = {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minimumStock: number;
  status: "Low stock" | "Out of stock";
};

export type RecentSale = {
  id: string;
  customer: string;
  date: string;
  amount: number;
  paymentMethod: "Cash" | "Card" | "Bank Transfer";
  status: "Completed" | "Refunded";
};

export type BestSellingProduct = {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
};

// All values below are illustrative sample data.
// They are not connected to a real business or database.

export const dashboardKpis: DashboardKPI[] = [
  {
    title: "Total Sales",
    value: "ETB 248,500",
    change: 12.5,
    description: "Compared with previous period",
    icon: "sales",
  },
  {
    title: "Total Transactions",
    value: "1,284",
    change: 8.2,
    description: "Compared with previous period",
    icon: "orders",
  },
  {
    title: "Gross Profit",
    value: "ETB 64,200",
    change: 9.4,
    description: "Compared with previous period",
    icon: "profit",
  },
  {
    title: "Inventory Value",
    value: "ETB 582,400",
    change: -2.1,
    description: "Compared with previous period",
    icon: "inventory",
  },
];

export const salesChartData: Record<DateRange, SalesDataPoint[]> = {
  today: [
    { label: "8 AM", sales: 1200, profit: 340 },
    { label: "10 AM", sales: 2800, profit: 780 },
    { label: "12 PM", sales: 4200, profit: 1150 },
    { label: "2 PM", sales: 3600, profit: 980 },
    { label: "4 PM", sales: 5900, profit: 1600 },
    { label: "6 PM", sales: 4800, profit: 1300 },
    { label: "8 PM", sales: 3200, profit: 850 },
  ],

  "7days": [
    { label: "Mon", sales: 12500, profit: 3400 },
    { label: "Tue", sales: 15800, profit: 4200 },
    { label: "Wed", sales: 11200, profit: 2900 },
    { label: "Thu", sales: 18400, profit: 5100 },
    { label: "Fri", sales: 22100, profit: 6100 },
    { label: "Sat", sales: 19800, profit: 5400 },
    { label: "Sun", sales: 16500, profit: 4500 },
  ],

  "30days": [
    { label: "Week 1", sales: 48500, profit: 13200 },
    { label: "Week 2", sales: 56200, profit: 15100 },
    { label: "Week 3", sales: 62100, profit: 17200 },
    { label: "Week 4", sales: 81800, profit: 22400 },
  ],

  "12months": [
    { label: "Jan", sales: 145000, profit: 39000 },
    { label: "Feb", sales: 158000, profit: 42000 },
    { label: "Mar", sales: 172000, profit: 46500 },
    { label: "Apr", sales: 165000, profit: 44000 },
    { label: "May", sales: 190000, profit: 52000 },
    { label: "Jun", sales: 205000, profit: 55000 },
    { label: "Jul", sales: 198000, profit: 53000 },
    { label: "Aug", sales: 218000, profit: 59000 },
    { label: "Sep", sales: 226000, profit: 61000 },
    { label: "Oct", sales: 235000, profit: 63000 },
    { label: "Nov", sales: 248500, profit: 64200 },
    { label: "Dec", sales: 0, profit: 0 },
  ],
};

export const stockStatusData: StockStatus[] = [
  { label: "In stock", quantity: 342, color: "emerald" },
  { label: "Low stock", quantity: 28, color: "amber" },
  { label: "Out of stock", quantity: 8, color: "red" },
];

export const inventorySummary = {
  totalProducts: 378,
  inventoryValue: 582400,
  totalUnits: 1846,
};

export const lowStockProducts: LowStockProduct[] = [
  {
    id: "PRD-001",
    name: "Wireless Mouse",
    sku: "ACC-001",
    currentStock: 3,
    minimumStock: 10,
    status: "Low stock",
  },
  {
    id: "PRD-002",
    name: "USB Keyboard",
    sku: "ACC-002",
    currentStock: 0,
    minimumStock: 8,
    status: "Out of stock",
  },
  {
    id: "PRD-003",
    name: "HP Laptop Charger",
    sku: "LAP-014",
    currentStock: 2,
    minimumStock: 5,
    status: "Low stock",
  },
  {
    id: "PRD-004",
    name: "HDMI Cable",
    sku: "CAB-006",
    currentStock: 0,
    minimumStock: 12,
    status: "Out of stock",
  },
  {
    id: "PRD-005",
    name: "USB Flash Drive 32GB",
    sku: "STR-009",
    currentStock: 4,
    minimumStock: 10,
    status: "Low stock",
  },
];

export const recentSales: RecentSale[] = [
  {
    id: "SL-2026-001",
    customer: "Abebe Kebede",
    date: "Nov 09, 2026 · 10:42 AM",
    amount: 12500,
    paymentMethod: "Cash",
    status: "Completed",
  },
  {
    id: "SL-2026-002",
    customer: "Hana Tesfaye",
    date: "Nov 09, 2026 · 10:18 AM",
    amount: 8750,
    paymentMethod: "Card",
    status: "Completed",
  },
  {
    id: "SL-2026-003",
    customer: "Walk-in Customer",
    date: "Nov 09, 2026 · 09:56 AM",
    amount: 4200,
    paymentMethod: "Cash",
    status: "Completed",
  },
  {
    id: "SL-2026-004",
    customer: "Dawit Bekele",
    date: "Nov 09, 2026 · 09:30 AM",
    amount: 15800,
    paymentMethod: "Bank Transfer",
    status: "Completed",
  },
  {
    id: "SL-2026-005",
    customer: "Meron Ali",
    date: "Nov 08, 2026 · 04:15 PM",
    amount: 3200,
    paymentMethod: "Cash",
    status: "Refunded",
  },
];

export const bestSellingProducts: BestSellingProduct[] = [
  {
    id: "BEST-001",
    name: "Wireless Mouse",
    category: "Accessories",
    unitsSold: 86,
    revenue: 25800,
  },
  {
    id: "BEST-002",
    name: "USB Keyboard",
    category: "Accessories",
    unitsSold: 72,
    revenue: 36000,
  },
  {
    id: "BEST-003",
    name: "HP Laptop Charger",
    category: "Computer Parts",
    unitsSold: 54,
    revenue: 43200,
  },
  {
    id: "BEST-004",
    name: "USB Flash Drive 32GB",
    category: "Storage",
    unitsSold: 48,
    revenue: 14400,
  },
  {
    id: "BEST-005",
    name: "HDMI Cable",
    category: "Accessories",
    unitsSold: 41,
    revenue: 8200,
  },
];