"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit01Icon, UserCircleIcon } from "@hugeicons/core-free-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/use-app-form";
import type { Profile } from "@/features/profiles/api/types";
import { useUpdateProfile } from "@/features/profiles/api/mutations";

export function AboutSection({ profile }: { profile: Profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const updateProfile = useUpdateProfile();

  const form = useAppForm({
    defaultValues: {
      about: profile.about || "",
    },
    onSubmit: async ({ value }) => {
      await updateProfile.mutateAsync(value);
      setIsOpen(false);
    },
  });

  return (
    <Card className="border-border shadow-sm bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <HugeiconsIcon icon={UserCircleIcon} className="size-5 text-primary" />
          About
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(true)}>
          <HugeiconsIcon icon={PencilEdit01Icon} className="size-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {profile.about ? (
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm">
            {profile.about}
          </p>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm mb-4">You haven&apos;t written an about summary yet.</p>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
              Add About Summary
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit About</DialogTitle>
          </DialogHeader>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4 pt-4"
          >
            <form.AppField name="about">
              {(field) => (
                <field.TextareaField
                  field={field}
                  label="Summary"
                  placeholder="Write a brief summary about your professional background, skills, and goals..."
                  className="min-h-[150px]"
                />
              )}
            </form.AppField>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <form.AppForm>
                <form.SubmitButton>
                  Save Changes
                </form.SubmitButton>
              </form.AppForm>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
