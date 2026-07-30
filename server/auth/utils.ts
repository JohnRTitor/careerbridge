import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { Role } from "./roles";
import { can } from "../shared/auth/authorization";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requirePagePermission(resource: string, action: string) {
  const session = await requireAuth();
  if (!can(session.user.role, resource, action)) {
    redirect("/unauthorized");
  }
  return session;
}

export async function requireJobOwner(job: { recruiter_id: string }) {
  const session = await requireAuth();
  if (can(session.user.role, "admin", "moderate")) {
    return true;
  }
  if (job.recruiter_id === session.user.id) {
    return true;
  }
  redirect("/unauthorized");
}
