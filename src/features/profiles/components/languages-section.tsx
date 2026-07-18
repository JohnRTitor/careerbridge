"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  PlusSignIcon, 
  PencilEdit01Icon, 
  Delete02Icon, 
  EarthIcon
} from "@hugeicons/core-free-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SelectItem } from "@/components/ui/select";
import { useAppForm } from "@/hooks/use-app-form";
import type { Language, AddUserLanguagePayload, UpdateUserLanguagePayload } from "@/features/profiles/api/types";
import { useAddUserLanguage, useUpdateUserLanguage, useDeleteUserLanguage } from "@/features/profiles/api/mutations";

type LanguageFormProps = {
  language?: Language;
  onClose: () => void;
};

function LanguageForm({ language, onClose }: LanguageFormProps) {
  const addMutation = useAddUserLanguage();
  const updateMutation = useUpdateUserLanguage();
  const deleteMutation = useDeleteUserLanguage();

  const form = useAppForm({
    defaultValues: {
      language_name: language?.language_name || "",
      proficiency: language?.proficiency || "conversational",
    },
    onSubmit: async ({ value }) => {
      const payload = {
        language_id: "00000000-0000-0000-0000-000000000000", // TODO: Implement meta autocomplete
        proficiency: value.proficiency,
      };

      if (language) {
        await updateMutation.mutateAsync({ id: language.language_id, data: payload as UpdateUserLanguagePayload });
      } else {
        await addMutation.mutateAsync(payload as AddUserLanguagePayload);
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
      <form.AppField name="language_name">
        {(field) => (
          <field.TextField
            field={field}
            label="Language *"
            disabled={!!language}
            required
            placeholder="e.g. English, Spanish, French"
          />
        )}
      </form.AppField>

      <form.AppField name="proficiency">
        {(field) => (
          <field.SelectField
            field={field}
            label="Proficiency"
          >
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="conversational">Conversational</SelectItem>
            <SelectItem value="fluent">Fluent</SelectItem>
            <SelectItem value="native">Native / Bilingual</SelectItem>
          </field.SelectField>
        )}
      </form.AppField>

      <div className="flex justify-between pt-4 border-t border-border mt-4">
        {language ? (
          <Button 
            type="button" 
            variant="destructive" 
            size="icon"
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this language?")) {
                await deleteMutation.mutateAsync(language.language_id);
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

export function LanguagesSection({ languages }: { languages: Language[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Language | undefined>();

  const openNew = () => {
    setSelectedItem(undefined);
    setIsOpen(true);
  };

  const openEdit = (item: Language) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  return (
    <Card className="border-border shadow-sm bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
            <HugeiconsIcon icon={EarthIcon} className="size-5" />
          </div>
          Languages
        </CardTitle>
        <Button variant="outline" size="sm" onClick={openNew} className="h-8 gap-1">
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        {languages.length > 0 ? (
          <div className="flex flex-col gap-3">
            {languages.map((lang) => (
              <div key={lang.language_id} className="group flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{lang.language_name || "Unknown"}</h4>
                  <p className="text-xs text-muted-foreground capitalize mt-0.5">
                    {lang.proficiency}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0" 
                  onClick={() => openEdit(lang)}
                >
                  <HugeiconsIcon icon={PencilEdit01Icon} className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-border rounded-xl bg-muted/50">
            <p className="text-muted-foreground text-sm mb-4">No languages added yet.</p>
            <Button variant="outline" size="sm" onClick={openNew}>
              Add Languages
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit Language" : "Add Language"}</DialogTitle>
          </DialogHeader>
          <LanguageForm language={selectedItem} onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
