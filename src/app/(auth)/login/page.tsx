"use client";
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
    <div className="relative flex min-h-[calc(100vh-4rem)] justify-center overflow-hidden bg-background px-4 py-12 sm:py-20">
      <div 
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(var(--color-primary) 1.5px, transparent 1.5px)`, backgroundSize: "24px 24px" }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Main Logo & Platform Context */}
        <div className="flex flex-col items-center text-center">
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
          <span>Secured by 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
}
