"use client";
import Image from "next/image";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailIcon, LockIcon, ArrowRightIcon, Shield02Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent } from "@/components/ui/card";
import { useAppForm } from "@/hooks/use-app-form";
import { loginSchema } from "@/lib/zod-schemas";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const { data, error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });

      if (error) {
        toast.error(error.message || "Login failed");
        setLoading(false);
        return;
      }

      toast.success("Login successful!");
      
      const userRole = data?.user?.role;
      if (!userRole) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    },
  });

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-linear-to-b from-[#e0efff] via-[#f0f7ff] to-background px-4 py-12"
      style={{
        backgroundImage: `radial-gradient(#c2deff 1px, transparent 1px), linear-gradient(to bottom, #e0efff, #f0f7ff, #ffffff)`,
        backgroundSize: "24px 24px, 100% 100%",
      }}
    >
      <div className="w-full max-w-md space-y-6">
        {/* Main Logo & Platform Context */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-1.5 mb-2">
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
          </Link>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            Welcome Back
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Access your CareerBridge account
          </p>
        </div>

        <Card className="bg-card border-border shadow-md rounded-2xl overflow-hidden">

          <CardContent className="p-6 sm:p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              {/* Email Fields */}
              <form.AppField name="email">
                {(field) => (
                  <field.TextField
                    field={field}
                    label="Email Address"
                    labelClassName="text-xs font-semibold text-muted-foreground"
                    startIcon={<HugeiconsIcon icon={MailIcon} className="size-4 text-muted-foreground" />}
                    placeholder="name@example.com"
                  />
                )}
              </form.AppField>

              {/* Password Fields */}
              <form.AppField name="password">
                {(field) => (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor={field.name} className="text-xs font-semibold text-muted-foreground">
                        Password
                      </label>
                      <span
                        className="text-[11px] font-medium text-muted-foreground"
                      >
                        Forgot?
                      </span>
                    </div>
                    <field.PasswordField
                      field={field}
                      startIcon={<HugeiconsIcon icon={LockIcon} className="size-4 text-muted-foreground" />}
                      placeholder="••••••••"
                      label=""
                      labelClassName="hidden"
                    />
                  </div>
                )}
              </form.AppField>

              {/* Submit Button Trigger */}
              <form.AppForm>
                <form.SubmitButton
                  className="w-full gap-2 h-11 mt-2 text-sm"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                  {!loading && <HugeiconsIcon icon={ArrowRightIcon} className="size-4" />}
                </form.SubmitButton>
              </form.AppForm>
            </form>

            <div className="mt-6 border-t border-border pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                New to CareerBridge?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-primary hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security context disclaimer footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <HugeiconsIcon icon={Shield02Icon} className="size-3.5 text-emerald-600" />
          <span>SSL Secure 256-bit encrypted dynamic state parsing</span>
        </div>
      </div>
    </div>
  );
}
