"use client";

import Image from "next/image";
import Link from "next/link";

const candidateLinks = [
  { title: "Browse Jobs", href: "/jobs" },
  { title: "Browse Categories", href: "/categories" },
  { title: "Candidate Dashboard", href: "/dashboard" },
];

const employerLinks = [
  { title: "Post a Job", href: "/dashboard/post-job" },
  { title: "Employer Dashboard", href: "/dashboard" },
];

const companyLinks = [
  { title: "About Us", href: "/about" },
  { title: "Careers", href: "/careers" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="CareerBridge"
                width={55}
                height={55}
              />

              <span className="text-3xl font-bold tracking-tight">
                CareerBridge
              </span>
            </Link>

            <p className="mt-6 max-w-xs text-[17px] leading-8 text-muted-foreground">
              The modern job portal helping people and companies grow together.
            </p>
          </div>

          {/* Candidates */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">For Candidates</h3>

            <div className="space-y-4">
              {candidateLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block text-[17px] text-muted-foreground transition hover:text-primary"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Employers */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">For Employers</h3>

            <div className="space-y-4">
              {employerLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block text-[17px] text-muted-foreground transition hover:text-primary"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Company</h3>

            <div className="space-y-4">
              {companyLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block text-[17px] text-muted-foreground transition hover:text-primary"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} CareerBridge. All rights reserved.</p>

          <div className="flex items-center gap-8">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>

            <Link href="/cookies" className="hover:text-primary">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
