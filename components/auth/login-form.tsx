"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type View = "login" | "signup" | "forgot" | "reset";

export function LoginForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [view, setView] = useState<View>(token ? "reset" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (view === "login") {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) {
          setError(error.message ?? "Login failed");
          setLoading(false);
          return;
        }
        router.push("/home");
      } else if (view === "signup") {
        const { error } = await authClient.signUp.email({ email, password, name });
        if (error) {
          setError(error.message ?? "Sign up failed");
          setLoading(false);
          return;
        }
        router.push("/home");
      } else if (view === "forgot") {
        const { error } = await authClient.requestPasswordReset({ email, redirectTo: "/" });
        if (error) {
          setError(error.message ?? "Failed to send reset link");
          setLoading(false);
          return;
        }
        setSuccess("Check your email for the reset link");
        setLoading(false);
      } else if (view === "reset" && token) {
        const { error } = await authClient.resetPassword({ newPassword: password, token });
        if (error) {
          setError(error.message ?? "Failed to reset password");
          setLoading(false);
          return;
        }
        setSuccess("Password reset! You can now login.");
        setView("login");
        setPassword("");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  }

  const isTabView = view === "login" || view === "signup";

  return (
    <div className="w-full max-w-sm">
      {isTabView && (
        <div className="mb-6 flex border-b border-border">
          <button
            type="button"
            onClick={() => { setView("login"); setError(""); setSuccess(""); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              view === "login"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setView("signup"); setError(""); setSuccess(""); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              view === "signup"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>
      )}

      {view === "forgot" && (
        <div className="mb-6">
          <h2 className="text-lg font-medium text-foreground">Reset Password</h2>
          <p className="mt-1 text-sm text-muted">
            Enter your email to receive a reset link.
          </p>
        </div>
      )}

      {view === "reset" && (
        <div className="mb-6">
          <h2 className="text-lg font-medium text-foreground">Set New Password</h2>
          <p className="mt-1 text-sm text-muted">
            Enter your new password below.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {view === "signup" && (
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              placeholder="Your name"
              required
            />
          </div>
        )}

        {view !== "reset" && (
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              placeholder="you@example.com"
              required
            />
          </div>
        )}

        {(view === "login" || view === "signup" || view === "reset") && (
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
              {view === "reset" ? "New Password" : "Password"}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              placeholder="Min. 8 characters"
              minLength={8}
              required
            />
          </div>
        )}

        {error && <p className="text-sm text-error">{error}</p>}
        {success && <p className="text-sm text-success">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Loading..."
            : view === "login"
            ? "Login"
            : view === "signup"
            ? "Sign Up"
            : view === "forgot"
            ? "Send Reset Link"
            : "Reset Password"}
        </button>

        {view === "login" && (
          <button
            type="button"
            onClick={() => { setView("forgot"); setError(""); setSuccess(""); }}
            className="text-sm text-muted hover:text-foreground"
          >
            Forgot password?
          </button>
        )}

        {(view === "forgot" || view === "reset") && (
          <button
            type="button"
            onClick={() => { setView("login"); setError(""); setSuccess(""); }}
            className="text-sm text-muted hover:text-foreground"
          >
            Back to login
          </button>
        )}
      </form>
    </div>
  );
}
