"use client";

import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { DocumentAttachmentIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAppForm } from "@/hooks/use-app-form";
import { useProfile } from "@/features/profiles/api/queries";
import { useApplyForJob } from "@/features/applications/api/mutations";
import { useCandidateApplications } from "@/features/applications/api/queries";
import { useJobApplicationForm } from "@/features/jobs/api/queries";
import { toast } from "@/components/ui/toast";
import { SelectItem } from "@/components/ui/select";
import type { Resume } from "@/features/profiles/api/types";
import type { Application } from "@/features/applications/api/types";
import { z } from "zod";

type JobApplicationFormProps = {
  jobId: string;
  jobTitle: string;
  companyName: string;
}

export function JobApplicationForm({ jobId, jobTitle, companyName }: JobApplicationFormProps) {
  const router = useRouter();
  const { data: profile } = useProfile();
  const applyMutation = useApplyForJob();
  const resumes: Resume[] = profile?.resumes || [];
  const primaryResume = resumes.find((r) => r.is_default);

  const { data: formDefinitionData, isLoading: isLoadingForm } = useJobApplicationForm(jobId);
  const { data: applications = [], isLoading: isLoadingApps } = useCandidateApplications();

  const formDefinition = formDefinitionData;
  const questions = formDefinition?.questions || [];

  const existingApp = applications.find((a: Application) => a.job_id === jobId);

  const defaultAnswers: Record<string, any> = {};
  questions.forEach(q => {
    if (!q.id) return;
    if (q.type === 'checkbox') defaultAnswers[q.id] = false;
    else if (q.type === 'multiple_choice') defaultAnswers[q.id] = "";
    else defaultAnswers[q.id] = "";
  });

  const form = useAppForm({
    defaultValues: {
      resume_id: existingApp?.resume_id || primaryResume?.id || resumes[0]?.id || "",
      cover_letter: existingApp?.cover_letter || "",
      answers: defaultAnswers as Record<string, any>, // TODO: fetch draft answers from API
    },
    onSubmit: async ({ value }) => {
      try {
        await applyMutation.mutateAsync({
          jobId,
          data: {
            form_id: formDefinition?.id,
            resume_id: value.resume_id || undefined,
            cover_letter: value.cover_letter || undefined,
            answers: value.answers,
            is_draft: false,
          },
        });
        toast.add({ type: "success", description: "Application submitted successfully!" });
        router.push("/dashboard/applications");
      } catch (err: any) {
        toast.add({ type: "error", description: err.message || "Failed to submit application. Please try again." });
      }
    },
  });

  const handleSaveDraft = async () => {
    try {
      const value = form.state.values;
      await applyMutation.mutateAsync({
        jobId,
        data: {
          form_id: formDefinition?.id,
          resume_id: value.resume_id || undefined,
          cover_letter: value.cover_letter || undefined,
          answers: value.answers,
          is_draft: true,
        },
      });
      toast.add({ type: "success", description: "Draft saved successfully!" });
      router.push("/dashboard/applications");
    } catch (err: any) {
      toast.add({ type: "error", description: err.message || "Failed to save draft." });
    }
  };

  if (isLoadingForm || isLoadingApps) {
    return <div>Loading application form...</div>;
  }

  return (
    <div className="bg-background rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {(!formDefinition || formDefinition.resume_required) && (
          <div className="space-y-4 border-b border-border pb-6">
            <h2 className="text-xl font-semibold">Resume</h2>
            {resumes.length > 0 ? (
              <form.AppField name="resume_id" validators={{ onChange: z.string().min(1, "Resume is required") }}>
                {(field) => (
                  <field.SelectField 
                    field={field}
                    label="Select Resume *"
                    renderValue={(value: unknown) => {
                      const resume = resumes.find((r) => r.id === value);
                      if (!resume) return null;
                      return `${resume.title}${resume.is_default ? ' (Primary)' : ''}`;
                    }}
                  >
                    {resumes.map((resume) => {
                      const label = `${resume.title}${resume.is_default ? ' (Primary)' : ''}`;
                      return (
                        <SelectItem key={resume.id} value={resume.id} label={label}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </field.SelectField>
                )}
              </form.AppField>
            ) : (
              <Empty className="bg-muted/50 p-4">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <HugeiconsIcon icon={DocumentAttachmentIcon} className="size-4" />
                  </EmptyMedia>
                  <EmptyTitle>No resumes found</EmptyTitle>
                  <EmptyDescription>
                    You need to upload a resume to your profile before applying.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Link href="/dashboard/profile" className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Upload Resume
                  </Link>
                </EmptyContent>
              </Empty>
            )}
          </div>
        )}

        <div className="space-y-4 border-b border-border pb-6">
          <h2 className="text-xl font-semibold">Cover Letter</h2>
          <form.AppField name="cover_letter">
            {(field) => (
              <field.TextareaField
                field={field}
                label="Cover Letter (Optional)"
                placeholder={`Tell ${companyName} why you're a great fit for this role...`}
                className="resize-y"
              />
            )}
          </form.AppField>
        </div>

        {questions.length > 0 && (
          <div className="space-y-6 border-b border-border pb-6">
            <h2 className="text-xl font-semibold">Additional Questions</h2>
            {questions.map((q) => {
              const fieldName = `answers.${q.id}` as any;
              
              // Determine validation
              let validator: z.ZodTypeAny = z.any();
              if (q.is_required) {
                if (q.type === 'checkbox') {
                  validator = z.boolean().refine(val => val === true, "This field is required");
                } else if (q.type === 'number') {
                  validator = z.coerce.number();
                } else {
                  validator = z.string().min(1, "This field is required");
                }
              }

              return (
                <form.AppField key={q.id} name={fieldName} validators={{ onChange: validator }}>
                  {(field) => {
                    if (q.type === 'short_text') {
                      return <field.TextField field={field} label={q.label + (q.is_required ? " *" : "")} />;
                    } else if (q.type === 'long_text') {
                      return <field.TextareaField field={field} label={q.label + (q.is_required ? " *" : "")} />;
                    } else if (q.type === 'number') {
                      return <field.NumberField field={field} label={q.label + (q.is_required ? " *" : "")} />;
                    } else if (q.type === 'checkbox') {
                      return (
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id={q.id} 
                            checked={field.state.value} 
                            onChange={(e) => field.handleChange(e.target.checked)} 
                            className="w-4 h-4"
                          />
                          <label htmlFor={q.id} className="text-sm font-medium">
                            {q.label} {q.is_required ? "*" : ""}
                          </label>
                          {field.state.meta.errors.length > 0 && (
                            <span className="text-xs text-destructive">{field.state.meta.errors.join(", ")}</span>
                          )}
                        </div>
                      );
                    } else if (q.type === 'multiple_choice') {
                      const options = q.options || [];
                      return (
                        <field.SelectField field={field} label={q.label + (q.is_required ? " *" : "")} renderValue={(val) => val as string}>
                          {options.map((opt: string) => (
                            <SelectItem key={opt} value={opt} label={opt}>{opt}</SelectItem>
                          ))}
                        </field.SelectField>
                      );
                    }
                    return null;
                  }}
                </form.AppField>
              );
            })}
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="button" variant="secondary" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <form.AppForm>
            <form.SubmitButton disabled={(!formDefinition || formDefinition.resume_required) && resumes.length === 0}>
              Submit Application
            </form.SubmitButton>
          </form.AppForm>
        </div>
      </form>
    </div>
  );
}
