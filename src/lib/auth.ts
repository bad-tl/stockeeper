
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { after } from "next/server";
import { prisma } from "./prisma";
import { sendAuthEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,

    // Users must verify their email before receiving a session.
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      after(async () => {
        await sendAuthEmail({
          to: user.email,
          subject: "Reset your Stockeeper password",
          heading: "Reset your password",
          message:
            "We received a request to reset the password for your Stockeeper account.",
          actionLabel: "Reset password",
          actionUrl: url,
          expiryMessage:
            "This password reset link expires in 1 hour. If you did not request this change, you can safely ignore this email.",
        });
      });
    },

    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
  },

  emailVerification: {
    // Automatically send verification after registration.
    sendOnSignUp: true,

    // Send another verification email when an unverified user signs in.
    sendOnSignIn: true,

    // Automatically establish a session after successful verification.
    autoSignInAfterVerification: true,

    // Verification links expire after one hour.
    expiresIn: 60 * 60,

    sendVerificationEmail: async ({ user, url }) => {
      after(async () => {
        await sendAuthEmail({
          to: user.email,
          subject: "Verify your Stockeeper email address",
          heading: "Verify your email address",
          message:
            "Welcome to Stockeeper! Please verify your email address to confirm ownership of your account.",
          actionLabel: "Verify email address",
          actionUrl: url,
          expiryMessage:
            "This verification link expires in 1 hour. If you did not create a Stockeeper account, you can safely ignore this email.",
        });
      });
    },
  },
});
