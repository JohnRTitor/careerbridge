"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Briefcase01Icon, PlusSignIcon, PencilEdit01Icon, Delete02Icon, Calendar01Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/use-app-form";
import type { Experience, AddExperiencePayload, UpdateExperiencePayload } from "@/features/profiles/api/types";
import { useAddExperience, useUpdateExperience, useDeleteExperience } from "@/features/profiles/api/mutations";
import { format, parseISO } from "date-fns";

type ExperienceFormProps = {
  experience?: Experience;
  onClose: () => void;
};

function ExperienceForm({ experience, onClose }: ExperienceFormProps) {
  const addMutation = useAddExperience();
  const updateMutation = useUpdateExperience();
  const deleteMutation = useDeleteExperience();

  const form = useAppForm({
    defaultValues: {
      title: experience?.title || "",
      company: experience?.company || "",
      location: experience?.location || "",
      start_date: experience?.start_date ? new Date(experience.start_date).toISOString().split('T')[0] : "",
      end_date: experience?.end_date ? new Date(experience.end_date).toISOString().split('T')[0] : "",
      description: experience?.description || "",
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        end_date: value.end_date || undefined,
      };

      if (experience) {
        await updateMutation.mutateAsync({ id: experience.id, data: payload as UpdateExperiencePayload });
      } else {
        await addMutation.mutateAsync(payload as AddExperiencePayload);
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
      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="title">
          {(field) => (
            <field.TextField
              field={field}
              label="Job Title *"
              required
            />
          )}
        </form.AppField>
        <form.AppField name="company">
          {(field) => (
            <field.TextField
              field={field}
              label="Company *"
              required
            />
          )}
        </form.AppField>
      </div>

      <form.AppField name="location">
        {(field) => (
          <field.TextField
            field={field}
            label="Location"
            placeholder="e.g. San Francisco, CA or Remote"
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
              description="Leave blank if currently working here"
            />
          )}
        </form.AppField>
      </div>

      <form.AppField name="description">
        {(field) => (
          <field.TextareaField
            field={field}
            label="Description"
            placeholder="Describe your responsibilities and achievements..."
            className="min-h-[100px]"
          />
        )}
      </form.AppField>

      <div className="flex justify-between pt-4 border-t border-border mt-4">
        {experience ? (
          <Button 
            type="button" 
            variant="destructive" 
            size="icon"
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this experience?")) {
                await deleteMutation.mutateAsync(experience.id);
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

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Experience | undefined>();

  const openNew = () => {
    setSelectedItem(undefined);
    setIsOpen(true);
  };

  const openEdit = (item: Experience) => {
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
    <Card className="border-border shadow-sm bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <HugeiconsIcon icon={Briefcase01Icon} className="size-5" />
          </div>
          Experience
        </CardTitle>
        <Button variant="outline" size="sm" onClick={openNew} className="h-8 gap-1">
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        {experience.length > 0 ? (
          experience.map((exp, index) => (
            <div key={exp.id} className="group relative">
              {index !== experience.length - 1 && (
                <div className="absolute left-[19px] top-12 bottom-[-24px] w-px bg-border/60 hidden sm:block" />
              )}
              <div className="flex gap-4 items-start">
                <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border sm:flex hidden z-10">
                  <HugeiconsIcon icon={Briefcase01Icon} className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-foreground text-base leading-snug">{exp.title}</h3>
                      <p className="font-medium text-primary text-sm">{exp.company}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0 -mt-1 -mr-2" 
                      onClick={() => openEdit(exp)}
                    >
                      <HugeiconsIcon icon={PencilEdit01Icon} className="size-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={Calendar01Icon} className="size-3.5" />
                      {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1.5">
                        <HugeiconsIcon icon={Location01Icon} className="size-3.5" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                  
                  {exp.description && (
                    <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 border border-dashed border-border rounded-xl bg-muted/50">
            <p className="text-muted-foreground text-sm mb-4">No experience added yet.</p>
            <Button variant="outline" size="sm" onClick={openNew}>
              Add Experience
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit Experience" : "Add Experience"}</DialogTitle>
          </DialogHeader>
          <ExperienceForm experience={selectedItem} onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
