
"use client";

import { Camera, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export function Header() {
  const { user, isAdmin } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Camera className="h-6 w-6" />
          <span className="ml-2 font-bold">InstaClone</span>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/">Gallery</Link>
            </Button>
            {user && (
              <Button variant="ghost" asChild>
                <Link href="/upload">Upload</Link>
              </Button>
            )}
            {isAdmin && (
              <Button variant="ghost" asChild>
                <Link href="/admin">Admin</Link>
              </Button>
            )}
          </nav>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {user ? (
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
