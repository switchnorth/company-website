"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function AdminActionButton({
  children,
  confirmMessage,
  variant = "outline",
}: {
  children: React.ReactNode;
  confirmMessage?: string;
  variant?: "outline" | "primary" | "secondary";
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full justify-center md:w-auto"
      disabled={pending}
      onClick={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      size="sm"
      type="submit"
      variant={variant}
    >
      {pending ? "Working..." : children}
    </Button>
  );
}
