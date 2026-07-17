"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  PlusSignIcon, 
  PencilEdit01Icon, 
  Delete02Icon, 
  Folder01Icon,
  GithubIcon,
  Link01Icon,
  Calendar01Icon
} from "@hugeicons/core-free-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/use-app-form";
import type { Project, AddProjectPayload, UpdateProjectPayload } from "@/features/profiles/api/types";
import { useAddProject, useUpdateProject, useDeleteProject } from "@/features/profiles/api/mutations";
import { format, parseISO } from "date-fns";

type ProjectFormProps = {
  project?: Project;
  onClose: () => void;
};

function ProjectForm({ project, onClose }: ProjectFormProps) {
  const addMutation = useAddProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const form = useAppForm({
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      repository_url: project?.repository_url || "",
      live_url: project?.live_url || "",
      start_date: project?.start_date ? new Date(project.start_date).toISOString().split('T')[0] : "",
      end_date: project?.end_date ? new Date(project.end_date).toISOString().split('T')[0] : "",
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        end_date: value.end_date || undefined,
        repository_url: value.repository_url || undefined,
        live_url: value.live_url || undefined,
      };

      if (project) {
        await updateMutation.mutateAsync({ id: project.id, data: payload as UpdateProjectPayload });
      } else {
        await addMutation.mutateAsync(payload as AddProjectPayload);
      }
      onClose();
    },
  });

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4 pt-4"
    >
      <form.AppField name="title">
        {(field) => (
          <field.TextField
            field={field}
            label="Project Title *"
            required
          />
        )}
      </form.AppField>

      <form.AppField name="description">
        {(field) => (
          <field.TextareaField
            field={field}
            label="Description *"
            required
            className="min-h-[100px]"
          />
        )}
      </form.AppField>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="start_date">
          {(field) => (
            <field.DateField
              field={field}
              label="Start Date *"
              required
            />
          )}
        </form.AppField>
        <form.AppField name="end_date">
          {(field) => (
            <field.DateField
              field={field}
              label="End Date"
            />
          )}
        </form.AppField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="repository_url">
          {(field) => (
            <field.TextField
              field={field}
              label="Repository URL"
              type="url"
              placeholder="https://github.com/..."
            />
          )}
        </form.AppField>
        <form.AppField name="live_url">
          {(field) => (
            <field.TextField
              field={field}
              label="Live Demo URL"
              type="url"
              placeholder="https://"
            />
          )}
        </form.AppField>
      </div>

      <div className="flex justify-between pt-4 border-t border-border mt-4">
        {project ? (
          <Button 
            type="button" 
            variant="destructive" 
            size="icon"
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this project?")) {
                await deleteMutation.mutateAsync(project.id);
                onClose();
              }
            }}
          >
            <HugeiconsIcon icon={Delete02Icon} className="size-4" />
          </Button>
        ) : (
          <div />
        )}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <form.AppForm>
            <form.SubmitButton>
              Save
            </form.SubmitButton>
          </form.AppForm>
        </div>
      </div>
    </form>
  );
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Project | undefined>();

  const openNew = () => {
    setSelectedItem(undefined);
    setIsOpen(true);
  };

  const openEdit = (item: Project) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Present";
    try {
      return format(parseISO(dateString), "MMM yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="border-border shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <HugeiconsIcon icon={Folder01Icon} className="size-5" />
          </div>
          Projects
        </CardTitle>
        <Button variant="outline" size="sm" onClick={openNew} className="h-8 gap-1">
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        {projects.length > 0 ? (
          projects.map((proj, index) => (
            <div key={proj.id} className="group relative">
              {index !== projects.length - 1 && (
                <div className="absolute left-[19px] top-12 bottom-[-24px] w-px bg-border/60 hidden sm:block" />
              )}
              <div className="flex gap-4 items-start">
                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-border sm:flex hidden z-10">
                  <HugeiconsIcon icon={Folder01Icon} className="size-4 text-slate-500" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-foreground text-base leading-snug">{proj.title}</h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0 -mt-1 -mr-2" 
                      onClick={() => openEdit(proj)}
                    >
                      <HugeiconsIcon icon={PencilEdit01Icon} className="size-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={Calendar01Icon} className="size-3.5" />
                      {formatDate(proj.start_date)} - {formatDate(proj.end_date)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap leading-relaxed">
                    {proj.description}
                  </p>

                  {(proj.repository_url || proj.live_url) && (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {proj.repository_url && (
                        <a 
                          href={proj.repository_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs bg-white border border-border px-3 py-1.5 rounded-md text-foreground flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
                        >
                          <HugeiconsIcon icon={GithubIcon} className="size-3.5" />
                          Code
                        </a>
                      )}
                      {proj.live_url && (
                        <a 
                          href={proj.live_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
                        >
                          <HugeiconsIcon icon={Link01Icon} className="size-3.5" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 border border-dashed border-border rounded-xl bg-slate-50/50">
            <p className="text-muted-foreground text-sm mb-4">No projects added yet.</p>
            <Button variant="outline" size="sm" onClick={openNew}>
              Add Project
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          <ProjectForm project={selectedItem} onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
