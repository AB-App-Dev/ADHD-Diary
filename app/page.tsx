import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/home");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <main className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            ADHS-Tagebuch
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Medikamentenwirkung und tägliches Wohlbefinden erfassen
          </p>
        </div>
        <LoginForm />
      </main>
    </div>
  );
}
