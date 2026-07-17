"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "#find-jobs", text: "Find Jobs" },
  { href: "#categories", text: "Categories" },
  { href: "#companies", text: "Companies" },
  { href: "#how-it-works", text: "How it Works" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
        {/* Mobile */}
        <div className="lg:hidden">
          {/* Hamburger Button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <HugeiconsIcon icon={Menu01Icon} className="h-7 w-7" />
          </button>

          {/* Overlay */}
          <div
            onClick={() => setOpen(false)}
            className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
              open
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          />

          {/* Sidebar */}
          <aside
            className={`fixed right-0 top-0 z-50 h-screen w-72 bg-white shadow-xl transition-transform duration-300 ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-5">
              <span className="text-xl font-bold">CareerBridge</span>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 hover:bg-gray-100"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col p-5">
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

              <hr className="my-5" />

              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 font-medium hover:bg-gray-100"
              >
                Sign in
              </Link>

              <Link href="/post-job" onClick={() => setOpen(false)}>
                <Button className="mt-4 w-full">Post a Job</Button>
              </Link>
            </nav>
          </aside>
        </div>
      </div>
    </header>
  );
}
