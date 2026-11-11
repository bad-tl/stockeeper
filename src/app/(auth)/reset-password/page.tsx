
import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your Stockeeper account.",
};

function ResetPasswordLoading() {
  return (
    <div
      className="flex min-h-[300px] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm text-muted-foreground">
        Preparing password reset...
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
