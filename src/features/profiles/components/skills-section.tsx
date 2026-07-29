"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  PlusSignIcon, 
  PencilEdit01Icon, 
  Delete02Icon, 
  Settings02Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { SelectItem } from "@/components/ui/select";
import { ComboboxList, ComboboxItem, ComboboxEmpty } from "@/components/ui/combobox";
import { useAppForm } from "@/hooks/use-app-form";
import type { Skill, AddUserSkillPayload, UpdateUserSkillPayload } from "@/features/profiles/api/types";
import { useAddUserSkill, useUpdateUserSkill, useDeleteUserSkill } from "@/features/profiles/api/mutations";
import { useSkills } from "@/features/meta/api/queries";
import { useCreateSkill } from "@/features/meta/api/mutations";
import { useDebounce } from "@reactuses/core";

type SkillFormProps = {
  skill?: Skill;
  onClose: () => void;
};

function SkillForm({ skill, onClose }: SkillFormProps) {
  const addMutation = useAddUserSkill();
  const updateMutation = useUpdateUserSkill();
  const deleteMutation = useDeleteUserSkill();
  const createSkillMutation = useCreateSkill();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { data: suggestions = [] } = useSkills(debouncedQuery);

  const form = useAppForm({
    defaultValues: {
      skill: skill ? { value: skill.skill_id, label: skill.skill_name } : null as { value: string, label: string } | null,
      skill_name: skill?.skill_name || "",
      proficiency: typeof skill?.proficiency === 'number' ? ["beginner", "intermediate", "advanced", "expert"][skill.proficiency - 1] : (skill?.proficiency || "intermediate"),
      years_of_experience: skill?.years_of_experience || 1,
    },
    onSubmit: async ({ value }) => {
      let finalSkillId = value.skill?.value;
      
      // If no valid UUID is present but we have a name, it means it's a new skill added by the user
      if (!finalSkillId || finalSkillId === "new") {
        const newSkill = await createSkillMutation.mutateAsync({ name: value.skill_name });
        finalSkillId = newSkill.id;
      }

      const payload = {
        skill_id: finalSkillId,
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
      <form.AppField name="skill">
        {(field) => (
          <field.ComboboxField
            field={field}
            label="Skill Name *"
            disabled={!!skill}
            placeholder="Search or add skill..."
            onInputValueChange={(val) => {
              setSearchQuery(val);
              // Also update the hidden name field so we can submit it if it's new
              form.setFieldValue("skill_name", val);
            }}
            isItemEqualToValue={(item: unknown, val: unknown) => (item as { value: string })?.value === (val as { value: string })?.value}
            itemToStringLabel={(item: unknown) => (item as { label: string })?.label || ""}
          >
            <ComboboxList>
              {suggestions.map((s) => (
                <ComboboxItem key={s.id} value={{ value: s.id, label: s.name }}>
                  {s.name}
                </ComboboxItem>
              ))}
              {searchQuery && !suggestions.find(s => s.name.toLowerCase() === searchQuery.toLowerCase()) && (
                <ComboboxItem value={{ value: "new", label: searchQuery }}>
                  Add &quot;{searchQuery}&quot;
                </ComboboxItem>
              )}
              {suggestions.length === 0 && !searchQuery && (
                <ComboboxEmpty>Start typing to search...</ComboboxEmpty>
              )}
            </ComboboxList>
          </field.ComboboxField>
        )}
      </form.AppField>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="proficiency">
          {(field) => (
            <field.SelectField
              field={field}
              label="Proficiency"
            >
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </field.SelectField>
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
          <AlertDialog>
            <AlertDialogTrigger render={<Button type="button" variant="destructive" size="icon" />}>
              <HugeiconsIcon icon={Delete02Icon} className="size-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove this skill from your profile? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={async () => {
                    await deleteMutation.mutateAsync(skill.skill_id);
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
    <Card className="border-border shadow-sm bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
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
                    {typeof skill.proficiency === 'number' ? ["beginner", "intermediate", "advanced", "expert"][skill.proficiency - 1] : skill.proficiency} · {skill.years_of_experience} yrs
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
          <Empty className="bg-muted/50 p-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={StarIcon} />
              </EmptyMedia>
              <EmptyTitle>No skills added yet.</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" onClick={openNew} className="mt-2">
                Add Skills
              </Button>
            </EmptyContent>
          </Empty>
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
