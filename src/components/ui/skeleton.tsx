import { cn } from "@/lib/utils"

import FadeContent from "@/components/react-bits/FadeContent"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <FadeContent blur duration={300} ease="power3.out">
      <div
        data-slot="skeleton"
        className={cn("animate-pulse rounded-md bg-muted", className)}
        {...props}
      />
    </FadeContent>
  )
}

export { Skeleton }
