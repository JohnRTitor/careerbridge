import { Context } from "hono";
import { auth } from "../../auth/auth";
import { HTTPException } from "hono/http-exception";

export async function requireUser(c: Context) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session?.user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  return session;
}

export async function requireAdmin(c: Context) {
  const session = await requireUser(c);
  
  if (session.user.role !== "admin") {
    throw new HTTPException(403, { message: "Forbidden: Admin access required" });
  }

  return session;
}
