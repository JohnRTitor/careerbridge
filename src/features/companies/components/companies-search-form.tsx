"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/hooks/use-app-form";

import ClickSpark from "@/components/react-bits/ClickSpark";

export function CompaniesSearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const form = useAppForm({
    defaultValues: {
      query: searchParams.get("query") || "",
    },
    onSubmit: ({ value }) => {
      const params = new URLSearchParams(searchParams);
      if (value.query) params.set("query", value.query);
      else params.delete("query");

      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
  });

  return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="bg-background p-2 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto mt-8"
      >
        <form.AppField name="query">
          {(field) => (
            <div className="relative flex-1 flex items-center">
              <HugeiconsIcon icon={Search01Icon} className="absolute left-3 size-5 text-muted-foreground pointer-events-none z-10" />
              <Input 
                type="text" 
                placeholder="Search for companies by name or industry..." 
                className="pl-10 border-0 shadow-none h-12 focus-visible:ring-0 text-base"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </div>
          )}
        </form.AppField>
        <ClickSpark
          sparkColor="#fff"
          sparkSize={5}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
          className="relative w-full sm:w-auto"
        >
          <Button type="submit" size="lg" className="h-12 px-8 rounded-xl shrink-0 w-full sm:w-auto">
            Search
          </Button>
        </ClickSpark>
      </form>
  );
}
