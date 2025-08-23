import type { NextAuthConfig } from "next-auth";

import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

import { sendVerificationRequest } from "@/lib/resend";

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_API_KEY,
      from: process.env.AUTH_RESEND_FROM,
      sendVerificationRequest,
      maxAge: 10 * 60, // 10 minutes
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
