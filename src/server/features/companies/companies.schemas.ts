import { z } from "zod";
import { PaginationQuerySchema } from "../../shared/schemas";

export const CompanySchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    logo_url: z.string().url().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
    industry: z.string().optional(),
    size: z.string().optional(),
    location: z.string().optional(),
  })
  .meta({ id: "Company" });

export const UpdateCompanySchema = CompanySchema.partial().meta({
  id: "UpdateCompany",
});

export const VerifyCompanySchema = z
  .object({
    is_verified: z.boolean(),
  })
  .meta({ id: "VerifyCompany" });

export const CompaniesQuerySchema = PaginationQuerySchema.extend({
  query: z.string().optional(),
}).meta({ id: "CompaniesQuery" });

// Input Types
export type ListCompaniesInput = z.infer<typeof CompaniesQuerySchema>;

export type GetCompanyInput = {
  companyId: string;
};

export type VerifyCompanyInput = {
  companyId: string;
  isVerified: boolean;
};

// Assuming there might be a create/update later
export type CreateCompanyInput = {
  data: z.infer<typeof CompanySchema>;
};

export type UpdateCompanyInput = {
  companyId: string;
  data: z.infer<typeof UpdateCompanySchema>;
};
