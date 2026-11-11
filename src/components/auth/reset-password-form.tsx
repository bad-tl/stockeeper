
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();

const [token, setToken] = useState<string | null>(
  () => searchParams.get("token"),
);

const isInvalidToken =
  !token || Boolean(searchParams.get("error"));

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

useEffect(() => {
  // Remove the token and other query parameters from the visible URL.
  window.history.replaceState(
    null,
    "",
    window.location.pathname,
  );
}, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

if (!token || isInvalidToken) {
  setError("This reset link is invalid or has expired. Please request a new one.");
  return;
}

    if (password.length < 8 || password.length > 128) {
      setError("Your password must contain between 8 and 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsPending(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (result.error) {
        setError(
          result.error.message ||
            "This reset link is invalid or has expired. Please request a new one.",
        );
        return;
      }

      setToken(null);
      setPassword("");
      setConfirmPassword("");
      setIsSuccess(true);
    } catch {
      setError(
        "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      setIsPending(false);
    }
  }



  if (isSuccess) {
    return (
      <div className="w-full max-w-md">
        <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 size={25} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Password updated
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Your Stockeeper password has been changed successfully. For your
          security, you&apos;ll need to sign in again using your new password.
        </p>

        <Link
          href="/login"
          className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Continue to sign in
          <ArrowRight size={17} />
        </Link>
      </div>
    );
  }

  if (isInvalidToken || !token) {
    return (
      <div className="w-full max-w-md">
        <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
          <AlertCircle size={25} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Reset link unavailable
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This password reset link is missing, invalid, or has expired.
          Request a new reset email to continue.
        </p>

        <Link
          href="/forgot-password"
          className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Request a new reset link
          <ArrowRight size={17} />
        </Link>

        <Link
          href="/login"
          className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LockKeyhole size={23} />
        </div>

        <p className="text-sm font-semibold text-primary">
          ACCOUNT RECOVERY
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          Create a new password
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Choose a strong password for your Stockeeper account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            New password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your new password"
              disabled={isPending}
              className="h-11 w-full rounded-lg border border-input bg-card px-3 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Use between 8 and 128 characters.
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Confirm new password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Enter your new password again"
              disabled={isPending}
              className="h-11 w-full rounded-lg border border-input bg-card px-3 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
            />

            <button
              type="button"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              aria-pressed={showConfirmPassword}
              onClick={() =>
                setShowConfirmPassword((visible) => !visible)
              }
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-2 rounded-lg border border-danger/20 bg-danger/5 px-3 py-3 text-sm text-danger"
          >
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Updating password...
            </>
          ) : (
            <>
              Update password
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
