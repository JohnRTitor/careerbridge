"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Location01Icon,
  FilterIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppForm } from "@/hooks/use-app-form";

export function JobsSearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const form = useAppForm({
    defaultValues: {
      query: searchParams.get("query") || "",
      location: searchParams.get("location") || "",
      type: searchParams.get("type") || "",
    },
    onSubmit: ({ value }) => {
      const params = new URLSearchParams(searchParams);
      if (value.query) params.set("query", value.query);
      else params.delete("query");

      if (value.location) params.set("location", value.location);
      else params.delete("location");

      if (value.type && value.type !== "all") params.set("type", value.type);
      else params.delete("type");

      // Reset to page 1 on new search
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
      className="bg-background p-2 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-2 max-w-4xl mx-auto"
    >
      <form.AppField name="query">
        {(field) => (
          <div className="relative flex-1 flex items-center">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-3 size-5 text-muted-foreground pointer-events-none z-10"
            />
            <Input
              type="text"
              placeholder="Job title, keywords, or company"
              className="pl-10 border-0 shadow-none h-12 focus-visible:ring-0 text-base"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          </div>
        )}
      </form.AppField>
      <div className="w-px bg-border hidden sm:block" />
      <form.AppField name="location">
        {(field) => (
          <div className="relative flex-1 flex items-center">
            <HugeiconsIcon
              icon={Location01Icon}
              className="absolute left-3 size-5 text-muted-foreground pointer-events-none z-10"
            />
            <Input
              type="text"
              placeholder="City, state, zip, or Remote"
              className="pl-10 border-0 shadow-none h-12 focus-visible:ring-0 text-base"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          </div>
        )}
      </form.AppField>
      <div className="w-px bg-border hidden sm:block" />
      <form.AppField name="type">
        {(field) => (
          <div className="flex items-center flex-1 sm:max-w-50 relative">
            <HugeiconsIcon
              icon={FilterIcon}
              className="absolute ml-3 size-5 text-muted-foreground pointer-events-none z-10"
            />
            <Select
              value={field.state.value}
              onValueChange={(val) => field.handleChange(val || "")}
            >
              <SelectTrigger className="pl-10 border-0 shadow-none h-12 focus:ring-0">
                <SelectValue placeholder="All Job Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Job Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </form.AppField>
      <Button type="submit" size="lg" className="h-12 px-8 rounded-xl shrink-0">
        Search
      </Button>
    </form>
  );
}
