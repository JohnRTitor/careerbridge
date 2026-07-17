import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { Role } from "./roles";

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

export async function requireRole(...roles: Role[]) {
  const session = await requireAuth();
  if (!roles.includes(session.user.role as Role)) {
    redirect("/unauthorized");
  }
  return session;
}

export async function isAdmin() {
  const session = await getSession();
  return session?.user?.role === "admin";
}

export async function isRecruiter() {
  const session = await getSession();
  return session?.user?.role === "recruiter";
}

export async function isCandidate() {
  const session = await getSession();
  return session?.user?.role === "candidate";
}

export async function requireJobOwner(job: { recruiter_id: string }) {
  const session = await requireAuth();
  if (session.user.role === "admin") {
    return true;
  }
  if (job.recruiter_id === session.user.id) {
    return true;
  }
  redirect("/unauthorized");
}
