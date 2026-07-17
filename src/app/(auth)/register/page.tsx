"use client";
import Image from "next/image";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailIcon, LockIcon, UserIcon, ArrowRightIcon, Tick01Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent } from "@/components/ui/card";
import { useAppForm } from "@/hooks/use-app-form";
import { registerSchema } from "@/lib/zod-schemas";
import { registerAction } from "@/app/actions/auth.actions";
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
      const result = await registerAction(value);

      if (result.error) {
        toast.error(result.error);
        setLoading(false);
        return;
      }

      toast.success("Account created successfully!");
      router.push("/onboarding");
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
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-1.5 mb-2">
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
          </Link>
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
                  By checking setup parameters, you agree to the default Terms
                  of System Operation and Automated Data Policies.
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
                  Sign inside here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
