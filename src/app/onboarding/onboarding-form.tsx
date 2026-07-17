"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRightIcon } from "@hugeicons/core-free-icons";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SelectItem } from "@/components/ui/select";
import { useAppForm } from "@/hooks/use-app-form";
import { onboardingSchema } from "@/lib/zod-schemas";
import { submitOnboardingAction } from "@/app/actions/auth.actions";

export function OnboardingForm({ user }: { user: { name: string; email: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useAppForm({
    defaultValues: {
      accountType: "candidate" as "candidate" | "recruiter",
      dateOfBirth: undefined as unknown as Date,
      gender: "" as unknown as "male" | "female" | "other" | "prefer_not_to_say",
    },
    validators: {
      onChange: onboardingSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const result = await submitOnboardingAction(value);

      if (result.error) {
        toast.error(result.error);
        setLoading(false);
        return;
      }

      toast.success("Profile updated successfully!");
      if (value.accountType === "candidate") {
        router.push("/candidate_dashboard");
      } else {
        router.push("/recruiter_dashboard");
      }
    },
  });

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold">Welcome, {user.name}!</CardTitle>
        <CardDescription>
          We need a few more details to personalize your CareerBridge experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6 mt-4"
        >
          <div className="space-y-4">
            <form.AppField name="accountType">
              {(field) => (
                <field.SelectField
                  field={field}
                  label="How do you want to use CareerBridge?"
                  labelClassName="text-sm font-semibold"
                  placeholder="Select an account type"
                >
                  <SelectItem value="candidate">I&apos;m looking for work</SelectItem>
                  <SelectItem value="recruiter">I&apos;m hiring talent</SelectItem>
                </field.SelectField>
              )}
            </form.AppField>

            <form.AppField name="dateOfBirth">
              {(field) => (
                <field.DateField
                  field={field}
                  label="Date of Birth"
                  labelClassName="text-sm font-semibold"
                  placeholder="Select your birth date"
                  captionLayout="dropdown"
                  startMonth={new Date(1900, 0)}
                  endMonth={new Date()}
                />
              )}
            </form.AppField>

            <form.AppField name="gender">
              {(field) => (
                <field.SelectField
                  field={field}
                  label="Gender"
                  labelClassName="text-sm font-semibold"
                  placeholder="Select your gender"
                >
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </field.SelectField>
              )}
            </form.AppField>
          </div>

          <form.AppForm>
            <form.SubmitButton className="w-full gap-2 h-11" disabled={loading}>
              {loading ? "Saving Details..." : "Complete Setup"}
              {!loading && <HugeiconsIcon icon={ArrowRightIcon} className="size-4" />}
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </CardContent>
    </Card>
  );
}
