import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { requireAuth } from "../../app/middleware/auth";
import { requireAdmin, requirePermission } from "../../app/middleware/authorize";
import { AdminService } from "./admin.service";
import { UsersQuerySchema, UpdateUserRoleSchema, UpdateUserStatusSchema } from "./admin.schemas";
import { CompaniesService } from "../companies/companies.service";
import { VerifyCompanySchema } from "../companies/companies.schemas";
import { AuditService } from "../audit/audit.service";
import { PaginationQuerySchema, UuidParamSchema } from "../../shared/schemas";
import { ok } from "../../shared/responses";
import { z } from "zod";

const UserIdParamSchema = z.object({ id: z.string() }).meta({ id: "UserIdParam" });

export const adminRoutes = new Hono<AppEnv>();

// All admin routes require auth and 'admin' role
adminRoutes.use("*", requireAuth);
adminRoutes.use("*", requireAdmin());

adminRoutes.get(
  "/users",
  describeRoute({
    summary: "List all users",
    tags: ["Admin"],
  }),
  sValidator("query", UsersQuerySchema),
  requirePermission("admin", "users"),
  async (c) => {
    const query = c.req.valid("query");
    const result = await AdminService.listUsers(query);
    return ok(c, result);
  }
);

adminRoutes.put(
  "/users/:id/role",
  describeRoute({
    summary: "Change user role",
    tags: ["Admin"],
  }),
  sValidator("param", UserIdParamSchema),
  sValidator("json", UpdateUserRoleSchema),
  requirePermission("admin", "roles"),
  async (c) => {
    const { id } = c.req.valid("param");
    const { role } = c.req.valid("json");
    const user = await AdminService.updateUserRole(id, role);
    
    // Audit log
    await AuditService.logAction(c.get("user").id, "UPDATE_USER_ROLE", "user", id, { role });
    
    return ok(c, user, "Role updated successfully");
  }
);

adminRoutes.put(
  "/users/:id/status",
  describeRoute({
    summary: "Change user status (ban/unban)",
    tags: ["Admin"],
  }),
  sValidator("param", UserIdParamSchema),
  sValidator("json", UpdateUserStatusSchema),
  requirePermission("admin", "moderate"),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const user = await AdminService.updateUserStatus(id, data);
    
    // Audit log
    await AuditService.logAction(c.get("user").id, "UPDATE_USER_STATUS", "user", id, data);
    
    return ok(c, user, "Status updated successfully");
  }
);

adminRoutes.get(
  "/audit-logs",
  describeRoute({
    summary: "Retrieve audit logs",
    tags: ["Admin"],
  }),
  sValidator("query", PaginationQuerySchema),
  requirePermission("analytics", "read"),
  async (c) => {
    const query = c.req.valid("query");
    const logs = await AuditService.getLogs(query);
    return ok(c, logs);
  }
);

adminRoutes.put(
  "/companies/:id/verify",
  describeRoute({
    summary: "Verify a company profile",
    tags: ["Admin"],
  }),
  sValidator("param", UuidParamSchema),
  sValidator("json", VerifyCompanySchema),
  requirePermission("company", "verify"),
  async (c) => {
    const { id } = c.req.valid("param");
    const { is_verified } = c.req.valid("json");
    const company = await CompaniesService.verifyCompany(id, is_verified);
    
    // Audit log
    await AuditService.logAction(c.get("user").id, "VERIFY_COMPANY", "company", id, { is_verified });
    
    return ok(c, company, "Company verification updated");
  }
);
