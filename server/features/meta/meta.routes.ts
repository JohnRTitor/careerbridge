import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { metaService } from "./meta.service";
import { SearchMetaSchema, CreateSkillSchema, CreateLanguageSchema } from "./meta.schemas";
import { ok, created } from "../../shared/responses";
import { requireAuth } from "../../app/middleware/auth";

export const metaRoutes = new Hono<AppEnv>();

// -- Skills --
metaRoutes.get(
  "/skills",
  describeRoute({
    summary: "Search skills",
    tags: ["Meta"],
  }),
  sValidator("query", SearchMetaSchema),
  async (c) => {
    const query = c.req.valid("query");
    const skills = await metaService.searchSkills(query);
    return ok(c, skills);
  }
);

metaRoutes.post(
  "/skills",
  describeRoute({
    summary: "Create a new skill",
    tags: ["Meta"],
  }),
  requireAuth,
  sValidator("json", CreateSkillSchema),
  async (c) => {
    const data = c.req.valid("json");
    const skill = await metaService.createSkill(data);
    return created(c, skill, "Skill created successfully");
  }
);

// -- Languages --
metaRoutes.get(
  "/languages",
  describeRoute({
    summary: "Search languages",
    tags: ["Meta"],
  }),
  sValidator("query", SearchMetaSchema),
  async (c) => {
    const query = c.req.valid("query");
    const languages = await metaService.searchLanguages(query);
    return ok(c, languages);
  }
);

metaRoutes.post(
  "/languages",
  describeRoute({
    summary: "Create a new language",
    tags: ["Meta"],
  }),
  requireAuth,
  sValidator("json", CreateLanguageSchema),
  async (c) => {
    const data = c.req.valid("json");
    const language = await metaService.createLanguage(data);
    return created(c, language, "Language created successfully");
  }
);
