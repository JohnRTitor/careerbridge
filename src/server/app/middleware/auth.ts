import type { Context, Next } from "hono";
import { auth as betterAuth } from "../../../auth/auth";
import { UnauthorizedError } from "../../shared/errors";

/**
 * Middleware to ensure the user is authenticated.
 * Attaches `user` and `session` to the Hono context.
 */
export async function requireAuth(c: Context, next: Next) {
  const session = await betterAuth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    throw new UnauthorizedError("Authentication required");
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
}

/**
 * Middleware to optionally load the user if authenticated.
 * Does not throw if the user is not authenticated.
 */
export async function optionalAuth(c: Context, next: Next) {
  const session = await betterAuth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (session) {
    c.set("user", session.user);
    c.set("session", session.session);
  }
  await next();
}
