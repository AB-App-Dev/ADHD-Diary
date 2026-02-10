"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
  className?: string;
}

export function LogoutButton({ variant = "outline", className }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  return (
    <Button variant={variant} onClick={handleLogout} className={className}>
      <LogOutIcon className="mr-2 h-4 w-4" />
      Abmelden
    </Button>
  );
}
