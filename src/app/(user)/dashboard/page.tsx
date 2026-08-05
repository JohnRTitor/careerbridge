import { getSession } from "@server/auth/utils";
import { redirect } from "next/navigation";
import AdminDashboard from "@/features/dashboard/components/admin-dashboard";
import RecruiterDashboard from "@/features/dashboard/components/recruiter-dashboard";
import CandidateDashboard from "@/features/dashboard/components/candidate-dashboard";
import { can } from "@server/shared/auth/authorization";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  if (!role) {
    redirect("/onboarding");
  }

  if (can(role, "admin", "dashboard")) {
    return <AdminDashboard />;
  }

  if (can(role, "job", "create")) {
    return <RecruiterDashboard />;
  }

  if (can(role, "application", "create")) {
    return <CandidateDashboard />;
  }

  redirect("/onboarding");
}
