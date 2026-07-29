import { createClient } from "@supabase/supabase-js";
import { AppError } from "./errors";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials missing. File uploads will not work.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-key",
);

export async function generateUploadUrl(bucket: string, path: string) {
  if (!supabaseUrl || !supabaseKey) {
    throw new AppError(500, "Storage is not configured", "STORAGE_ERROR");
  }
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path);

  if (error || !data) {
    console.error("Failed to create signed upload URL:", error);
    throw new AppError(500, "Failed to generate upload URL", "STORAGE_ERROR");
  }

  return data;
}

export async function generateSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
  if (!supabaseUrl || !supabaseKey) return null;
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data) {
    console.error("Failed to create signed URL:", error);
    return null;
  }

  return data.signedUrl;
}

export function getPublicUrl(bucket: string, path: string) {
  if (!supabaseUrl || !supabaseKey) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteStorageFile(bucket: string, path: string) {
  if (!supabaseUrl || !supabaseKey) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error(`Failed to delete file ${path} from ${bucket}:`, error);
  }
}
