import { z } from "zod";
import { CompaniesQuerySchema, CompanySchema, UpdateCompanySchema } from "@server/features/companies/companies.schemas";

// Since base schemas map nicely to entities here, we can use z.infer
export type Company = z.infer<typeof CompanySchema> & {
  id: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type CompanyFilters = z.infer<typeof CompaniesQuerySchema>;
export type CreateCompanyPayload = z.infer<typeof CompanySchema>;
export type UpdateCompanyPayload = z.infer<typeof UpdateCompanySchema>;
