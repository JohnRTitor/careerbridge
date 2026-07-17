"use client";

import { useSession } from "@/lib/auth-client";
import { getLinksForRole } from "./nav-links";
import { Logo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { AuthButtons } from "./auth-buttons";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle"; // Need to ensure path is correct, wait we have one in src/components/theme/theme-toggle.tsx? Yes, saw in history.

export default function Navbar() {
  const { data: session, isPending } = useSession();

  // If session is loading, we can just show public links or a skeleton.
  // Showing public links temporarily prevents layout shift.
  const role = session?.user?.role;
  const links = getLinksForRole(role);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Logo />
          <DesktopNav links={links} />
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center">
            {isPending ? (
              <div className="w-24 h-9 bg-muted animate-pulse rounded-md" />
            ) : session?.user ? (
              <UserMenu user={{
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
              }} />
            ) : (
              <AuthButtons />
            )}
          </div>
          
          <MobileNav links={links}>
            {isPending ? (
               <div className="w-full h-9 bg-muted animate-pulse rounded-md" />
            ) : session?.user ? (
               <div className="flex flex-col gap-4">
                  {/* For mobile, you could render a simpler user summary or the same UserMenu logic */}
                  <div className="flex items-center gap-3 px-2 py-1">
                    <UserMenu user={{
                      id: session.user.id,
                      name: session.user.name,
                      email: session.user.email,
                      image: session.user.image,
                    }} />
                    <div className="flex flex-col text-sm">
                      <span className="font-medium">{session.user.name}</span>
                      <span className="text-muted-foreground text-xs">{session.user.email}</span>
                    </div>
                  </div>
               </div>
            ) : (
              <AuthButtons />
            )}
          </MobileNav>
        </div>
      </div>
    </header>
  );
}
