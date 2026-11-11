"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User, LoaderCircle } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    setError("");
    setIsSigningOut(true);

    try {
      const result = await signOut();

      if (result.error) {
        setError("Unable to sign out. Please try again.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Unable to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  const user = session?.user;
  const displayName = user?.name || "Account";
  const initials = getInitials(displayName) || "U";

  return (
    <details className="group relative">
      <summary
        aria-label="Open account menu"
        className="flex cursor-pointer list-none items-center gap-1 rounded-lg p-1 transition-colors hover:bg-muted sm:gap-2 sm:p-1.5 [&::-webkit-details-marker]:hidden"
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary sm:size-9">
          {isPending ? "…" : initials}
        </div>

        <div className="hidden max-w-[150px] text-left sm:block">
          <p className="truncate text-xs font-semibold text-foreground">
            {isPending ? "Loading account..." : displayName}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {isPending ? " " : "Account"}
          </p>
        </div>

        <ChevronDown
          size={15}
          className="hidden text-muted-foreground transition-transform group-open:rotate-180 sm:block"
        />
      </summary>

      <div className="absolute right-0 top-full z-50 mt-2 w-[min(260px,calc(100vw-1.5rem))] rounded-xl border border-border bg-card p-2 shadow-lg">
        <div className="border-b border-border px-3 py-3">
          <p className="truncate text-sm font-semibold text-foreground">
            {isPending ? "Loading..." : displayName}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {user?.email || ""}
          </p>
        </div>

        <div className="space-y-1 py-2">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground">
            <User size={17} />
            Signed-in account
          </div>
        </div>

        {error && (
          <p role="alert" className="px-3 py-2 text-xs text-danger">
            {error}
          </p>
        )}

        <div className="border-t border-border pt-2">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isPending || isSigningOut || !user}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger transition-colors hover:bg-danger/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningOut ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <LogOut size={17} />
            )}
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </details>
  );
}
