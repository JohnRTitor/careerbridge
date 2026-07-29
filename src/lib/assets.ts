/**
 * Resolves the effective URL for an asset.
 * 
 * Priority:
 * 1. User-provided external URL
 * 2. Uploaded file (resolved from the files table and storage)
 * 3. Default application asset (fallback)
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

export function getPublicAssetUrl(
  externalUrl?: string | null,
  file?: { bucket: string; path: string } | null,
  fallbackUrl?: string
): string | undefined {
  if (externalUrl) {
    return externalUrl;
  }

  if (file && file.bucket && file.path) {
    // Construct public URL for Supabase storage
    return `${SUPABASE_URL}/storage/v1/object/public/${file.bucket}/${file.path}`;
  }

  return fallbackUrl;
}

export function getPrivateAssetUrl(
  externalUrl?: string | null,
  file?: { bucket: string; path: string } | null,
  fallbackUrl?: string
): string | undefined {
  if (externalUrl) {
    return externalUrl;
  }

  if (file && file.bucket && file.path) {
    // For private assets, the frontend typically shouldn't guess the URL since it requires a signature.
    // Instead, it should call an API endpoint to get a signed URL, or the backend should have provided the signed URL.
    // However, if we need to return a path format to be handled by a proxy or fetcher:
    return `/api/files/download?bucket=${file.bucket}&path=${encodeURIComponent(file.path)}`;
  }

  return fallbackUrl;
}
