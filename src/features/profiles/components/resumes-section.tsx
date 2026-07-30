"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CloudUploadIcon,
  Delete02Icon,
  DocumentAttachmentIcon,
  EyeIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Empty,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@/components/ui/empty";
import { useAppForm } from "@/hooks/use-app-form";
import { format, parseISO } from "date-fns";
import {
  useAddResume,
  useDeleteResume,
  useUpdateResumeEntity,
} from "@/features/profiles/api/mutations";
import { useProfile } from "@/features/profiles/api/queries";
import type { Resume } from "@/features/profiles/api/types";
import { useSupabaseUpload } from "@/features/files/api/mutations";
import { useAppPermission } from "@/features/auth/api/queries";
import { SingleFileUploader } from "@/components/ui/single-file-uploader";
import { getPrivateAssetUrl } from "@/lib/assets";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ResumesSection() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: profile } = useProfile();
  const resumes = (profile?.resumes as Resume[]) || [];

  const { can } = useAppPermission();

  if (!can("resume", "create")) return null;

  const uploadMutation = useAddResume();
  const deleteMutation = useDeleteResume();
  const updateMutation = useUpdateResumeEntity();
  const fileUploadMutation = useSupabaseUpload();

  const form = useAppForm({
    defaultValues: {
      name: "",
      file: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      if (!value.file) return;

      const fileRecord = await fileUploadMutation.mutateAsync({
        file: value.file,
        bucket: "resumes",
      });

      const payload = {
        title: value.name || value.file.name,
        file_url: fileRecord.path,
        is_default: false,
      };

      await uploadMutation.mutateAsync(payload);
      setIsOpen(false);
    },
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="border-border shadow-sm bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <div className="p-2 bg-destructive/10 text-destructive rounded-lg">
            <HugeiconsIcon icon={DocumentAttachmentIcon} className="size-5" />
          </div>
          Resumes
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="h-8 gap-1"
        >
          <HugeiconsIcon icon={CloudUploadIcon} className="size-4" />
          Upload
        </Button>
      </CardHeader>
      <CardContent>
        {resumes.length > 0 ? (
          <div className="flex flex-col gap-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className={`group border rounded-xl p-3 transition-colors ${
                  resume.is_default
                    ? "bg-primary/5 border-primary/20"
                    : "bg-muted/50 hover:bg-muted border-border"
                }`}
              >
                <div className="flex items-start justify-between min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-8 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                      <HugeiconsIcon
                        icon={DocumentAttachmentIcon}
                        className="size-4 text-muted-foreground"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger render={<span className="truncate cursor-default" />}>
                            {resume.title}
                          </TooltipTrigger>
                          <TooltipContent>
                            {resume.title}
                          </TooltipContent>
                        </Tooltip>
                        {resume.is_default && (
                          <span className="shrink-0 text-[10px] uppercase font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">
                            Primary
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        Uploaded {formatDate(resume.uploaded_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                  <a
                    href={
                      getPrivateAssetUrl(null, {
                        bucket: "resumes",
                        path: resume.file_url,
                      }) || "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors"
                  >
                    <HugeiconsIcon icon={EyeIcon} className="size-3.5" />
                    View
                  </a>
                  <div className="w-px h-3 bg-border" />
                  {!resume.is_default && (
                    <>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:no-underline font-medium transition-colors cursor-pointer"
                        onClick={() =>
                          updateMutation.mutate({
                            id: resume.id,
                            data: { is_default: true },
                          })
                        }
                        disabled={updateMutation.isPending}
                      >
                        <HugeiconsIcon icon={Tick02Icon} className="size-3.5" />
                        Set Primary
                      </Button>
                      <div className="w-px h-3 bg-border" />
                    </>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="link"
                          className="h-auto p-0 text-xs flex items-center gap-1.5 text-destructive hover:text-destructive hover:no-underline font-medium transition-colors cursor-pointer ml-auto"
                        />
                      }
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                      Delete
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this resume? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={async () => {
                            await deleteMutation.mutateAsync(resume.id);
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty className="rounded-xl">
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={DocumentAttachmentIcon} />
            </EmptyMedia>
            <EmptyTitle>No resumes uploaded yet.</EmptyTitle>
            <EmptyDescription>
              Upload your resume to easily apply for jobs.
            </EmptyDescription>
            <EmptyContent>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="mt-2"
              >
                Upload Resume
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Resume</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4 pt-4"
          >
            <form.AppField name="name">
              {(field) => (
                <field.TextField
                  field={field}
                  label="Document Name (Optional)"
                  placeholder="e.g. Frontend Engineer Resume"
                />
              )}
            </form.AppField>

            <form.AppField name="file">
              {(field) => (
                <div className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    PDF File *
                  </label>
                  <SingleFileUploader
                    key={isOpen ? "open" : "closed"}
                    onChange={(f) => field.handleChange(f || undefined)}
                    accept="application/pdf"
                    maxSize={5 * 1024 * 1024}
                    disabled={fileUploadMutation.isPending}
                  />
                </div>
              )}
            </form.AppField>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <form.Subscribe selector={(state) => state.values.file}>
                {(file) => (
                  <form.SubmitButton
                    disabled={!file || fileUploadMutation.isPending}
                  >
                    {fileUploadMutation.isPending ? "Uploading..." : "Upload Resume"}
                  </form.SubmitButton>
                )}
              </form.Subscribe>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
