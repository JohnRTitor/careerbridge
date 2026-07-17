"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, BriefcaseIcon } from "@hugeicons/core-free-icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { useAppForm } from "@/hooks/use-app-form";
import { useCreateJob } from "@/features/recruiters/api/mutations";
import { useRecruiterProfile } from "@/features/recruiters/api/queries";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function PostJobPage() {
  const router = useRouter();
  const createJobMutation = useCreateJob();
  const { data: profile } = useRecruiterProfile();

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      type: "full-time" as "full-time" | "part-time" | "contract" | "internship" | "freelance",
      salary_range: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await createJobMutation.mutateAsync({
          ...value,
          status: "open",
          company_id: profile?.company_id || undefined,
        });
        toast.success("Job posted successfully!");
        router.push("/dashboard");
      } catch (error) {
        toast.error("Failed to post job. Please try again.");
      }
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faff] py-12">
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          Back to Dashboard
        </Link>

        <Card className="bg-white border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-slate-50/50 pb-6 pt-8">
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
                  <div className="space-y-2">
                    <label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                      Job Title *
                    </label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="h-11"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive font-medium">{field.state.meta.errors.join(", ")}</p>
                    )}
                  </div>
                )}
              </form.AppField>

              <div className="grid sm:grid-cols-2 gap-6">
                <form.AppField name="location">
                  {(field) => (
                    <div className="space-y-2">
                      <label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                        Location
                      </label>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. Remote, San Francisco"
                        className="h-11"
                      />
                    </div>
                  )}
                </form.AppField>

                <form.AppField name="type">
                  {(field) => (
                    <div className="space-y-2">
                      <label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                        Employment Type
                      </label>
                      <NativeSelect
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value as "full-time" | "part-time" | "contract" | "internship" | "freelance")}
                        className="h-11"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                        <option value="freelance">Freelance</option>
                      </NativeSelect>
                    </div>
                  )}
                </form.AppField>
              </div>

              <form.AppField name="salary_range">
                {(field) => (
                  <div className="space-y-2">
                    <label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                      Salary Range
                    </label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. $120k - $150k"
                      className="h-11"
                    />
                  </div>
                )}
              </form.AppField>

              <form.AppField name="description">
                {(field) => (
                  <div className="space-y-2">
                    <label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                      Job Description *
                    </label>
                    <textarea
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Describe the role, responsibilities, and requirements..."
                      className="flex min-h-[250px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive font-medium">{field.state.meta.errors.join(", ")}</p>
                    )}
                  </div>
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
