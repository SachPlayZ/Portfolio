import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ADMIN_EMAIL = process.env.AUTHORIZED_EMAIL || "ssachinsingh99@gmail.com";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return Boolean(user.email && user.email === ADMIN_EMAIL);
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      token.isAdmin = token.email === ADMIN_EMAIL;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email ?? session.user.email;
        session.user.isAdmin = token.isAdmin === true;
      }
      return session;
    },
  },
};

