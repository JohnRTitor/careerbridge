import { z } from "zod";
import 'zod-openapi';
import { resolver } from 'hono-openapi';

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string().meta({ example: "Something went wrong" }),
    code: z.string().optional().meta({ example: "VALIDATION_ERROR" }),
    details: z.any().optional(),
  }),
}).meta({ id: "ApiError" });

export const PaginationMetaSchema = z.object({
  page: z.number().int().meta({ example: 1 }),
  limit: z.number().int().meta({ example: 20 }),
  total: z.number().int().meta({ example: 100 }),
  totalPages: z.number().int().meta({ example: 5 }),
}).meta({ id: "PaginationMeta" });

export function createSuccessSchema<T extends z.ZodType>(
  dataSchema: T,
  name?: string
) {
  const schema = z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: z.record(z.string(), z.unknown()).optional(),
  });
  return name ? schema.meta({ id: name }) : schema;
}

export function createPaginatedSchema<T extends z.ZodType>(
  itemSchema: T,
  name?: string
) {
  const dataSchema = z.object({
    data: z.array(itemSchema),
    meta: PaginationMetaSchema,
  });
  return createSuccessSchema(dataSchema, name);
}

export const errorResponses = {
  400: {
    description: "Validation error",
    content: { "application/json": { schema: resolver(ApiErrorSchema) } },
  },
  401: {
    description: "Unauthorized — authentication required",
    content: { "application/json": { schema: resolver(ApiErrorSchema) } },
  },
  403: {
    description: "Forbidden — insufficient permissions",
    content: { "application/json": { schema: resolver(ApiErrorSchema) } },
  },
  404: {
    description: "Resource not found",
    content: { "application/json": { schema: resolver(ApiErrorSchema) } },
  },
  500: {
    description: "Internal server error",
    content: { "application/json": { schema: resolver(ApiErrorSchema) } },
  },
} as const;
