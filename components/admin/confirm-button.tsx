"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type ConfirmButtonProps = {
  onConfirm: () => void | Promise<void>;
  children: React.ReactNode;
  confirmMessage?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
};

export default function ConfirmButton({
  onConfirm,
  children,
  confirmMessage = "Are you sure?",
  variant = "destructive",
  size = "sm",
}: ConfirmButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const ok = window.confirm(confirmMessage);
    if (!ok) return;
    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? "Working..." : children}
    </Button>
  );
}

