import type { Context, Next } from "hono";
import { auth } from "../../../auth/auth";
import { UnauthorizedError, ForbiddenError } from "../../shared/errors";

export async function authGuard(c: Context, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    throw new UnauthorizedError("Authentication required");
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
}

export function roleGuard(allowedRoles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get("user");
    
    if (!user) {
      throw new UnauthorizedError("Authentication required");
    }

    if (!user.role || !allowedRoles.includes(user.role)) {
      throw new ForbiddenError(`Requires one of roles: ${allowedRoles.join(", ")}`);
    }

    await next();
  };
}
