import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { companiesService } from "./companies.service";
import { CompaniesQuerySchema } from "./companies.schemas";
import { ok, created, noContent } from "../../shared/responses";
import { UuidParamSchema } from "../../shared/schemas";
import { requireAuth } from "../../app/middleware/auth";
import { requirePermission } from "../../app/middleware/authorize";
import { CompanySchema, UpdateCompanySchema, VerifyCompanySchema, CompanyMemberSchema, UpdateCompanyMemberSchema } from "./companies.schemas";
export const companiesRoutes = new Hono<AppEnv>();

companiesRoutes.get(
  "/",
  describeRoute({
    summary: "List companies",
    tags: ["Companies"],
  }),
  sValidator("query", CompaniesQuerySchema),
  async (c) => {
    const input = c.req.valid("query");
    const result = await companiesService.listCompanies(input);
    return ok(c, result);
  }
);

companiesRoutes.get(
  "/:id",
  describeRoute({
    summary: "Get company details",
    tags: ["Companies"],
  }),
  sValidator("param", UuidParamSchema),
  async (c) => {
    const { id: companyId } = c.req.valid("param");
    const company = await companiesService.getCompany({ companyId });
    return ok(c, company);
  }
);

companiesRoutes.post(
  "/",
  describeRoute({ summary: "Create company", tags: ["Companies"] }),
  requireAuth,
  requirePermission("company", "create"),
  sValidator("json", CompanySchema),
  async (c) => {
    const data = c.req.valid("json");
    const company = await companiesService.createCompany({ data });
    return created(c, company, "Company created successfully");
  }
);

companiesRoutes.patch(
  "/:id",
  describeRoute({ summary: "Update company details", tags: ["Companies"] }),
  requireAuth,
  requirePermission("company", "update"),
  sValidator("param", UuidParamSchema),
  sValidator("json", UpdateCompanySchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const company = await companiesService.updateCompany({ companyId: id, data });
    return ok(c, company, "Company updated successfully");
  }
);

companiesRoutes.delete(
  "/:id",
  describeRoute({ summary: "Delete company", tags: ["Companies"] }),
  requireAuth,
  requirePermission("company", "delete"),
  sValidator("param", UuidParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    await companiesService.deleteCompany({ companyId: id });
    return noContent(c);
  }
);

// Followers
companiesRoutes.get(
  "/followed/me",
  describeRoute({ summary: "Get followed companies", tags: ["Companies"] }),
  requireAuth,
  async (c) => {
    const user = c.get("user");
    const companies = await companiesService.getFollowedCompanies({ userId: user.id });
    return ok(c, companies);
  }
);

companiesRoutes.post(
  "/:id/follow",
  describeRoute({ summary: "Follow company", tags: ["Companies"] }),
  requireAuth,
  sValidator("param", UuidParamSchema),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    await companiesService.followCompany({ companyId: id, userId: user.id });
    return ok(c, null, "Followed successfully");
  }
);

companiesRoutes.delete(
  "/:id/follow",
  describeRoute({ summary: "Unfollow company", tags: ["Companies"] }),
  requireAuth,
  sValidator("param", UuidParamSchema),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    await companiesService.unfollowCompany({ companyId: id, userId: user.id });
    return noContent(c);
  }
);

// Members
companiesRoutes.get(
  "/:id/members",
  describeRoute({ summary: "Get company members", tags: ["Companies"] }),
  requireAuth,
  sValidator("param", UuidParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const members = await companiesService.getCompanyMembers({ companyId: id });
    return ok(c, members);
  }
);

companiesRoutes.post(
  "/:id/members",
  describeRoute({ summary: "Add company member", tags: ["Companies"] }),
  requireAuth,
  requirePermission("company", "update"),
  sValidator("param", UuidParamSchema),
  sValidator("json", CompanyMemberSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const member = await companiesService.addCompanyMember({ companyId: id, data });
    return created(c, member, "Member added successfully");
  }
);

companiesRoutes.patch(
  "/:id/members/:userId",
  describeRoute({ summary: "Update company member", tags: ["Companies"] }),
  requireAuth,
  requirePermission("company", "update"),
  sValidator("json", UpdateCompanyMemberSchema),
  async (c) => {
    const { id, userId } = c.req.param();
    const data = c.req.valid("json");
    const member = await companiesService.updateCompanyMember({ companyId: id, userId, data });
    return ok(c, member, "Member updated successfully");
  }
);

companiesRoutes.delete(
  "/:id/members/:userId",
  describeRoute({ summary: "Remove company member", tags: ["Companies"] }),
  requireAuth,
  requirePermission("company", "update"),
  async (c) => {
    const { id, userId } = c.req.param();
    await companiesService.removeCompanyMember({ companyId: id, userId });
    return noContent(c);
  }
);
