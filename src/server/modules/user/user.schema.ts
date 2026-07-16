import { z } from "zod";
import 'zod-openapi';

export const UserProfileSchema = z.object({
  id: z.string().meta({ example: "user_123" }),
  name: z.string().meta({ example: "John Doe" }),
  email: z.string().email().meta({ example: "john@example.com" }),
  image: z.string().nullable().optional().meta({ example: "https://example.com/avatar.jpg" }),
  role: z.enum(["user", "candidate", "recruiter", "admin"]).meta({ example: "candidate" }),
  createdAt: z.union([z.string(), z.date()]).transform(val => new Date(val).toISOString()),
  updatedAt: z.union([z.string(), z.date()]).transform(val => new Date(val).toISOString()),
}).meta({ id: "UserProfile" });

export const UpdateUserProfileSchema = z.object({
  name: z.string().min(2).optional().meta({ example: "Jane Doe" }),
  image: z.string().url().optional().meta({ example: "https://example.com/new-avatar.jpg" }),
}).meta({ id: "UpdateUserProfile" });
