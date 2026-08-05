"use client";
import type { DropdownProps } from "@daypicker/react";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDownIcon, Tick02Icon } from "@hugeicons/core-free-icons";

function CalendarDropdown({
  value,
  onChange,
  className: _className,
  ...props
}: DropdownProps) {
  const isYearDropdown =
    props.name === "years" || (props.options && props.options[0]?.value > 1000);
  const options = isYearDropdown
    ? [...(props.options || [])].reverse()
    : props.options || [];
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-fit justify-between capitalize h-7 gap-1",
        )}
      >
        {value != null && value !== ""
          ? options.find((item) => item.value === Number(value))?.label
          : "Select"}
        <HugeiconsIcon
          icon={ArrowDownIcon}
          strokeWidth={2}
          className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50"
        />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-1 w-fit min-w-32 rounded-lg bg-popover p-0 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10 animate-in fade-in-0 zoom-in-95">
          <Command
            filter={(val, search) => {
              const label = options.find(
                (item) => item.value.toString() === val,
              )?.label;
              return label?.toLowerCase().includes(search.toLowerCase())
                ? 1
                : 0;
            }}
          >
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    className="capitalize"
                    key={item.value}
                    onSelect={() => {
                      onChange?.({
                        target: { value: item.value.toString() },
                      } as React.ChangeEvent<HTMLSelectElement>);
                      setOpen(false);
                    }}
                    value={item.value.toString()}
                  >
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      strokeWidth={2}
                      className={cn(
                        "mr-2 h-4 w-4",
                        Number(value) === item.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}

export function DatePicker({
  endMonth = new Date(2050, 11),
  startMonth = new Date(1900, 0),
  ...props
}: React.ComponentProps<typeof Calendar>) {
  return (
    <Calendar
      captionLayout="dropdown"
      components={{ Dropdown: CalendarDropdown, ...props.components }}
      endMonth={endMonth}
      startMonth={startMonth}
      {...props}
    />
  );
}
