"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PencilEdit01Icon,
  Location01Icon,
  Link01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import type { Profile } from "@/features/profiles/api/types";
import { useAppForm } from "@/hooks/use-app-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SelectItem } from "@/components/ui/select";
import { useUpdateProfile } from "@/features/profiles/api/mutations";
import { AvatarCropper } from "@/components/ui/avatar-cropper";
import { useSupabaseUpload } from "@/features/files/api/mutations";
import { getPublicAssetUrl } from "@/lib/assets";

export function ProfileHeader({ profile }: { profile: Profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const updateProfile = useUpdateProfile();
  const uploadMutation = useSupabaseUpload();

  const form = useAppForm({
    defaultValues: {
      headline: profile.headline || "",
      portfolio_url: profile.portfolio_url || "",
      visibility: (profile.visibility as "public" | "private") || "public",
      date_of_birth: profile.date_of_birth || "",
    },
    onSubmit: async ({ value }) => {
      await updateProfile.mutateAsync(value);
      setIsOpen(false);
    },
  });

  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm">
      <div className="h-32 bg-linear-to-r from-primary/10 via-primary/5 to-transparent relative">
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm shadow-sm"
          onClick={() => setIsOpen(true)}
        >
          <HugeiconsIcon icon={PencilEdit01Icon} className="size-4 mr-2" />
          Edit Profile
        </Button>
      </div>
      <CardContent className="px-6 sm:px-8 pb-8 relative pt-0">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <AvatarCropper
            value={profile.image}
            className="size-24 sm:size-32 border-4 border-white shadow-md bg-background -mt-12 sm:-mt-16 ring-1 ring-border"
            onUpload={async (blob) => {
              const fileRecord = await uploadMutation.mutateAsync({ file: blob, bucket: "avatars" });
              await updateProfile.mutateAsync({ avatar_file_id: fileRecord.id });
            }}
          />
          <div className="flex-1 mt-2">
            <h1 className="text-2xl font-bold text-foreground">
              {profile.name}
            </h1>
            <p className="text-lg text-muted-foreground mt-1 font-medium">
              {profile.headline || "Add a headline"}
            </p>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Location01Icon} className="size-4" />
                Remote / Anywhere
              </span>
              {profile.portfolio_url && (
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <HugeiconsIcon icon={Link01Icon} className="size-4" />
                  Portfolio
                </a>
              )}
              {profile.date_of_birth && (
                <span
                  className="flex items-center gap-1.5"
                  title="Date of Birth"
                >
                  <HugeiconsIcon icon={Calendar01Icon} className="size-4" />
                  {format(new Date(profile.date_of_birth), "PPP")}
                </span>
              )}
              <Badge
                variant={
                  profile.visibility === "public" ? "default" : "secondary"
                }
                className="ml-auto"
              >
                {profile.visibility === "public" ? "Open to Work" : "Private"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile Information</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4 pt-4"
          >
            <form.AppField name="headline">
              {(field) => (
                <field.TextField
                  field={field}
                  label="Headline"
                  placeholder="e.g. Senior Frontend Engineer at TechCorp"
                />
              )}
            </form.AppField>

            <form.AppField name="portfolio_url">
              {(field) => (
                <field.TextField
                  field={field}
                  label="Portfolio URL"
                  placeholder="https://yourportfolio.com"
                  type="url"
                />
              )}
            </form.AppField>

            <form.AppField name="visibility">
              {(field) => (
                <field.SelectField
                  field={field}
                  label="Profile Visibility"
                  description="Private profiles are hidden from search, but recruiters can still view your full profile if you apply to their jobs."
                >
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </field.SelectField>
              )}
            </form.AppField>

            <form.AppField name="date_of_birth">
              {(field) => (
                <field.DateField
                  field={field}
                  label="Date of Birth"
                  description="We don't display this publicly."
                />
              )}
            </form.AppField>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || uploadMutation.isPending}>
                    {isSubmitting || uploadMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
