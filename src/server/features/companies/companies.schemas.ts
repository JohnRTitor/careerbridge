import { z } from "zod";
import "zod-openapi";
import { PaginationQuerySchema } from "../../shared/schemas";

export const CompanySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  logo_url: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  industry: z.string().optional(),
  size: z.string().optional(),
  location: z.string().optional(),
}).meta({ id: "Company" });

export const VerifyCompanySchema = z.object({
  is_verified: z.boolean(),
}).meta({ id: "VerifyCompany" });

export const CompaniesQuerySchema = PaginationQuerySchema.extend({
  query: z.string().optional(),
}).meta({ id: "CompaniesQuery" });
