"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "#find-jobs", text: "Find Jobs" },
  { href: "#categories", text: "Categories" },
  { href: "#companies", text: "Companies" },
  { href: "#how-it-works", text: "How it Works" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

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

        {/* Desktop */}
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

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/login">Sign in</Link>

          <Button>Post a Job</Button>
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          <Drawer open={open} onOpenChange={setOpen} direction="right">
            <DrawerTrigger
              render={
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              }
            />

            <DrawerContent className="h-full w-72 ml-auto rounded-l-xl rounded-r-none">
              <div className="flex flex-col gap-5 p-6 pt-12">
                {menuItems.map((item) => (
                  <a
                    key={item.text}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-slate-700 transition hover:bg-slate-100"
                  >
                    {item.text}
                  </a>
                ))}

                <hr />

                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 font-medium hover:bg-slate-100"
                >
                  Sign in
                </Link>

                <Link href="/post-job" onClick={() => setOpen(false)}>
                  <Button className="w-full">Post a Job</Button>
                </Link>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
