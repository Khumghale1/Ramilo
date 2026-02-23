import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { prisma } from "./prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [process.env.FRONTEND_URL ?? "http://localhost:5000"],

  // ─── Email & Password ───────────────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // TODO: Replace with your email provider (Resend, Nodemailer, SendGrid, etc.)
      // Example with Resend:
      //   await resend.emails.send({ from: "noreply@yourdomain.com", to: user.email, subject: "Reset your password", html: `<a href="${url}">Reset password</a>` });
      console.log(`[DEV] Password reset link for ${user.email}: ${url}`);
    },
  },

  // ─── Email Verification ─────────────────────────────────────────────────────
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // TODO: Replace with your email provider
      console.log(`[DEV] Verification email for ${user.email}: ${url}`);
    },
  },

  // ─── Social Providers (OAuth) ───────────────────────────────────────────────
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  // ─── Plugins ────────────────────────────────────────────────────────────────
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // TODO: Replace with your email provider
        console.log(`[DEV] Magic link for ${email}: ${url}`);
      },
    }),
  ],
});
