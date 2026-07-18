import type { 
  CompaniesQuery as CompanyFilters, 
  Company as BaseCompany, 
  UpdateCompany as UpdateCompanyPayload,
  CompanyMember as AddCompanyMemberPayload,
  UpdateCompanyMember as UpdateCompanyMemberPayload
} from "@server/features/companies/companies.schemas";

export type Company = BaseCompany & {
  id: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  open_jobs_count?: number;
};

export type CreateCompanyPayload = BaseCompany;

export type { 
  CompanyFilters, 
  UpdateCompanyPayload, 
  AddCompanyMemberPayload, 
  UpdateCompanyMemberPayload 
};
