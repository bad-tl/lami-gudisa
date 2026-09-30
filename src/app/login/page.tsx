"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { motion } from "motion/react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <section className="relative hidden overflow-hidden bg-slate-950 text-white lg:flex">
          {/* Decorative background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl"
          />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-16">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-bold">
                  LG
                </div>

                <span className="text-4xl font-semibold tracking-tight">
  Lami Gudisa
</span>
              </div>
            </div>

            <div className="max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400"
              >
                Professional workspace
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl font-semibold tracking-tight xl:text-4xl"
              >
                ACCAONTANT & CONTROLLER OFFICER 
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-6 max-w-lg text-base leading-7 text-slate-400"
              >
                A secure management workspace for maintaining Lami
                Gudisa&apos;s professional portfolio and career information.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Secure access
                </span>

                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Private workspace
                </span>
              </motion.div>
            </div>

            <p className="text-xs text-slate-500">
              Owner access only
            </p>
          </div>
        </section>

        {/* Login */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-md"
          >
            {/* Mobile brand */}
            <div className="mb-12 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">
                  LG
                </div>

                <span className="font-semibold">Lami Gudisa</span>
              </div>
            </div>

            <div className="mb-10">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Owner portal
              </p>

              <h2 className="text-4xl font-semibold tracking-tight">
                Welcome back.
              </h2>

              <p className="mt-3 text-muted-foreground">
                Sign in to manage the professional portfolio.
              </p>
            </div>

            <form
  onSubmit={async (event) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (error) {
      setError(error.message || "Invalid email or password.");
      setIsLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }}
  className="space-y-6"
>
  <div className="space-y-2">
    <label htmlFor="email" className="text-sm font-medium">
      Email
    </label>

    <input
      id="email"
      type="email"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      placeholder="you@example.com"
      required
      className="h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
    />
  </div>

  <div className="space-y-2">
    <label htmlFor="password" className="text-sm font-medium">
      Password
    </label>

    <div className="relative">
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter your password"
        required
        className="h-12 w-full rounded-xl border bg-background px-4 pr-12 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      <button
        type="button"
        onClick={() => setShowPassword((value) => !value)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition hover:text-foreground"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  </div>

  {error && (
    <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {error}
    </p>
  )}

  <div className="flex items-center justify-between">
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <input type="checkbox" className="h-4 w-4 rounded border" />
      Remember me
    </label>
  </div>

  <button
    type="submit"
    disabled={isLoading}
    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {isLoading ? "Signing in..." : "Sign in"}

    {!isLoading && (
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    )}
  </button>
</form>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              This workspace is restricted to the portfolio owner.
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}