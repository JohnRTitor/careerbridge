import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "font-medium")}>
        Sign In
      </Link>
      <Link href="/register" className={buttonVariants()}>
        Sign Up
      </Link>
    </div>
  );
}
