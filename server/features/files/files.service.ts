import { generateUploadUrl, generateSignedUrl, getPublicUrl } from "../../shared/storage";
import { AppError } from "../../shared/errors";
import { BUCKET_CONFIGS, UploadRequestInput, CompleteUploadInput } from "./files.schemas";
import { filesRepository } from "./files.repository";

export const filesService = {
  async requestUploadUrl(userId: string, input: UploadRequestInput) {
    const { bucket, filename, mimeType, size, featureId } = input;

    const config = BUCKET_CONFIGS[bucket];
    if (!config) {
      throw new AppError(400, `Invalid bucket: ${bucket}`, "INVALID_BUCKET");
    }

    if (size > config.maxBytes) {
      throw new AppError(400, `File exceeds maximum size of ${config.maxBytes} bytes`, "FILE_TOO_LARGE");
    }

    if (!config.mimeTypes.includes(mimeType)) {
      throw new AppError(400, `MIME type ${mimeType} is not allowed for bucket ${bucket}`, "INVALID_MIME_TYPE");
    }

    const uuid = crypto.randomUUID();
    const ext = filename.split(".").pop()?.toLowerCase() || "bin";
    
    let pathPrefix = userId;
    if (bucket === "company-assets" && featureId) {
      pathPrefix = featureId;
    } else if (bucket === "job-assets" && featureId) {
      pathPrefix = featureId;
    } else if (bucket === "resumes" && featureId) {
      pathPrefix = featureId;
    }
    
    const path = `${pathPrefix}/${uuid}.${ext}`;

    const { signedUrl, token } = await generateUploadUrl(bucket, path);

    return {
      signedUrl,
      path,
      token,
      bucket,
    };
  },

  async completeUpload(userId: string, input: CompleteUploadInput) {
    return filesRepository.saveFileMetadata({
      ...input,
      ownerId: userId,
    });
  },

  async getDownloadUrl(bucket: string, path: string) {
    const config = BUCKET_CONFIGS[bucket];
    if (!config) {
      throw new AppError(400, `Invalid bucket: ${bucket}`, "INVALID_BUCKET");
    }
    
    if (config.public) {
      const url = getPublicUrl(bucket, path);
      if (!url) throw new AppError(500, "Could not generate URL", "SERVER_ERROR");
      return url;
    }
    
    const url = await generateSignedUrl(bucket, path);
    if (!url) {
      throw new AppError(404, "File not found or failed to generate link", "NOT_FOUND");
    }
    
    return url;
  }
};
