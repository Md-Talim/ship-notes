"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserButton } from "@clerk/nextjs";
import { Clock, Home, Menu, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/main", label: "Home", icon: Home },
  { href: "/main/history", label: "History", icon: Clock },
  { href: "/main/settings", label: "Settings", icon: Settings },
] as const;

export function Navbar() {
  return (
    <header className="border-border/40 border-b">
      <nav className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-6">
        <Link href="/main" className="text-sm font-semibold tracking-tight">
          ship-notes
        </Link>

        <div className="flex items-center gap-1">
          {/* Desktop nav links — hidden on mobile */}
          <div className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Icon className="size-3.5" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile dropdown — hidden on desktop */}
          <MobileMenu />

          <div className="bg-border ml-2 h-5 w-px" />

          <div className="ml-2">
            <UserButton />
          </div>
        </div>
      </nav>
    </header>
  );
}

function MobileMenu() {
  const router = useRouter();

  return (
    <div className="sm:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Navigation menu"
            >
              <Menu className="size-4" />
            </Button>
          }
        ></DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <DropdownMenuItem key={href} onClick={() => router.push(href)}>
              <Icon className="size-4" />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
