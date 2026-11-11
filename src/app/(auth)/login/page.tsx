
import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/auth-form";
import { getCurrentSession } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Stockeeper account.",
};

function AuthLoading() {
  return (
    <div
      className="flex min-h-[300px] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-4 border-indigo-100 border-t-primary" />
        <p className="text-sm text-muted-foreground">
          Checking your session...
        </p>
      </div>
    </div>
  );
}

async function LoginContent() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/");
  }

  return <AuthForm mode="login" />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <LoginContent />
    </Suspense>
  );
}
