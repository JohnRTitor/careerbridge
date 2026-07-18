"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavLink } from "./nav-links";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

interface DesktopNavProps {
  links: NavLink[];
}

export function DesktopNav({ links }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-6 lg:gap-8">
        {links.map((link) => {
          // Simple active matching - can be enhanced for nested paths if needed
          const isActive = pathname === link.href || 
            (link.href !== "/" && pathname.startsWith(link.href) && !link.href.startsWith('/#'));

          return (
            <NavigationMenuItem key={link.href}>
              <Link href={link.href} passHref legacyBehavior>
                <NavigationMenuLink
                  data-active={isActive}
                  className={cn(
                    "bg-transparent hover:bg-transparent focus:bg-transparent",
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
