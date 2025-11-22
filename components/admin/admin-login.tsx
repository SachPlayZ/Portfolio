"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AdminShell from "./admin-shell";

export default function AdminLogin() {
  return (
    <div className="mx-auto max-w-xl py-24">
      <AdminShell
        title="Admin access required"
        description="Sign in with the authorized Google account to continue."
      >
        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={() => signIn("google")}
        >
          Continue with Google
        </Button>
      </AdminShell>
    </div>
  );
}

