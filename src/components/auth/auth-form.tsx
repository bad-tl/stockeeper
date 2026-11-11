
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  MailCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const [verificationNotice, setVerificationNotice] = useState<
    "signup" | "login" | null
  >(null);

  const [verificationEmail, setVerificationEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResendMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (isRegister && name.trim().length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsPending(true);

    try {
      const result = isRegister
        ? await authClient.signUp.email({
            name: name.trim(),
            email: normalizedEmail,
            password,
            callbackURL: "/email-verified",
          })
        : await authClient.signIn.email({
            email: normalizedEmail,
            password,
            callbackURL: "/",
          });

      if (result.error) {
        const message = result.error.message || "";

        if (
          !isRegister &&
          (result.error.status === 403 ||
            /verify|verification/i.test(message))
        ) {
          setVerificationEmail(normalizedEmail);
          setVerificationNotice("login");
          setError("");
          return;
        }

        setError(
          message ||
            (isRegister
              ? "We couldn't create your account. Please try again."
              : "The email or password is incorrect."),
        );
        return;
      }

      if (isRegister) {
        setVerificationEmail(normalizedEmail);
        setVerificationNotice("signup");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError(
        "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      setIsPending(false);
    }
  }

  async function handleResendVerification() {
    if (!verificationEmail || isResending) return;

    setIsResending(true);
    setResendMessage("");

    try {
      const result = await authClient.sendVerificationEmail({
        email: verificationEmail,
        callbackURL: "/email-verified",
      });

      if (result.error) {
        setResendMessage(
          "We couldn't send the email right now. Please try again shortly.",
        );
        return;
      }

      setResendMessage(
        "If your account needs verification, a new verification email has been sent.",
      );
    } catch {
      setResendMessage(
        "We couldn't send the email right now. Please check your connection and try again.",
      );
    } finally {
      setIsResending(false);
    }
  }

  // Email verification confirmation screen
  if (verificationNotice) {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-primary">
            <MailCheck className="h-7 w-7" />
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Check your email
          </h2>

          <p className="text-sm leading-6 text-muted-foreground">
            {verificationNotice === "signup"
              ? "Your account has been created. Please verify your email address before signing in."
              : "Your email address needs to be verified before you can sign in. A verification email has been requested."}
          </p>

          <p className="break-all font-medium text-foreground">
            {verificationEmail}
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={isResending}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResending && (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            )}

            {isResending ? "Sending..." : "Resend verification email"}
          </button>

          {resendMessage && (
            <p
              role="status"
              aria-live="polite"
              className="text-center text-sm text-muted-foreground"
            >
              {resendMessage}
            </p>
          )}

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm font-medium text-primary transition hover:underline"
          >
            Back to sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="text-center text-xs leading-5 text-muted-foreground">
          If you dont see the email, check your spam or junk folder.
        </p>
      </div>
    );
  }

  // Login and registration forms
  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">
          {isRegister ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          {isRegister
            ? "Get started with Stockeeper"
            : "Sign in to Stockeeper"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {isRegister
            ? "Create your account to start managing your business."
            : "Enter your account details to continue to your workspace."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {isRegister && (
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              disabled={isPending}
              className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
            />
          </div>
        )}

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

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>

            {!isRegister && (
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary transition hover:text-primary/80"
              >
                Forgot password?
              </Link>
            )}
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
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

          {isRegister && (
            <p className="mt-2 text-xs text-muted-foreground">
              Use at least 8 characters.
            </p>
          )}
        </div>

        {isRegister && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Confirm password
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
                placeholder="Enter your password again"
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
        )}

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
              {isRegister ? "Creating account..." : "Signing in..."}
            </>
          ) : (
            <>
              {isRegister ? "Create account" : "Sign in"}
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-semibold text-primary transition hover:text-primary/80"
        >
          {isRegister ? "Sign in" : "Create an account"}
        </Link>
      </p>

      {isRegister && (
        <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
          By creating an account, you agree to use Stockeeper responsibly.
        </p>
      )}
    </div>
  );
}
