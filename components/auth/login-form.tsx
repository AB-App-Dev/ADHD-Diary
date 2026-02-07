"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
          setError(error.message ?? "Anmeldung fehlgeschlagen");
          setLoading(false);
          return;
        }
        router.push("/home");
      } else if (view === "signup") {
        const { error } = await authClient.signUp.email({ email, password, name });
        if (error) {
          setError(error.message ?? "Registrierung fehlgeschlagen");
          setLoading(false);
          return;
        }
        router.push("/home");
      } else if (view === "forgot") {
        const { error } = await authClient.requestPasswordReset({ email, redirectTo: "/" });
        if (error) {
          setError(error.message ?? "Link konnte nicht gesendet werden");
          setLoading(false);
          return;
        }
        setSuccess("Prüfe deine E-Mails für den Link zum Zurücksetzen");
        setLoading(false);
      } else if (view === "reset" && token) {
        const { error } = await authClient.resetPassword({ newPassword: password, token });
        if (error) {
          setError(error.message ?? "Passwort konnte nicht zurückgesetzt werden");
          setLoading(false);
          return;
        }
        setSuccess("Passwort zurückgesetzt! Du kannst dich jetzt anmelden.");
        setView("login");
        setPassword("");
        setLoading(false);
      }
    } catch {
      setError("Ein unerwarteter Fehler ist aufgetreten");
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
            className={`flex-1 cursor-pointer py-3 text-sm font-medium transition-colors ${
              view === "login"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Anmelden
          </button>
          <button
            type="button"
            onClick={() => { setView("signup"); setError(""); setSuccess(""); }}
            className={`flex-1 cursor-pointer py-3 text-sm font-medium transition-colors ${
              view === "signup"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Registrieren
          </button>
        </div>
      )}

      {view === "forgot" && (
        <div className="mb-6">
          <h2 className="text-lg font-medium text-foreground">Passwort zurücksetzen</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen zu erhalten.
          </p>
        </div>
      )}

      {view === "reset" && (
        <div className="mb-6">
          <h2 className="text-lg font-medium text-foreground">Neues Passwort festlegen</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gib unten dein neues Passwort ein.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {view === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              required
            />
          </div>
        )}

        {view !== "reset" && (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
        )}

        {(view === "login" || view === "signup" || view === "reset") && (
          <div className="space-y-2">
            <Label htmlFor="password">
              {view === "reset" ? "Neues Passwort" : "Passwort"}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mind. 8 Zeichen"
              minLength={8}
              required
            />
          </div>
        )}

        {error && <p className="text-sm text-error">{error}</p>}
        {success && <p className="text-sm text-success">{success}</p>}

        <Button type="submit" disabled={loading} className="mt-2 w-full">
          {loading
            ? "Laden..."
            : view === "login"
            ? "Anmelden"
            : view === "signup"
            ? "Registrieren"
            : view === "forgot"
            ? "Link senden"
            : "Passwort zurücksetzen"}
        </Button>

        {view === "login" && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => { setView("forgot"); setError(""); setSuccess(""); }}
            className="text-muted-foreground hover:text-foreground"
          >
            Passwort vergessen?
          </Button>
        )}

        {(view === "forgot" || view === "reset") && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => { setView("login"); setError(""); setSuccess(""); }}
            className="text-muted-foreground hover:text-foreground"
          >
            Zurück zur Anmeldung
          </Button>
        )}
      </form>
    </div>
  );
}
