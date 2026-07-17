"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function SubmitButton({ children = "Submit", ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button type="submit" {...props}>
      {children}
    </Button>
  );
}
