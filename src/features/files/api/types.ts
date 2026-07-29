export type UploadFileArgs = {
  file: File | Blob;
  bucket: string;
  featureId?: string;
};

export type UploadFileResult = {
  path: string;
  bucket: string;
  id: string;
};
