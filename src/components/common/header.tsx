"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Login01Icon } from "@hugeicons/core-free-icons";
import { usePermission } from "@/hooks/use-permission";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const menuItems = [
  { href: "#find-jobs", text: "Find Jobs" },
  { href: "#categories", text: "Categories" },
  { href: "#companies", text: "Companies" },
  { href: "#how-it-works", text: "How it Works" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  const { can, isLoading } = usePermission();
  if (isLoading) return null;

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="CareerBridge"
            width={50}
            height={50}
            className="h-12 w-12"
          />

          <span className="text-2xl font-bold">CareerBridge</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-10 lg:flex">
          {menuItems.map((item) => (
            <a
              key={item.text}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-primary"
            >
              {item.text}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/login" className="text-sm font-medium">
            Sign in
          </Link>

          {can("job", "create") && (
            <Link href="/jobs/post">
              <Button>Post a Job</Button>
            </Link>
          )}
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100">
              <HugeiconsIcon icon={Menu01Icon} className="h-7 w-7" />
            </SheetTrigger>

            <SheetContent side="right" className="flex h-full w-72 flex-col">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold">
                  CareerBridge
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-8 flex flex-1 flex-col">
                {/* Top menu items */}
                <div className="flex flex-col gap-1 text-lg">
                  {menuItems.map((item) => (
                    <a
                      key={item.text}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-primary"
                    >
                      {item.text}
                    </a>
                  ))}

                  {can("job", "create") && (
                    <Link href="/jobs/post" onClick={() => setOpen(false)}>
                      <Button className="mt-3 w-full">Post a Job</Button>
                    </Link>
                  )}
                </div>

                {/* Bottom Sign In */}
                <div className="mt-auto border-t pt-4">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium hover:bg-gray-100"
                  >
                    <HugeiconsIcon icon={Login01Icon} className="h-6 w-6" />
                    <span className="text-lg font-bold py-2">Sign in</span>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
