"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  PlusSignIcon, 
  PencilEdit01Icon, 
  Delete02Icon, 
  Certificate01Icon,
  Link01Icon
} from "@hugeicons/core-free-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/use-app-form";
import type { Certification, AddCertificationPayload, UpdateCertificationPayload } from "@/features/profiles/api/types";
import { useAddCertification, useUpdateCertification, useDeleteCertification } from "@/features/profiles/api/mutations";
import { format, parseISO } from "date-fns";

type CertificationFormProps = {
  certification?: Certification;
  onClose: () => void;
};

function CertificationForm({ certification, onClose }: CertificationFormProps) {
  const addMutation = useAddCertification();
  const updateMutation = useUpdateCertification();
  const deleteMutation = useDeleteCertification();

  const form = useAppForm({
    defaultValues: {
      name: certification?.name || "",
      issuer: certification?.issuer || "",
      issue_date: certification?.issue_date ? new Date(certification.issue_date).toISOString().split('T')[0] : "",
      expiry_date: certification?.expiry_date ? new Date(certification.expiry_date).toISOString().split('T')[0] : "",
      credential_id: certification?.credential_id || "",
      credential_url: certification?.credential_url || "",
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        expiry_date: value.expiry_date || undefined,
        credential_id: value.credential_id || undefined,
        credential_url: value.credential_url || undefined,
      };

      if (certification) {
        await updateMutation.mutateAsync({ id: certification.id, data: payload as UpdateCertificationPayload });
      } else {
        await addMutation.mutateAsync(payload as AddCertificationPayload);
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
      <form.AppField name="name">
        {(field) => (
          <field.TextField
            field={field}
            label="Certification Name *"
            required
            placeholder="e.g. AWS Certified Solutions Architect"
          />
        )}
      </form.AppField>

      <form.AppField name="issuer">
        {(field) => (
          <field.TextField
            field={field}
            label="Issuing Organization *"
            required
            placeholder="e.g. Amazon Web Services"
          />
        )}
      </form.AppField>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="issue_date">
          {(field) => (
            <field.DateField
              field={field}
              label="Issue Date *"
              required
            />
          )}
        </form.AppField>
        <form.AppField name="expiry_date">
          {(field) => (
            <field.DateField
              field={field}
              label="Expiration Date"
            />
          )}
        </form.AppField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="credential_id">
          {(field) => (
            <field.TextField
              field={field}
              label="Credential ID"
            />
          )}
        </form.AppField>
        <form.AppField name="credential_url">
          {(field) => (
            <field.TextField
              field={field}
              label="Credential URL"
              type="url"
              placeholder="https://"
            />
          )}
        </form.AppField>
      </div>

      <div className="flex justify-between pt-4 border-t border-border mt-4">
        {certification ? (
          <Button 
            type="button" 
            variant="destructive" 
            size="icon"
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this certification?")) {
                await deleteMutation.mutateAsync(certification.id);
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

export function CertificationsSection({ certifications }: { certifications: Certification[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Certification | undefined>();

  const openNew = () => {
    setSelectedItem(undefined);
    setIsOpen(true);
  };

  const openEdit = (item: Certification) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
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
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <HugeiconsIcon icon={Certificate01Icon} className="size-5" />
          </div>
          Certifications
        </CardTitle>
        <Button variant="outline" size="sm" onClick={openNew} className="h-8 gap-1">
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {certifications.length > 0 ? (
          certifications.map((cert) => (
            <div key={cert.id} className="group relative border rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-foreground text-base leading-snug">{cert.name}</h3>
                  <p className="font-medium text-muted-foreground text-sm mt-0.5">{cert.issuer}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0" 
                  onClick={() => openEdit(cert)}
                >
                  <HugeiconsIcon icon={PencilEdit01Icon} className="size-4" />
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground mt-2">
                Issued {formatDate(cert.issue_date)}
                {cert.expiry_date && ` · Expires ${formatDate(cert.expiry_date)}`}
              </div>
              
              {(cert.credential_id || cert.credential_url) && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {cert.credential_id && (
                    <span className="text-xs bg-white border border-border px-2 py-1 rounded-md text-muted-foreground">
                      ID: {cert.credential_id}
                    </span>
                  )}
                  {cert.credential_url && (
                    <a 
                      href={cert.credential_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-primary/5 text-primary border border-primary/10 px-2 py-1 rounded-md flex items-center gap-1 hover:bg-primary/10 transition-colors"
                    >
                      <HugeiconsIcon icon={Link01Icon} className="size-3" />
                      Show Credential
                    </a>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 border border-dashed border-border rounded-xl bg-slate-50/50">
            <p className="text-muted-foreground text-sm mb-4">No certifications added yet.</p>
            <Button variant="outline" size="sm" onClick={openNew}>
              Add Certification
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit Certification" : "Add Certification"}</DialogTitle>
          </DialogHeader>
          <CertificationForm certification={selectedItem} onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
