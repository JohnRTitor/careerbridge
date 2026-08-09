import Link from "next/link";
import { RippleButton, RippleButtonRipples } from "@/components/animate-ui/components/buttons/ripple";
import { cn } from "@/lib/utils";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <RippleButton variant="ghost" asChild>
        <Link href="/login" className="font-medium relative overflow-hidden">
          Sign In
          <RippleButtonRipples />
        </Link>
      </RippleButton>
      <RippleButton asChild>
        <Link href="/register" className="relative overflow-hidden">
          Sign Up
          <RippleButtonRipples />
        </Link>
      </RippleButton>
    </div>
  );
}
