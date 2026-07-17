"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { DocumentAttachmentIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/use-app-form";
import { useProfile } from "@/features/profiles/api/queries";
import { useApplyForJob } from "@/features/applications/api/mutations";
import { toast } from "sonner";
import { NativeSelect } from "@/components/ui/native-select";
import type { Resume } from "@/features/profiles/api/types";

interface ApplyJobDialogProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplyJobDialog({ jobId, jobTitle, companyName, open, onOpenChange }: ApplyJobDialogProps) {
  const { data: profile } = useProfile();
  const applyMutation = useApplyForJob();
  const resumes: Resume[] = profile?.resumes || [];
  const primaryResume = resumes.find((r) => r.is_default);

  const form = useAppForm({
    defaultValues: {
      resume_id: primaryResume?.id || resumes[0]?.id || "",
      cover_letter: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await applyMutation.mutateAsync({
          jobId,
          data: {
            resume_id: value.resume_id || undefined,
            cover_letter: value.cover_letter || undefined,
          },
        });
        toast.success("Application submitted successfully!");
        onOpenChange(false);
      } catch (error) {
        toast.error("Failed to submit application. Please try again.");
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Submit your application to {companyName}. Make sure your profile is up to date.
          </DialogDescription>
        </DialogHeader>

        {applyMutation.isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="size-12 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mb-4">
              <HugeiconsIcon icon={Tick02Icon} className="size-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Application Sent!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your application has been successfully submitted to {companyName}. 
              You can track its status in your dashboard.
            </p>
            <Button onClick={() => onOpenChange(false)} className="mt-6 w-full">
              Close
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4 pt-4"
          >
            <form.AppField name="resume_id">
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium leading-none">
                    Select Resume *
                  </label>
                  {resumes.length > 0 ? (
                    <NativeSelect
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    >
                      {resumes.map((resume) => (
                        <option key={resume.id} value={resume.id}>
                          {resume.title} {resume.is_default ? "(Primary)" : ""}
                        </option>
                      ))}
                    </NativeSelect>
                  ) : (
                    <div className="border border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center text-center bg-muted/50">
                      <HugeiconsIcon icon={DocumentAttachmentIcon} className="size-6 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">No resumes found</p>
                      <p className="text-xs text-muted-foreground mt-1 mb-3">
                        You need to upload a resume to your profile before applying.
                      </p>
                    </div>
                  )}
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
                  )}
                </div>
              )}
            </form.AppField>

            <form.AppField name="cover_letter">
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium leading-none">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                    placeholder={`Tell ${companyName} why you're a great fit for this role...`}
                  />
                </div>
              )}
            </form.AppField>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <form.AppForm>
                <form.SubmitButton disabled={resumes.length === 0}>
                  Submit Application
                </form.SubmitButton>
              </form.AppForm>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
