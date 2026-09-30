"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SetupOwnerPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    const { error } = await authClient.signUp.email({
      name: "lami gudisa",
      email: "lamigudisa94@gmail.com",
      password,
    });

if (error) {
  console.error("SIGNUP ERROR:", error);

  setMessage(
    `${error.code ?? "ERROR"}: ${error.message ?? "Unknown error"}`
  );

  setLoading(false);
  return;
}

    setMessage("Owner account created successfully! You can now log in.");
    setPassword("");
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6"
      >
        <div>
          <h1 className="text-3xl font-semibold">
            Create Owner Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            One-time development setup.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">
            Owner email
          </label>

          <input
            value="lamigudisa94@gmail.com"
            disabled
            className="mt-2 h-12 w-full rounded-xl border bg-muted px-4"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium"
          >
            Create password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
            className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Owner Account"}
        </button>

        {message && (
          <p className="rounded-lg border p-4 text-sm">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}