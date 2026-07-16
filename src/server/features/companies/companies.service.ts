import { CompaniesRepository } from "./companies.repository";
import { NotFoundError } from "../../shared/errors";
import { z } from "zod";
import { CompaniesQuerySchema } from "./companies.schemas";

export class CompaniesService {
  static async listCompanies(params: z.infer<typeof CompaniesQuerySchema>) {
    const { page = 1, limit = 10, query } = params;
    const offset = (page - 1) * limit;

    const { data, total } = await CompaniesRepository.listCompanies(limit, offset, query);
    return {
      companies: data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getCompany(id: string) {
    const company = await CompaniesRepository.getCompany(id);
    if (!company) throw new NotFoundError("Company not found");
    return company;
  }

  static async verifyCompany(id: string, isVerified: boolean) {
    const company = await CompaniesRepository.verifyCompany(id, isVerified);
    if (!company) throw new NotFoundError("Company not found");
    return company;
  }
}
