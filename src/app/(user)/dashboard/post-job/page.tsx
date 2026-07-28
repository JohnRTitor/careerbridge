"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, BriefcaseIcon } from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppForm } from "@/hooks/use-app-form";
import { useCreateJob } from "@/features/recruiters/api/mutations";
import { useRecruiterProfile } from "@/features/recruiters/api/queries";
import { toast } from "sonner";
import { SelectItem } from "@/components/ui/select";
import { useCurrencies } from "@/features/meta/api/queries";
import { CreateJobSchema } from "@server/features/recruiters/recruiters.schemas";

export default function PostJobPage() {
  const router = useRouter();
  const createJobMutation = useCreateJob();
  const { data: profile } = useRecruiterProfile();
  const { data: currencies = [], isLoading: isLoadingCurrencies } = useCurrencies();

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      type: "full-time" as "full-time" | "part-time" | "contract" | "internship" | "freelance",
      minimum_salary: undefined as number | undefined,
      maximum_salary: undefined as number | undefined,
      currency: "USD",
    },
    validators: {
      // @ts-expect-error - schema fields are optional but form requires them
      onChange: CreateJobSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createJobMutation.mutateAsync({
          ...value,
          minimum_salary: value.minimum_salary ? Number(value.minimum_salary) : undefined,
          maximum_salary: value.maximum_salary ? Number(value.maximum_salary) : undefined,
          status: "open",
          company_id: profile?.company_id || undefined,
        });
        toast.success("Job posted successfully!");
        router.push("/dashboard");
      } catch {
        toast.error("Failed to post job. Please try again.");
      }
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-background py-12">
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          Back to Dashboard
        </Link>

        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-muted/50 pb-6 pt-8">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <HugeiconsIcon icon={BriefcaseIcon} className="size-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Create New Job Posting</CardTitle>
                <CardDescription className="text-base mt-1">
                  Fill out the details below to publish a new open role.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              <form.AppField name="title">
                {(field) => (
                  <field.TextField
                    field={field}
                    label="Job Title *"
                    placeholder="e.g. Senior Frontend Engineer"
                    className="h-11"
                  />
                )}
              </form.AppField>

              <div className="grid sm:grid-cols-2 gap-6">
                <form.AppField name="location">
                  {(field) => (
                     <field.TextField
                      field={field}
                      label="Location"
                      placeholder="e.g. Remote, San Francisco"
                      className="h-11"
                    />
                  )}
                </form.AppField>

                <form.AppField name="type">
                  {(field) => (
                    <field.SelectField
                      field={field}
                      label="Employment Type"
                    >
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </field.SelectField>
                  )}
                </form.AppField>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <form.AppField name="minimum_salary">
                  {(field) => (
                    <field.NumberField
                      field={field}
                      label="Minimum Salary"
                      placeholder="e.g. 120000"
                      className="h-11"
                    />
                  )}
                </form.AppField>

                <form.AppField name="maximum_salary">
                  {(field) => (
                    <field.NumberField
                      field={field}
                      label="Maximum Salary"
                      placeholder="e.g. 150000"
                      className="h-11"
                    />
                  )}
                </form.AppField>

                <form.AppField name="currency">
                  {(field) => (
                    <field.SelectField
                      field={field}
                      label="Currency"
                      placeholder={isLoadingCurrencies ? "Loading..." : "Select currency"}
                      disabled={isLoadingCurrencies}
                    >
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </field.SelectField>
                  )}
                </form.AppField>
              </div>

              <form.AppField name="description">
                {(field) => (
                  <field.TextareaField
                    field={field}
                    label="Job Description *"
                    placeholder="Describe the role, responsibilities, and requirements..."
                    className="flex min-h-62.5 resize-y"
                  />
                )}
              </form.AppField>

              <div className="pt-6 border-t border-border flex justify-end gap-3">
                <Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  Cancel
                </Link>
                <form.AppForm>
                  <form.SubmitButton size="lg" className="px-8 bg-primary">
                    Post Job
                  </form.SubmitButton>
                </form.AppForm>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
