"use client";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailIcon, LockIcon, UserIcon, ArrowRightIcon, Tick01Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent } from "@/components/ui/card";
import { useAppForm } from "@/hooks/use-app-form";
import { registerSchema } from "@/lib/zod-schemas";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useAppForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const { error } = await authClient.signUp.email({
        email: value.email,
        password: value.password,
        name: value.fullName,
      });

      if (error) {
        toast.error(error.message || "An error occurred during registration");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully!");
      router.push("/onboarding");
    },
  });

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] justify-center overflow-hidden bg-background px-4 py-12 sm:py-20">
      <div 
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(var(--color-primary) 1.5px, transparent 1.5px)`, backgroundSize: "24px 24px" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            Create Your Account
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Join the automated ecosystem connecting modern talent pools
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
              <form.AppField name="fullName">
                {(field) => (
                  <field.TextField
                    field={field}
                    label="Full Name"
                    labelClassName="text-xs font-semibold text-muted-foreground"
                    startIcon={<HugeiconsIcon icon={UserIcon} className="size-4 text-muted-foreground" />}
                    placeholder="Jane Doe"
                  />
                )}
              </form.AppField>

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

              <form.AppField name="password">
                {(field) => (
                  <field.PasswordField
                    field={field}
                    label="Choose Password"
                    labelClassName="text-xs font-semibold text-muted-foreground"
                    startIcon={<HugeiconsIcon icon={LockIcon} className="size-4 text-muted-foreground" />}
                    placeholder="Create a strong password"
                  />
                )}
              </form.AppField>

              <div className="flex items-start gap-2 pt-1 text-pretty text-[11px] leading-relaxed text-muted-foreground">
                <HugeiconsIcon icon={Tick01Icon} className="size-3.5 text-primary shrink-0 mt-0.5" />
                <span>
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </span>
              </div>

              <form.AppForm>
                <form.SubmitButton className="w-full gap-2 h-11 mt-2 text-sm" disabled={loading}>
                  {loading ? "Creating Account..." : "Get Started Now"}
                  {!loading && <HugeiconsIcon icon={ArrowRightIcon} className="size-4" />}
                </form.SubmitButton>
              </form.AppForm>
            </form>

            <div className="mt-6 border-t border-border pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Already registered?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
