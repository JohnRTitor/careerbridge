"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./nav-links";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";

interface MobileNavProps {
  links: NavLink[];
  children?: React.ReactNode; // To pass in AuthButtons or UserMenu for mobile context
}

export function MobileNav({ links, children }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" className="md:hidden" />}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[350px] flex flex-col">
          <SheetHeader className="mb-4 text-left">
            <SheetTitle>
              <div onClick={() => setOpen(false)} className="cursor-pointer">
                <Logo />
              </div>
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col gap-4 overflow-y-auto py-4 h-full">
            <div className="flex flex-col gap-2">
              {links.map((link) => {
                const isActive = pathname === link.href || 
                  (link.href !== "/" && pathname.startsWith(link.href) && !link.href.startsWith('/#'));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center px-2 py-3 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                      isActive ? "bg-muted text-primary" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            
            {/* The children prop is where we can slot in auth buttons or user specific actions */}
            <div className="mt-auto pt-6 border-t border-border flex flex-col gap-4" onClick={() => setOpen(false)}>
              {children}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
