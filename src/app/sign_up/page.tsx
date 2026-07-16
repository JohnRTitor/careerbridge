"use client";
import Image from "next/image";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BriefcaseIcon, MailIcon, LockIcon, UserIcon, Building01Icon, ArrowRightIcon, File02Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function SignUpPage() {
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful registration pipeline execution
    if (role === "candidate") {
      window.location.href = "/candidate-dashboard";
    } else {
      window.location.href = "/recruiter-dashboard";
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#e0efff] via-[#f0f7ff] to-background px-4 py-12"
      style={{
        backgroundImage: `radial-gradient(#c2deff 1px, transparent 1px), linear-gradient(to bottom, #e0efff, #f0f7ff, #ffffff)`,
        backgroundSize: "24px 24px, 100% 100%",
      }}
    >
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <a href="/" className="flex items-center gap-1.5 mb-2">
            <Image
              src="/logo.svg"
              alt="CareerBridge Logo"
              width={70}
              height={70}
              className="h-16 w-16 object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-foreground">
              CareerBridge
            </span>
          </a>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            Create Your Account
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Join the automated ecosystem connecting modern talent pools
          </p>
        </div>

        <Card className="bg-white border-border shadow-md rounded-2xl overflow-hidden">
          {/* Custom Switch Tabs */}
          <div className="grid grid-cols-2 border-b border-border bg-slate-50/50 p-1">
            <button
              onClick={() => setRole("candidate")}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                role === "candidate"
                  ? "bg-white text-primary shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HugeiconsIcon icon={UserIcon} className="size-3.5" /> Candidate
            </button>
            <button
              onClick={() => setRole("recruiter")}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                role === "recruiter"
                  ? "bg-white text-primary shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HugeiconsIcon icon={Building01Icon} className="size-3.5" /> Employer / Partner
            </button>
          </div>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Dynamic Name Input Depending on Chosen Portal Pipeline Roles */}
              {role === "candidate" ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Full Name
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-slate-50/50 px-3 py-1">
                    <HugeiconsIcon icon={UserIcon} className="size-4 text-muted-foreground shrink-0" />
                    <Input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Company Entity Name
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-slate-50/50 px-3 py-1">
                    <HugeiconsIcon icon={Building01Icon} className="size-4 text-muted-foreground shrink-0" />
                    <Input
                      type="text"
                      required
                      placeholder="Northwind Labs LLC"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Unified Identity Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Work or Personal Email
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-slate-50/50 px-3 py-1">
                  <HugeiconsIcon icon={MailIcon} className="size-4 text-muted-foreground shrink-0" />
                  <Input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm"
                  />
                </div>
              </div>

              {/* Password Setting Structure */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Choose Password
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-slate-50/50 px-3 py-1">
                  <HugeiconsIcon icon={LockIcon} className="size-4 text-muted-foreground shrink-0" />
                  <Input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 text-pretty text-[11px] leading-relaxed text-muted-foreground">
                <HugeiconsIcon icon={Tick01Icon} className="size-3.5 text-primary shrink-0 mt-0.5" />
                <span>
                  By checking setup parameters, you agree to the default Terms
                  of System Operation and Automated Data Policies.
                </span>
              </div>

              {/* Submission Button Pipeline */}
              <Button type="submit" className="w-full gap-2 h-11 mt-2 text-sm">
                Get Started Now <HugeiconsIcon icon={ArrowRightIcon} className="size-4" />
              </Button>
            </form>

            <div className="mt-6 border-t border-border pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Already registered?{" "}
                <a
                  href="/signin"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign inside here
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
