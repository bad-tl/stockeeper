"use client";

import { useState } from "react";
import Link from "next/link";
import UserMenu from "./user-menu";
import {
  Bell,
  Building2,
  Check,
  ChevronDown,
 
  
  Menu,
  Search,
 
  Store,

  X,
} from "lucide-react";
import NavLinks from "./nav-links";

const searchablePages = [
  { label: "Dashboard", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Inventory", href: "/inventory" },
  { label: "Purchases", href: "/purchases" },
  { label: "Suppliers", href: "/suppliers" },
  { label: "Point of Sale", href: "/pos" },
  { label: "Customers", href: "/customers" },
  { label: "Reports", href: "/reports" },
  { label: "Employees", href: "/employees" },
  { label: "Settings", href: "/settings" },
];

export default function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPages = searchablePages.filter((page) =>
    page.label.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  function closeSearch() {
    setSearchQuery("");
    setMobileSearchOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        {/* Main header row */}
        <div className="flex min-h-[76px] items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
          {/* Left section */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {/* Mobile navigation button */}
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted sm:size-10 lg:hidden"
            >
              <Menu size={20} />
            </button>

            {/* Business switcher - available on all screen sizes */}
            <details className="group relative min-w-0">
              <summary className="flex max-w-[145px] cursor-pointer list-none items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-2.5 transition-colors hover:bg-muted sm:max-w-none sm:px-3 [&::-webkit-details-marker]:hidden">
                <Store
                  size={17}
                  className="shrink-0 text-primary"
                />

                <span className="truncate text-xs font-semibold text-foreground sm:text-sm">
                  My Business
                </span>

                <ChevronDown
                  size={15}
                  className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                />
              </summary>

              <div className="absolute left-0 top-full z-50 mt-2 w-[min(280px,calc(100vw-1.5rem))] rounded-xl border border-border bg-card p-2 shadow-lg">
                <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Your businesses
                </p>

                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg bg-primary/5 px-3 py-3 text-left"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Store size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      My Business
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Current workspace
                    </p>
                  </div>

                  <Check size={17} className="shrink-0 text-primary" />
                </button>

                <div className="my-2 border-t border-border" />

                <div className="flex items-start gap-2 px-3 py-2">
                  <Building2
                    size={16}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <p className="text-xs leading-5 text-muted-foreground">
                    Business switching will be connected when business
                    management is implemented.
                  </p>
                </div>
              </div>
            </details>
          </div>

          {/* Right section */}
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-3">
            {/* Desktop search */}
            <div className="relative hidden w-[220px] md:block lg:w-[260px]">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/15">
                <Search
                  size={16}
                  className="shrink-0 text-muted-foreground"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search pages..."
                  aria-label="Search Stockeeper pages"
                  className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />

                <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  /
                </kbd>
              </div>

              {searchQuery.trim() && (
                <div className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card p-2 shadow-lg">
                  <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Navigation results
                  </p>

                  {filteredPages.length > 0 ? (
                    filteredPages.map((page) => (
                      <Link
                        key={page.href}
                        href={page.href}
                        onClick={closeSearch}
                        className="block rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        {page.label}
                      </Link>
                    ))
                  ) : (
                    <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                      No matching pages found.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Mobile search button */}
            <button
              type="button"
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              aria-expanded={mobileSearchOpen}
              onClick={() => {
                setMobileSearchOpen((open) => !open);
                setSearchQuery("");
              }}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            >
              {mobileSearchOpen ? <X size={19} /> : <Search size={19} />}
            </button>

            {/* Notifications */}
            <details className="group relative">
              <summary
                aria-label="Open notifications"
                className="relative flex size-9 cursor-pointer list-none items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:size-10 [&::-webkit-details-marker]:hidden"
              >
                <Bell size={19} />
              </summary>

              <div className="absolute right-0 top-full z-50 mt-2 w-[min(340px,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Notifications
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    0 unread
                  </span>
                </div>

                <div className="flex flex-col items-center px-5 py-9 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <Bell size={21} className="text-muted-foreground" />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-foreground">
                    You&apos;re all caught up
                  </p>

                  <p className="mt-1 max-w-[220px] text-xs leading-5 text-muted-foreground">
                    New business notifications will appear here.
                  </p>
                </div>
              </div>
            </details>

            <div className="mx-1 hidden h-8 w-px bg-border sm:block" />
            {/* User profile */}
            <UserMenu />
          </div>
        </div>

        {/* Mobile search panel */}
        {mobileSearchOpen && (
          <div className="absolute left-0 right-0 top-full z-50 border-b border-border bg-card p-3 shadow-lg md:hidden">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/15">
              <Search
                size={18}
                className="shrink-0 text-muted-foreground"
              />

              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search pages..."
                aria-label="Search Stockeeper pages"
                className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />

              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery("")}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {searchQuery.trim() && (
              <div className="mt-2 max-h-[50vh] overflow-y-auto rounded-lg border border-border bg-card p-2">
                <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Navigation results
                </p>

                {filteredPages.length > 0 ? (
                  filteredPages.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      onClick={closeSearch}
                      className="block rounded-lg px-3 py-3 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      {page.label}
                    </Link>
                  ))
                ) : (
                  <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No matching pages found.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Responsive mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          <aside className="absolute inset-y-0 left-0 flex h-dvh w-[280px] max-w-[85vw] flex-col overflow-hidden bg-sidebar text-sidebar-foreground shadow-xl">
            <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-sidebar-border px-5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
                  <Store size={20} />
                </div>

                <span className="text-lg font-bold text-white">
                  Stockeeper
                </span>
              </div>

              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setMobileMenuOpen(false)}
                className="flex size-9 items-center justify-center rounded-lg text-sidebar-muted transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-7">
              <NavLinks onNavigate={() => setMobileMenuOpen(false)} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}