import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Replace this with your authorized email
      const authorizedEmail = process.env.AUTHORIZED_EMAIL;
      return user.email === authorizedEmail;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
