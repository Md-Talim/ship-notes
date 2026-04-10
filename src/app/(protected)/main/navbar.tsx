"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Clock, Home, Settings } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-border/40 border-b">
      <nav className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-6">
        <Link href="/main" className="text-sm font-semibold tracking-tight">
          ship-notes
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/main">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Home className="size-3.5" />
              Home
            </Button>
          </Link>
          <Link href="/main/history">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Clock className="size-3.5" />
              History
            </Button>
          </Link>
          <Link href="/main/settings">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Settings className="size-3.5" />
              Settings
            </Button>
          </Link>

          <div className="bg-border ml-2 h-5 w-px" />

          <div className="ml-2">
            <UserButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
