import { rpcClient, handleRpcError } from "@/lib/api/rpc";
import type { UploadFileArgs, UploadFileResult } from "./types";

export const uploadFileApi = async ({ file, bucket, featureId }: UploadFileArgs): Promise<UploadFileResult> => {
  // 1. Request signed upload URL
  const urlResponse = await rpcClient.api.files["upload-url"].$post({
    json: {
      bucket,
      filename: file instanceof File ? file.name : "upload.bin",
      mimeType: file.type,
      size: file.size,
      featureId,
    },
  });

  if (!urlResponse.ok) {
    await handleRpcError(urlResponse);
  }

  const responseBody = await urlResponse.json();
  if (!responseBody.success) throw new Error("Failed to get upload URL");
  const { signedUrl, path } = responseBody.data;

  // 2. Upload file directly to Supabase
  const uploadResponse = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    const err = await uploadResponse.text();
    throw new Error(`Failed to upload to storage: ${err}`);
  }

  // 3. Mark upload as complete
  const completeResponse = await rpcClient.api.files.complete.$post({
    json: {
      bucket,
      path,
      originalFilename: file instanceof File ? file.name : "upload.bin",
      mimeType: file.type,
      size: file.size,
    },
  });

  if (!completeResponse.ok) {
    await handleRpcError(completeResponse);
  }

  const completeBody = await completeResponse.json();
  if (!completeBody.success) throw new Error("Failed to complete upload");

  return completeBody.data as UploadFileResult;
};
