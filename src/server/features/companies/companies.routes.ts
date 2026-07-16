import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { CompaniesService } from "./companies.service";
import { CompaniesQuerySchema } from "./companies.schemas";
import { ok } from "../../shared/responses";
import { UuidParamSchema } from "../../shared/schemas";

export const companiesRoutes = new Hono<AppEnv>();

companiesRoutes.get(
  "/",
  describeRoute({
    summary: "List companies",
    tags: ["Companies"],
  }),
  sValidator("query", CompaniesQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const result = await CompaniesService.listCompanies(query);
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
    const { id } = c.req.valid("param");
    const company = await CompaniesService.getCompany(id);
    return ok(c, company);
  }
);
