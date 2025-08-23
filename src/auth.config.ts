import type { NextAuthConfig } from "next-auth";

import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

export default {
  providers: [
    Google,
    Resend({
      from: "noreply@heyamara.app",
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
