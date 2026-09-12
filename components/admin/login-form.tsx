"use client";

import { useActionState } from "react";
import { loginAdmin, type AdminLoginState } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";

const initialState: AdminLoginState = {
  error: "",
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-deep-ink" htmlFor="username">
          Username
        </label>
        <input
          autoComplete="username"
          className="focus-ring min-h-11 rounded-md border border-border bg-white px-3 text-base text-deep-ink"
          id="username"
          name="username"
          required
          type="text"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-deep-ink" htmlFor="password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className="focus-ring min-h-11 rounded-md border border-border bg-white px-3 text-base text-deep-ink"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      {state.error ? (
        <p className="rounded-md border border-accent-red/20 bg-accent-red-soft px-3 py-2 text-sm font-semibold text-accent-red-dark">
          {state.error}
        </p>
      ) : null}
      <Button disabled={pending} type="submit">
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
