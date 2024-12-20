"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { LogIn, LogOut, Menu, X, Camera } from "lucide-react";
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { useState, useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const NavItems = () => (
    <>
      <Link
        href="/"
        className={`group flex items-center text-sm font-medium transition-colors hover:text-foreground ${
          pathname === "/" ? "text-foreground" : "text-muted-foreground"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <span className="relative">
          Gallery
          <span className={`absolute -bottom-1 left-0 h-[2px] w-0 bg-foreground transition-all duration-200 group-hover:w-full ${
            pathname === "/" ? "w-full" : ""
          }`} />
        </span>
      </Link>
      <Link
        href="/upload"
        className={`group flex items-center text-sm font-medium transition-colors hover:text-foreground ${
          pathname === "/upload" ? "text-foreground" : "text-muted-foreground"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <span className="relative">
          Upload
          <span className={`absolute -bottom-1 left-0 h-[2px] w-0 bg-foreground transition-all duration-200 group-hover:w-full ${
            pathname === "/upload" ? "w-full" : ""
          }`} />
        </span>
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className={`group flex items-center text-sm font-medium transition-colors hover:text-foreground ${
            pathname === "/admin" ? "text-foreground" : "text-muted-foreground"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="relative">
            Admin
            <span className={`absolute -bottom-1 left-0 h-[2px] w-0 bg-foreground transition-all duration-200 group-hover:w-full ${
              pathname === "/admin" ? "w-full" : ""
            }`} />
          </span>
        </Link>
      )}
    </>
  );

  return (
    <nav 
      className="sticky top-0 z-40 w-full backdrop-blur-lg bg-background/80 border-b border-border/40 supports-[backdrop-filter]:bg-background/60"
      data-lpignore="true"
    >
      <div className="mx-auto min-w-[420px] max-w-[1260px] px-4">
        <div className="flex h-16 items-center">
          <div className="flex w-full justify-between">
            <div className="flex gap-6 md:gap-10">
              <Link href="/" className="flex items-center space-x-2 group">
                <Camera className="h-6 w-6 text-primary" />
                <span className="inline-block text-xl font-bold text-transparent animate-gradient">
                  InstaComfy
                </span>
              </Link>
              <nav className="hidden gap-8 md:flex">
                <NavItems />
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              {user ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => nextAuthSignOut()}
                  className="hover:bg-foreground/5"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => nextAuthSignIn('google')}
                  className="gap-2 hover:bg-foreground/5"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-foreground/5"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
            mobileMenuOpen ? "max-h-[500px] border-t border-border/40" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col space-y-4 py-4 px-2">
            <NavItems />
          </nav>
        </div>
      </div>
    </nav>
  );
}
