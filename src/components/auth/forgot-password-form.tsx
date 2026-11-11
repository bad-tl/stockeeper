
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setIsPending(true);

    try {
      const result = await authClient.requestPasswordReset({
        email: normalizedEmail,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (result.error) {
        setError(
          "We couldn't process your request. Please wait a moment and try again.",
        );
        return;
      }

      setIsSubmitted(true);
    } catch {
      setError(
        "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      setIsPending(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md">
        <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 size={25} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Check your email
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          If an account exists for{" "}
          <span className="font-medium text-foreground">{email.trim()}</span>,
          you will receive an email with instructions to reset your password.
          Check your inbox and spam folder.
        </p>

        <Link
          href="/login"
          className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <ArrowLeft size={17} />
          Back to sign in
        </Link>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Didn&apos;t receive an email? Check your spam folder or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Mail size={23} />
        </div>

        <p className="text-sm font-semibold text-primary">
          ACCOUNT RECOVERY
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          Forgot your password?
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Enter the email address associated with your Stockeeper account.
          We&apos;ll send you a secure link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={isPending}
            className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
          />
        </div>

        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="rounded-lg border border-danger/20 bg-danger/5 px-3 py-3 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Sending instructions...
            </>
          ) : (
            <>
              Send reset instructions
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-7 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to sign in
      </Link>
    </div>
  );
}
