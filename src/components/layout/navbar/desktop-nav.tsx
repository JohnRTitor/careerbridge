"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavLink } from "./nav-links";

interface DesktopNavProps {
  links: NavLink[];
}

export function DesktopNav({ links }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
      {links.map((link) => {
        // Simple active matching - can be enhanced for nested paths if needed
        const isActive = pathname === link.href || 
          (link.href !== "/" && pathname.startsWith(link.href) && !link.href.startsWith('/#'));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
