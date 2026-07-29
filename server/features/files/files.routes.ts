import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { requireAuth } from "../../app/middleware/auth";
import { ok, created } from "../../shared/responses";
import { AppError } from "../../shared/errors";
import { UploadRequestSchema, CompleteUploadSchema } from "./files.schemas";
import { filesService } from "./files.service";

const app = new Hono<AppEnv>();

export const filesRoutes = app
  .use("*", requireAuth)
  .post(
    "/upload-url",
    describeRoute({
      description: "Request a signed URL to upload a file to Supabase directly",
      responses: {
        200: { description: "Signed URL generated" },
      },
    }),
    sValidator("json", UploadRequestSchema),
    async (c) => {
      const user = c.get("user");
      const input = c.req.valid("json");
      const result = await filesService.requestUploadUrl(user.id, input);
      return ok(c, result);
    }
  )
  .post(
    "/complete",
    describeRoute({
      description: "Mark an upload as complete and persist to database",
      responses: {
        201: { description: "File metadata saved" },
      },
    }),
    sValidator("json", CompleteUploadSchema),
    async (c) => {
      const user = c.get("user");
      const input = c.req.valid("json");
      const result = await filesService.completeUpload(user.id, input);
      return created(c, result);
    }
  )
  .get(
    "/download",
    describeRoute({
      description: "Download a private file using a signed URL",
      responses: {
        302: { description: "Redirect to signed URL" },
        404: { description: "File not found" }
      },
    }),
    async (c) => {
      const bucket = c.req.query("bucket");
      const path = c.req.query("path");
      
      if (!bucket || !path) {
        throw new AppError(400, "Missing bucket or path", "BAD_REQUEST");
      }
      
      const url = await filesService.getDownloadUrl(bucket, path);
      return c.redirect(url);
    }
  );
