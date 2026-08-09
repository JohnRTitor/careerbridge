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
import { SelectItem } from "@/components/ui/select";
import { ComboboxList, ComboboxItem, ComboboxEmpty } from "@/components/ui/combobox";
import { useAppForm } from "@/hooks/use-app-form";
import type { Language, AddUserLanguagePayload, UpdateUserLanguagePayload } from "@/features/profiles/api/types";
import { useAddUserLanguage, useUpdateUserLanguage, useDeleteUserLanguage } from "@/features/profiles/api/mutations";
import FadeContent from "@/components/react-bits/FadeContent";
import { useLanguages } from "@/features/meta/api/queries";
import { useDebounce } from "@reactuses/core";

type LanguageFormProps = {
  language?: Language;
  onClose: () => void;
};

function LanguageForm({ language, onClose }: LanguageFormProps) {
  const addMutation = useAddUserLanguage();
  const updateMutation = useUpdateUserLanguage();
  const deleteMutation = useDeleteUserLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { data: suggestions = [] } = useLanguages(debouncedQuery);

  const form = useAppForm({
    defaultValues: {
      language: language ? { value: language.language_id, label: language.language_name } : null as { value: string, label: string } | null,
      proficiency: language?.proficiency || "professional",
    },
    onSubmit: async ({ value }) => {
      const payload = {
        language_id: value.language!.value,
        proficiency: value.proficiency as string,
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
      <form.AppField name="language"
        validators={{
          onChange: ({ value }) => !value ? "Language is required" : undefined,
        }}
      >
        {(field) => (
          <field.ComboboxField
            field={field}
            label="Language *"
            disabled={!!language}
            placeholder="Search language..."
            onInputValueChange={(val) => setSearchQuery(val)}
            isItemEqualToValue={(item: unknown, val: unknown) => (item as { value: string })?.value === (val as { value: string })?.value}
            itemToStringLabel={(item: unknown) => (item as { label: string })?.label || ""}
          >
            <ComboboxList>
              {suggestions.map((l) => (
                <ComboboxItem key={l.id} value={{ value: l.id, label: l.name }}>
                  {l.name}
                </ComboboxItem>
              ))}
              {suggestions.length === 0 && (
                <ComboboxEmpty>No language found...</ComboboxEmpty>
              )}
            </ComboboxList>
          </field.ComboboxField>
        )}
      </form.AppField>

      <form.AppField name="proficiency">
        {(field) => (
          <field.SelectField
            field={field}
            label="Proficiency"
          >
            <SelectItem value="native">Native or Bilingual</SelectItem>
            <SelectItem value="fluent">Fluent</SelectItem>
            <SelectItem value="professional">Full Professional</SelectItem>
            <SelectItem value="conversational">Conversational</SelectItem>
            <SelectItem value="basic">Elementary</SelectItem>
          </field.SelectField>
        )}
      </form.AppField>

      <div className="flex justify-between pt-4 border-t border-border mt-4">
        {language ? (
          <AlertDialog>
            <AlertDialogTrigger render={<Button type="button" variant="destructive" size="icon" />}>
              <HugeiconsIcon icon={Delete02Icon} className="size-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Language</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove this language from your profile? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={async () => {
                    await deleteMutation.mutateAsync(language.language_id);
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
    <FadeContent blur={true} duration={1000} ease="ease-out" initialOpacity={0}>
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
          <Empty className="bg-muted/50 p-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={EarthIcon} />
              </EmptyMedia>
              <EmptyTitle>No languages added yet.</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" onClick={openNew} className="mt-2">
                Add Languages
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogPopup className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit Language" : "Add Language"}</DialogTitle>
          </DialogHeader>
          <LanguageForm language={selectedItem} onClose={() => setIsOpen(false)} />
        </DialogPopup>
      </Dialog>
    </Card>
    </FadeContent>
  );
}
