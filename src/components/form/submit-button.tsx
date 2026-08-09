"use client";

import * as React from "react";
import { RippleButton, RippleButtonRipples } from "@/components/animate-ui/components/buttons/ripple";

export function SubmitButton({ children = "Submit", ...props }: Omit<React.ComponentProps<typeof RippleButton>, "children" | "asChild"> & { children?: React.ReactNode }) {
  return (
    <RippleButton type={"submit" as any} className="relative overflow-hidden" {...(props as any)}>
      {children}
      <RippleButtonRipples />
    </RippleButton>
  );
}
