"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AnimatedSection from "@/components/animated-section";

export default function SignIn() {
  const router = useRouter();

  return (
    <div className="overflow-hidden bg-black min-h-screen flex items-center justify-center p-4">
      <AnimatedSection>
        <div className="bg-zinc-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-zinc-800 w-full max-w-md">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text">
            Admin Access
          </h1>
          <div className="space-y-6">
            <p className="text-gray-400 text-center">
              Sign in with your authorized Google account to access the admin
              dashboard.
            </p>
            <button
              onClick={() => signIn("google", { callbackUrl: "/admin" })}
              className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 transition-colors border border-zinc-800 rounded-xl px-6 py-3 text-sm font-medium text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
