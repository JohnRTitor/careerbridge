import { rpcClient } from "@/lib/api/rpc";
import { InferResponseType } from "hono/client";
import type { 
  CompaniesQuery as CompanyFilters, 
  Company as BaseCompany, 
  UpdateCompany as UpdateCompanyPayload,
  CompanyMember as AddCompanyMemberPayload,
  UpdateCompanyMember as UpdateCompanyMemberPayload
} from "@server/features/companies/companies.schemas";

type CompanyRoute = typeof rpcClient.api.companies[":id"]["$get"];
type Res = InferResponseType<CompanyRoute, 200>;

export type Company = NonNullable<Res extends { data: infer D } ? D : never>;

export type CreateCompanyPayload = BaseCompany;

export type { 
  CompanyFilters, 
  UpdateCompanyPayload, 
  AddCompanyMemberPayload, 
  UpdateCompanyMemberPayload 
};

