"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Delete01Icon, Settings02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useJobApplicationForm } from "@/features/jobs/api/queries";
import { useUpdateJobApplicationForm } from "@/features/jobs/api/mutations";
import type { JobApplicationForm, JobApplicationQuestion } from "@server/features/jobs/jobs.schemas";
import { Skeleton } from "@/components/ui/skeleton";
import FadeContent from "@/components/react-bits/FadeContent";

export function ApplicationSettings({ jobId }: { jobId: string }) {
  const { data: formData, isLoading } = useJobApplicationForm(jobId);
  const updateMutation = useUpdateJobApplicationForm();
  
  const [formState, setFormState] = useState<JobApplicationForm | null>(null);

  // Initialize local state when data is loaded
  if (formData && !formState) {
    setFormState({
      ...formData,
      questions: formData.questions || []
    });
  }

  if (isLoading || !formState) {
    return (
      <Card className="border-border">
        <CardContent className="p-6">
          <Skeleton className="h-64 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id: jobId, data: formState });
      toast.add({ type: "success", description: "Application settings saved successfully!" });
    } catch (err) {
      toast.add({ type: "error", description: "Failed to save application settings." });
    }
  };

  const addQuestion = () => {
    setFormState(prev => {
      if (!prev) return prev;
      const qs = prev.questions || [];
      return {
        ...prev,
        questions: [
          ...qs,
          {
            id: crypto.randomUUID(),
            type: "short_text",
            is_required: false,
            label: "",
            order: qs.length,
          }
        ]
      };
    });
  };

  const updateQuestion = (index: number, updates: Partial<JobApplicationQuestion>) => {
    setFormState(prev => {
      if (!prev) return prev;
      const newQuestions = [...(prev.questions || [])];
      newQuestions[index] = { ...newQuestions[index], ...updates };
      return { ...prev, questions: newQuestions };
    });
  };

  const removeQuestion = (index: number) => {
    setFormState(prev => {
      if (!prev) return prev;
      const newQuestions = [...(prev.questions || [])];
      newQuestions.splice(index, 1);
      return { ...prev, questions: newQuestions };
    });
  };

  const showQuestions = formState.method !== "resume_only";

  return (
    <FadeContent blur={true} duration={800} ease="ease-out" initialOpacity={0}>
      <div className="space-y-8">
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-muted/50">
            <CardTitle className="text-xl flex items-center gap-2">
              <HugeiconsIcon icon={Settings02Icon} className="size-5 text-primary" />
              General Settings
            </CardTitle>
            <CardDescription>Configure how candidates apply for this job.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <Label>Application Method</Label>
              <Select 
                value={formState.method} 
                onValueChange={(val: any) => setFormState(prev => prev ? { ...prev, method: val } : prev)}
              >
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resume_only">Resume Only</SelectItem>
                  <SelectItem value="form_only">Form Only</SelectItem>
                  <SelectItem value="resume_or_form">Resume or Form</SelectItem>
                  <SelectItem value="resume_and_form">Resume and Form</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose the primary method candidates will use to apply.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div className="flex items-start space-x-3">
                <Switch 
                  checked={formState.resume_required}
                  onCheckedChange={(checked) => setFormState(prev => prev ? { ...prev, resume_required: checked } : prev)}
                />
                <div className="space-y-1">
                  <Label>Require Resume</Label>
                  <p className="text-sm text-muted-foreground">Candidates must upload a resume document.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Switch 
                  checked={formState.cover_letter_required}
                  onCheckedChange={(checked) => setFormState(prev => prev ? { ...prev, cover_letter_required: checked } : prev)}
                />
                <div className="space-y-1">
                  <Label>Require Cover Letter</Label>
                  <p className="text-sm text-muted-foreground">Candidates must provide a cover letter.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {showQuestions && (
          <Card className="bg-card border border-border shadow-sm">
            <CardHeader className="border-b border-border bg-muted/50 flex flex-row items-center justify-between pb-6 pt-8">
              <div className="space-y-1">
                <CardTitle className="text-xl">Custom Questions</CardTitle>
                <CardDescription>Ask candidates specific questions during the application.</CardDescription>
              </div>
              <Button onClick={addQuestion} variant="outline" size="sm" className="gap-2">
                <HugeiconsIcon icon={PlusSignIcon} className="size-4" /> Add Question
              </Button>
            </CardHeader>
            
            <CardContent className="p-6">
              {!formState.questions || formState.questions.length === 0 ? (
                <div className="text-center py-10 px-4 border-2 border-dashed border-border rounded-xl">
                  <HugeiconsIcon icon={InformationCircleIcon} className="size-8 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-base font-semibold text-foreground">No questions added</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">You haven't added any custom questions for this job.</p>
                  <Button onClick={addQuestion} variant="default" size="sm">
                    Add your first question
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {formState.questions.map((question, index) => (
                    <div key={question.id || index} className="p-5 border border-border rounded-xl bg-muted/10 relative group">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-2 top-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeQuestion(index)}
                      >
                        <HugeiconsIcon icon={Delete01Icon} className="size-4" />
                      </Button>
                      
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2 space-y-2">
                          <Label>Question Title / Label *</Label>
                          <Input 
                            value={question.label} 
                            onChange={(e) => updateQuestion(index, { label: e.target.value })}
                            placeholder="e.g. Why do you want to work here?"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Answer Type</Label>
                          <Select 
                            value={question.type} 
                            onValueChange={(val: any) => updateQuestion(index, { type: val })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short_text">Short Text</SelectItem>
                              <SelectItem value="long_text">Long Text</SelectItem>
                              <SelectItem value="yes_no">Yes / No</SelectItem>
                              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="url">URL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {(question.type === "multiple_choice" || question.type === "checkbox") && (
                          <div className="sm:col-span-3 space-y-2">
                            <Label>Options (comma separated)</Label>
                            <Textarea 
                              value={question.options?.join(", ") || ""} 
                              onChange={(e) => updateQuestion(index, { options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                              placeholder="e.g. Option A, Option B, Option C"
                              className="h-20"
                            />
                          </div>
                        )}

                        <div className="sm:col-span-3 flex items-center space-x-2 pt-2">
                          <Switch 
                            checked={question.is_required}
                            onCheckedChange={(checked) => updateQuestion(index, { is_required: checked })}
                            id={`req-${index}`}
                          />
                          <Label htmlFor={`req-${index}`} className="text-sm font-normal">This question is mandatory</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-3 border-t border-border pt-6">
          <Button 
            variant="default" 
            size="lg" 
            onClick={handleSave} 
            disabled={updateMutation.isPending}
            className="px-8"
          >
            {updateMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </FadeContent>
  );
}
