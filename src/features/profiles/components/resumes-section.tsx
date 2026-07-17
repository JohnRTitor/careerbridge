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
  Tick02Icon
} from "@hugeicons/core-free-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/use-app-form";
import { format, parseISO } from "date-fns";
import { useAddResume, useDeleteResume, useUpdateResumeEntity } from "@/features/profiles/api/mutations";
import { useProfile } from "@/features/profiles/api/queries";

export function ResumesSection() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: profile } = useProfile();
  const resumes = (profile?.resumes as any[]) || [];
  
  const uploadMutation = useAddResume();
  const deleteMutation = useDeleteResume();
  const updateMutation = useUpdateResumeEntity();

  const form = useAppForm({
    defaultValues: {
      name: "",
      file: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      if (!value.file) return;
      
      const payload = {
        title: value.name || value.file.name,
        file_url: "https://example.com/dummy.pdf", // Mock URL since real upload is not implemented yet
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
    <Card className="border-border shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
            <HugeiconsIcon icon={DocumentAttachmentIcon} className="size-5" />
          </div>
          Resumes
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="h-8 gap-1">
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
                  resume.is_default ? "bg-rose-50/30 border-rose-200" : "bg-slate-50/50 hover:bg-slate-50 border-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-white border border-border flex items-center justify-center shrink-0">
                      <HugeiconsIcon icon={DocumentAttachmentIcon} className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                        {resume.title}
                        {resume.is_default && (
                          <span className="text-[10px] uppercase font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-sm">
                            Primary
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Uploaded {formatDate(resume.uploaded_at)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                  <a 
                    href={resume.file_url} 
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
                      <button 
                        className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
                        onClick={() => updateMutation.mutate({ id: resume.id, data: { is_default: true } })}
                        disabled={updateMutation.isPending}
                      >
                        <HugeiconsIcon icon={Tick02Icon} className="size-3.5" />
                        Set Primary
                      </button>
                      <div className="w-px h-3 bg-border" />
                    </>
                  )}
                  <button 
                    className="text-xs flex items-center gap-1.5 text-rose-500 hover:text-rose-600 font-medium transition-colors cursor-pointer ml-auto"
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to delete this resume?")) {
                        await deleteMutation.mutateAsync(resume.id);
                      }
                    }}
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-border rounded-xl bg-slate-50/50">
            <p className="text-muted-foreground text-sm mb-4">No resumes uploaded yet.</p>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
              Upload Resume
            </Button>
          </div>
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
                  <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    PDF File *
                  </label>
                  <input
                    type="file"
                    id={field.name}
                    accept=".pdf"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.handleChange(file as any);
                      }
                    }}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Max file size: 5MB. PDF only.</p>
                </div>
              )}
            </form.AppField>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <form.AppForm>
                <form.SubmitButton disabled={!form.state.values.file}>
                  Upload Resume
                </form.SubmitButton>
              </form.AppForm>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
