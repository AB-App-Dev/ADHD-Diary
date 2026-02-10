"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export function Header() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="top-0 z-50 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/home" className="text-lg font-semibold text-foreground">
          ADHD Diary
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-default-300 text-sm font-medium text-foreground bg-stone-600 hover:bg-default-400"
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-surface py-1 shadow-lg bg-stone-600">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-medium text-foreground">
                  {session?.user?.name ?? "User"}
                </p>
              </div>
              <Link
                href="/sessions"
                onClick={() => setDropdownOpen(false)}
                className="group flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-background"
              >
                <svg className="h-4 w-4 text-white group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Sitzungen
              </Link>
              <button
                onClick={handleLogout}
                className="group flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-foreground hover:bg-background cursor-pointer"
              >
                <svg className="h-4 w-4 text-white group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
