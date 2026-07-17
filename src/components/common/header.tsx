"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/jobs", text: "Find Jobs" },
  { href: "/categories", text: "Categories" },
  { href: "/companies", text: "Companies" },
  { href: "/how-it-works", text: "How it Works" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="CareerBridge"
            width={50}
            height={50}
            priority
            className="h-12 w-12"
          />

          <span className="text-2xl font-bold tracking-tight">
            CareerBridge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 lg:flex">
          {menuItems.map((item) => (
            <Link
              key={item.text}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-primary"
            >
              {item.text}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="/login"
            className="text-sm font-semibold transition hover:text-primary"
          >
            Sign in
          </Link>

          <Link href="/post-job">
            <Button className="rounded-lg px-5">Post a Job</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 lg:hidden"
        >
          {open ? (
            <HugeiconsIcon icon={Cancel01Icon} className="h-7 w-7" />
          ) : (
            <HugeiconsIcon icon={Menu01Icon} className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t bg-white transition-all duration-300 lg:hidden ${
          open ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="space-y-2 p-5">
          {menuItems.map((item) => (
            <Link
              key={item.text}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-slate-700 transition hover:bg-slate-100"
            >
              {item.text}
            </Link>
          ))}

          <hr className="my-3" />

          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-3 font-medium transition hover:bg-slate-100"
          >
            Sign in
          </Link>

          <Link href="/post-job" onClick={() => setOpen(false)}>
            <Button className="mt-2 w-full">Post a Job</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
