"use client";
import Image from "next/image";
import { useState } from "react";
import {
  Briefcase,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function SignInPage() {
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic redirects to corresponding dashboard target
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
        {/* Main Logo & Platform Context */}
        <div className="flex flex-col items-center text-center">
          <a href="/" className="flex items-center gap-1.5 mb-2">
            <Image
              src="/logo.svg"
              alt="CareerBridge Logo"
              width={70}
              height={70}
              priority
              className="h-16 w-16 object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-foreground">
              CareerBridge
            </span>
          </a>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            Welcome Back
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Access your unified dashboard architecture parameters
          </p>
        </div>

        <Card className="bg-white border-border shadow-md rounded-2xl overflow-hidden">
          {/* Dynamic Switcher Tab */}
          <div className="grid grid-cols-2 border-b border-border bg-slate-50/50 p-1">
            <button
              onClick={() => setRole("candidate")}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                role === "candidate"
                  ? "bg-white text-primary shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="size-3.5" /> Candidate
            </button>
            <button
              onClick={() => setRole("recruiter")}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                role === "recruiter"
                  ? "bg-white text-primary shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="size-3.5" /> Employer
            </button>
          </div>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Fields */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Email Address
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-slate-50/50 px-3 py-1">
                  <Mail className="size-4 text-muted-foreground shrink-0" />
                  <Input
                    type="email"
                    required
                    placeholder={
                      role === "candidate"
                        ? "jane.doe@example.com"
                        : "recruiting@northwind.com"
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[11px] font-medium text-primary hover:underline"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-slate-50/50 px-3 py-1">
                  <Lock className="size-4 text-muted-foreground shrink-0" />
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm"
                  />
                </div>
              </div>

              {/* Submit Button Trigger */}
              <Button type="submit" className="w-full gap-2 h-11 mt-2 text-sm">
                Sign In as {role === "candidate" ? "Candidate" : "Employer"}{" "}
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="mt-6 border-t border-border pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                New to CareerBridge?{" "}
                <a
                  href="/signup"
                  className="font-semibold text-primary hover:underline"
                >
                  Create an account
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security context disclaimer footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          <span>SSL Secure 256-bit encrypted dynamic state parsing</span>
        </div>
      </div>
    </div>
  );
}
