
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Email Verified | Stockeeper",
  description: "Your Stockeeper email address has been verified.",
};

export default function EmailVerifiedPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
          Email verified successfully!
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Your email address has been verified. Your Stockeeper account is
          ready to use.
        </p>

        <Link
          href="/"
          className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Continue to dashboard
          <ArrowRight size={17} />
        </Link>

        <p className="mt-5 text-xs text-muted-foreground">
          Welcome to Stockeeper.
        </p>
      </div>
    </div>
  );
}
