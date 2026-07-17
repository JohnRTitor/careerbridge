"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  PlusSignIcon, 
  PencilEdit01Icon, 
  Delete02Icon, 
  Settings02Icon
} from "@hugeicons/core-free-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/use-app-form";
import type { Skill, AddUserSkillPayload, UpdateUserSkillPayload } from "@/features/profiles/api/types";
import { useAddUserSkill, useUpdateUserSkill, useDeleteUserSkill } from "@/features/profiles/api/mutations";

type SkillFormProps = {
  skill?: Skill;
  onClose: () => void;
};

function SkillForm({ skill, onClose }: SkillFormProps) {
  const addMutation = useAddUserSkill();
  const updateMutation = useUpdateUserSkill();
  const deleteMutation = useDeleteUserSkill();

  const form = useAppForm({
    defaultValues: {
      skill_name: skill?.skill_name || "",
      proficiency: skill?.proficiency || "intermediate",
      years_of_experience: skill?.years_of_experience || 1,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        skill_id: "00000000-0000-0000-0000-000000000000", // TODO: Implement meta autocomplete
        years_of_experience: Number(value.years_of_experience),
        // value.proficiency is string like "intermediate" but we map to number for now or change schema later
        proficiency: ["beginner", "intermediate", "advanced", "expert"].indexOf(value.proficiency as string) + 1,
      };

      if (skill) {
        await updateMutation.mutateAsync({ id: skill.skill_id, data: payload as UpdateUserSkillPayload });
      } else {
        await addMutation.mutateAsync(payload as AddUserSkillPayload);
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
      <form.AppField name="skill_name">
        {(field) => (
          <field.TextField
            field={field}
            label="Skill Name *"
            disabled={!!skill}
            required
            placeholder="e.g. React, TypeScript, Figma"
          />
        )}
      </form.AppField>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="proficiency">
          {(field) => (
            <field.NativeSelectField
              field={field}
              label="Proficiency"
              options={[
                { value: "beginner", label: "Beginner" },
                { value: "intermediate", label: "Intermediate" },
                { value: "advanced", label: "Advanced" },
                { value: "expert", label: "Expert" },
              ]}
            />
          )}
        </form.AppField>
        
        <form.AppField name="years_of_experience">
          {(field) => (
            <field.NumberField
              field={field}
              label="Years of Experience"
              min={0}
              step={0.5}
            />
          )}
        </form.AppField>
      </div>

      <div className="flex justify-between pt-4 border-t border-border mt-4">
        {skill ? (
          <Button 
            type="button" 
            variant="destructive" 
            size="icon"
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this skill?")) {
                await deleteMutation.mutateAsync(skill.skill_id);
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

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Skill | undefined>();

  const openNew = () => {
    setSelectedItem(undefined);
    setIsOpen(true);
  };

  const openEdit = (item: Skill) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  return (
    <Card className="border-border shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <HugeiconsIcon icon={Settings02Icon} className="size-5" />
          </div>
          Skills
        </CardTitle>
        <Button variant="outline" size="sm" onClick={openNew} className="h-8 gap-1">
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        {skills.length > 0 ? (
          <div className="flex flex-col gap-3">
            {skills.map((skill) => (
              <div key={skill.skill_id} className="group flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{skill.skill_name || "Unknown"}</h4>
                  <p className="text-xs text-muted-foreground capitalize mt-0.5">
                    {skill.proficiency} · {skill.years_of_experience} yrs
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0" 
                  onClick={() => openEdit(skill)}
                >
                  <HugeiconsIcon icon={PencilEdit01Icon} className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-border rounded-xl bg-slate-50/50">
            <p className="text-muted-foreground text-sm mb-4">No skills added yet.</p>
            <Button variant="outline" size="sm" onClick={openNew}>
              Add Skills
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit Skill" : "Add Skill"}</DialogTitle>
          </DialogHeader>
          <SkillForm skill={selectedItem} onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
