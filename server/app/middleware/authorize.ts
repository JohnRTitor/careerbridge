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

/**
 * Ensures the authenticated user has one of the specified roles.
 * Prefer `requirePermission` over this when checking access to specific resources.
 */
export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get("user");
    
    if (!user) {
      throw new ForbiddenError();
    }

    if (!user.role || !roles.includes(user.role)) {
      throw new ForbiddenError();
    }

    await next();
  };
}

/** Syntactic sugar for admin requirement */
export function requireAdmin() {
  return requireRole("admin");
}

/** Syntactic sugar for candidate requirement */
export function requireCandidate() {
  return requireRole("candidate");
}

/** Syntactic sugar for recruiter requirement */
export function requireRecruiter() {
  return requireRole("recruiter");
}
