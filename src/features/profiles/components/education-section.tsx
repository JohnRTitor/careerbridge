"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  PlusSignIcon, 
  BookOpen01Icon,
  PencilEdit01Icon, 
  Delete02Icon, 
  Calendar01Icon, 
  Mortarboard01Icon 
} from "@hugeicons/core-free-icons";
import { Dialog, DialogPopup, DialogHeader, DialogTitle } from "@/components/animate-ui/components/base/dialog";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
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
import { useAppForm } from "@/hooks/use-app-form";
import type { Education, AddEducationPayload, UpdateEducationPayload } from "@/features/profiles/api/types";
import { useAddEducation, useUpdateEducation, useDeleteEducation } from "@/features/profiles/api/mutations";
import { format, parseISO } from "date-fns";
import FadeContent from "@/components/FadeContent";

type EducationFormProps = {
  education?: Education;
  onClose: () => void;
};

function EducationForm({ education, onClose }: EducationFormProps) {
  const addMutation = useAddEducation();
  const updateMutation = useUpdateEducation();
  const deleteMutation = useDeleteEducation();

  const form = useAppForm({
    defaultValues: {
      institution: education?.institution || "",
      degree: education?.degree || "",
      field_of_study: education?.field_of_study || "",
      start_date: education?.start_date ? new Date(education.start_date).toISOString().split('T')[0] : "",
      end_date: education?.end_date ? new Date(education.end_date).toISOString().split('T')[0] : "",
      description: education?.description || "",
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        end_date: value.end_date || undefined,
      };

      if (education) {
        await updateMutation.mutateAsync({ id: education.id, data: payload as UpdateEducationPayload });
      } else {
        await addMutation.mutateAsync(payload as AddEducationPayload);
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
      <form.AppField name="institution">
        {(field) => (
          <field.TextField
            field={field}
            label="Institution / School *"
            required
            placeholder="e.g. Stanford University"
          />
        )}
      </form.AppField>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="degree">
          {(field) => (
            <field.TextField
              field={field}
              label="Degree *"
              required
              placeholder="e.g. Bachelor of Science"
            />
          )}
        </form.AppField>
        <form.AppField name="field_of_study">
          {(field) => (
            <field.TextField
              field={field}
              label="Field of Study"
              placeholder="e.g. Computer Science"
            />
          )}
        </form.AppField>
      </div>

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
              label="End Date (or expected)"
            />
          )}
        </form.AppField>
      </div>

      <form.AppField name="description">
        {(field) => (
          <field.TextareaField
            field={field}
            label="Activities and Societies"
            placeholder="Describe your activities, honors, or relevant coursework..."
            className="min-h-25"
          />
        )}
      </form.AppField>

      <div className="flex justify-between pt-4 border-t border-border mt-4">
        {education ? (
          <AlertDialog>
            <AlertDialogTrigger render={<Button type="button" variant="destructive" size="icon" />}>
              <HugeiconsIcon icon={Delete02Icon} className="size-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Education</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove this education entry from your profile? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={async () => {
                    await deleteMutation.mutateAsync(education.id);
                    onClose();
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

export function EducationSection({ education }: { education: Education[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Education | undefined>();

  const openNew = () => {
    setSelectedItem(undefined);
    setIsOpen(true);
  };

  const openEdit = (item: Education) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Present";
    try {
      return format(parseISO(dateString), "yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <FadeContent blur={true} duration={1000} ease="ease-out" initialOpacity={0}>
    <Card className="border-border shadow-sm bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <HugeiconsIcon icon={Mortarboard01Icon} className="size-5" />
          </div>
          Education
        </CardTitle>
        <Button variant="outline" size="sm" onClick={openNew} className="h-8 gap-1">
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        {education.length > 0 ? (
          education.map((edu, index) => (
            <div key={edu.id} className="group relative">
              {index !== education.length - 1 && (
                <div className="absolute left-4.75 top-12 -bottom-6 w-px bg-border/60 hidden sm:block" />
              )}
              <div className="flex gap-4 items-start">
                <div className="size-10 rounded-full bg-muted hidden items-center justify-center shrink-0 border border-border sm:flex z-10">
                  <HugeiconsIcon icon={Mortarboard01Icon} className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-foreground text-base leading-snug">{edu.institution}</h3>
                      <p className="font-medium text-foreground text-sm mt-0.5">
                        {edu.degree}{edu.field_of_study ? `, ${edu.field_of_study}` : ""}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0 -mt-1 -mr-2" 
                      onClick={() => openEdit(edu)}
                    >
                      <HugeiconsIcon icon={PencilEdit01Icon} className="size-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={Calendar01Icon} className="size-3.5" />
                      {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                    </span>
                  </div>
                  
                  {edu.description && (
                    <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <Empty className="bg-muted/50 p-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={BookOpen01Icon} />
              </EmptyMedia>
              <EmptyTitle>No education added yet.</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" onClick={openNew} className="mt-2">
                Add Education
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogPopup className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit Education" : "Add Education"}</DialogTitle>
          </DialogHeader>
          <EducationForm education={selectedItem} onClose={() => setIsOpen(false)} />
        </DialogPopup>
      </Dialog>
    </Card>
    </FadeContent>
  );
}
