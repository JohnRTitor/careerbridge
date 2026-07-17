import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { requireAuth } from "../../app/middleware/auth";
import { requireAdmin, requirePermission } from "../../app/middleware/authorize";
import { adminService } from "./admin.service";
import { UsersQuerySchema, UpdateUserRoleSchema, UpdateUserStatusSchema } from "./admin.schemas";
import { companiesService } from "../companies/companies.service";
import { VerifyCompanySchema } from "../companies/companies.schemas";
import { auditService } from "../audit/audit.service";
import { PaginationQuerySchema, UuidParamSchema } from "../../shared/schemas";
import { ok } from "../../shared/responses";
import { z } from "zod";

const UserIdParamSchema = z.object({ id: z.string() }).meta({ id: "UserIdParam" });

const app = new Hono<AppEnv>();

// All admin routes require auth and 'admin' role
app.use("*", requireAuth);
app.use("*", requireAdmin());

export const adminRoutes = app
  .get(
    "/users",
    describeRoute({
      summary: "List all users",
      tags: ["Admin"],
    }),
    sValidator("query", UsersQuerySchema),
    requirePermission("admin", "users"),
    async (c) => {
      const input = c.req.valid("query");
      const result = await adminService.listUsers(input);
      return ok(c, result);
    }
  )
  .patch(
    "/users/:id/role",
    describeRoute({
      summary: "Change user role",
      tags: ["Admin"],
    }),
    sValidator("param", UserIdParamSchema),
    sValidator("json", UpdateUserRoleSchema),
    requirePermission("admin", "roles"),
    async (c) => {
      const { id: userId } = c.req.valid("param");
      const data = c.req.valid("json");
      const user = await adminService.updateUserRole({ userId, data });
      
      // Audit log
      await auditService.logAction({
        actorId: c.get("user").id, 
        action: "UPDATE_USER_ROLE", 
        targetType: "user", 
        targetId: userId, 
        details: data 
      });
      
      return ok(c, user, "Role updated successfully");
    }
  )
  .patch(
    "/users/:id/status",
    describeRoute({
      summary: "Change user status (ban/unban)",
      tags: ["Admin"],
    }),
    sValidator("param", UserIdParamSchema),
    sValidator("json", UpdateUserStatusSchema),
    requirePermission("admin", "moderate"),
    async (c) => {
      const { id: userId } = c.req.valid("param");
      const data = c.req.valid("json");
      const user = await adminService.updateUserStatus({ userId, data });
      
      // Audit log
      await auditService.logAction({
        actorId: c.get("user").id, 
        action: "UPDATE_USER_STATUS", 
        targetType: "user", 
        targetId: userId, 
        details: data 
      });
      
      return ok(c, user, "Status updated successfully");
    }
  )
  .get(
    "/audit-logs",
    describeRoute({
      summary: "Retrieve audit logs",
      tags: ["Admin"],
    }),
    sValidator("query", PaginationQuerySchema),
    requirePermission("analytics", "read"),
    async (c) => {
      const input = c.req.valid("query");
      const logs = await auditService.getLogs(input);
      return ok(c, logs);
    }
  )
  .patch(
    "/companies/:id/verify",
    describeRoute({
      summary: "Verify a company profile",
      tags: ["Admin"],
    }),
    sValidator("param", UuidParamSchema),
    sValidator("json", VerifyCompanySchema),
    requirePermission("company", "verify"),
    async (c) => {
      const { id: companyId } = c.req.valid("param");
      const data = c.req.valid("json");
      // Will update CompaniesService later
      const company = await companiesService.verifyCompany({ companyId, isVerified: data.is_verified });
      
      // Audit log
      await auditService.logAction({
        actorId: c.get("user").id, 
        action: "VERIFY_COMPANY", 
        targetType: "company", 
        targetId: companyId, 
        details: data 
      });
      
      return ok(c, company, "Company verification updated");
    }
  );
