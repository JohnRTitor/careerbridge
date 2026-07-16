import type { Context, Next } from "hono";
import { ResourceForbiddenError, NotFoundError } from "../../shared/errors";
import type { AppEnv } from "../../shared/types";

/**
 * Ensures the authenticated user has ownership rights over a specific resource.
 * Must be used AFTER `requireAuth`.
 * 
 * @param getResource A function that returns the resource from the database (or throws NotFoundError).
 * @param checkOwnership A function that determines if the user owns the resource.
 */
export function requireOwnership<T>(
  getResource: (c: Context<AppEnv>) => Promise<T> | T,
  checkOwnership: (user: AppEnv["Variables"]["user"], resource: T) => boolean
) {
  return async (c: Context<AppEnv>, next: Next) => {
    const user = c.get("user");
    
    if (!user) {
      throw new ResourceForbiddenError();
    }

    // Admins bypass ownership checks
    if (user.role === "admin") {
      await next();
      return;
    }

    const resource = await getResource(c);
    
    if (!resource) {
      throw new NotFoundError("Resource not found");
    }

    if (!checkOwnership(user, resource)) {
      throw new ResourceForbiddenError();
    }

    // Attach resource to context so controllers don't need to fetch it again
    c.set("resource", resource);

    await next();
  };
}
