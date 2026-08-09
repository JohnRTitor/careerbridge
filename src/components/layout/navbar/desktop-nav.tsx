"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavLink } from "./nav-links";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { RippleButton } from "@/components/animate-ui/components/buttons/ripple";

type DesktopNavProps = {
  links: NavLink[];
}

export function DesktopNav({ links }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-6 lg:gap-8">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/" &&
              pathname.startsWith(link.href) &&
              !link.href.startsWith("/#"));

          return (
            <NavigationMenuItem key={link.href}>
              <RippleButton
                asChild
                className={cn(
                  "bg-transparent hover:bg-transparent focus:bg-transparent border-none shadow-none text-sm font-medium transition-colors hover:text-primary px-3 py-2",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Link href={link.href}>
                  {link.label}
                </Link>
              </RippleButton>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
