"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { LogIn, LogOut } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { user, signIn, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto min-w-[420px] max-w-[1260px] px-4">
        <div className="flex h-16 items-center">
          <div className="flex w-full justify-between">
            <div className="flex gap-6 md:gap-10">
              <Link href="/" className="flex items-center space-x-2">
                <span className="inline-block font-bold">AI Gallery</span>
              </Link>
              <nav className="hidden gap-6 md:flex">
                <Link
                  href="/"
                  className={`flex items-center text-sm font-medium ${
                    pathname === "/" ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Gallery
                </Link>
                <Link
                  href="/upload"
                  className={`flex items-center text-sm font-medium ${
                    pathname === "/upload" ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Upload
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <>
                  {user.email === 'adam@apogeeintelligence.ai' && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/admin">Admin</Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signIn()}
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )}
              <button className="md:hidden" aria-label="Menu">
                <i className="fa-solid fa-bars text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
