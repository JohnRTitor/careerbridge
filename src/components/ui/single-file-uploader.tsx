"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  Attachment01Icon,
  Upload01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

import {
  formatBytes,
  useFileUpload,
} from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export type SingleFileUploaderProps = {
  onUpload?: (file: File) => Promise<void>;
  onChange?: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
};

export function SingleFileUploader({
  onUpload,
  onChange,
  accept,
  maxSize = 10 * 1024 * 1024,
  disabled,
  className,
}: SingleFileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept,
    maxSize,
    onFilesChange: (newFiles) => {
      const file = newFiles[0]?.file;
      if (onChange) {
         if (file instanceof File) {
            onChange(file);
         } else {
            onChange(null);
         }
      }
    }
  });

  const file = files[0];

  const handleUploadClick = async () => {
    if (!file || !(file.file instanceof File) || !onUpload) return;
    try {
      setIsUploading(true);
      await onUpload(file.file);
      // Remove file after successful upload
      removeFile(file.id);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Drop area */}
      <div
        className={cn("relative flex min-h-40 flex-col items-center justify-center rounded-xl border border-input border-dashed p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-[input:focus]:border-ring has-disabled:opacity-50 has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50", (disabled || isUploading) && "opacity-50 pointer-events-none")}
        data-dragging={isDragging || undefined}
        onClick={(!disabled && !isUploading) ? openFileDialog : undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={-1}
      >
        <input
          {...getInputProps()}
          aria-label="Upload file"
          className="sr-only"
          disabled={Boolean(file) || disabled || isUploading}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            aria-hidden="true"
            className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
          >
            <HugeiconsIcon icon={Upload01Icon} className="size-5 opacity-60" />
          </div>
          <p className="mb-1.5 font-medium text-sm">Upload file</p>
          <p className="text-muted-foreground text-xs">
            Drag & drop or click to browse (max. {formatBytes(maxSize)})
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-destructive text-xs"
          role="alert"
        >
          <HugeiconsIcon icon={AlertCircleIcon} className="size-4 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {file && (
        <div className="space-y-2 mt-2">
          <div
            className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2 bg-background shadow-sm"
            key={file.id}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <HugeiconsIcon
                icon={Attachment01Icon}
                aria-hidden="true"
                className="size-4 shrink-0 opacity-60"
              />
              <div className="min-w-0">
                <p className="truncate font-medium text-[13px]">
                  {file.file.name}
                </p>
              </div>
            </div>

            <Button
              type="button"
              aria-label="Remove file"
              className="-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
              onClick={() => removeFile(files[0]?.id)}
              size="icon"
              variant="ghost"
              disabled={isUploading}
            >
              <HugeiconsIcon icon={Cancel01Icon} aria-hidden="true" className="size-4" />
            </Button>
          </div>
          
          {onUpload && (
            <Button 
               type="button" 
               className="w-full mt-2" 
               onClick={handleUploadClick}
               disabled={isUploading}
            >
              {isUploading && <Spinner className="mr-2" />}
              {isUploading ? "Uploading..." : "Upload File"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
