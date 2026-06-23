"use client";

import { useForm } from "@tanstack/react-form";

import { registerSchema } from "@/lib/zod-schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth.actions";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: "candidate" as "candidate" | "recruiter",
    },
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      
      const result = await registerAction({
        fullName: value.fullName,
        email: value.email,
        password: value.password,
        confirmPassword: value.confirmPassword,
        accountType: value.accountType,
      });

      if (result.error) {
        toast.error(result.error);
        setLoading(false);
        return;
      }

      toast.success("Account created successfully!");
      
      const role = result.user?.role || "candidate";
      if (role === "admin") router.push("/admin");
      else if (role === "recruiter") router.push("/recruiter");
      else if (role === "candidate") router.push("/candidate");
      else router.push("/onboarding");
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="fullName"
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Full Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="John Doe"
                  />
                  {field.state.meta.errors ? (
                    <p className="text-sm font-medium text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name="email"
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="email"
                    placeholder="name@example.com"
                  />
                  {field.state.meta.errors ? (
                    <p className="text-sm font-medium text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="password"
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Password</Label>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <HugeiconsIcon icon={showPassword ? EyeOffIcon : EyeIcon} size={18} />
                      </button>
                    </div>
                    {field.state.meta.errors ? (
                      <p className="text-sm font-medium text-destructive">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="confirmPassword"
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <HugeiconsIcon icon={showConfirmPassword ? EyeOffIcon : EyeIcon} size={18} />
                      </button>
                    </div>
                    {field.state.meta.errors ? (
                      <p className="text-sm font-medium text-destructive">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field
              name="accountType"
            >
              {(field) => (
                <div className="space-y-3 pt-2">
                  <Label>Account Type</Label>
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="candidate" id="r1" />
                      <Label htmlFor="r1" className="font-normal">I&apos;m a Candidate looking for jobs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recruiter" id="r2" />
                      <Label htmlFor="r2" className="font-normal">I&apos;m a Recruiter hiring talent</Label>
                    </div>
                  </RadioGroup>
                  {field.state.meta.errors ? (
                    <p className="text-sm font-medium text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <span>Already have an account?</span>
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
