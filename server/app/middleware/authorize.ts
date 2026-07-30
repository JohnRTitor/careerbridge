import type { Context, Next } from "hono";
import { ForbiddenError } from "../../shared/errors";
import { can } from "../../shared/auth/authorization";

/**
 * Ensures the authenticated user has a specific permission for a resource.
 * Must be used AFTER `requireAuth`.
 */
export function requirePermission(resource: string, action: string) {
  return async (c: Context, next: Next) => {
    const user = c.get("user");
    
    // We expect `requireAuth` to have been called before this
    if (!user) {
      throw new ForbiddenError();
    }

    if (!can(user.role, resource, action)) {
      throw new ForbiddenError();
    }

    await next();
  };
}

