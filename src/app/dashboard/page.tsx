import { getSession } from "@server/auth/utils";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import RecruiterDashboard from "@/components/dashboard/recruiter-dashboard";
import CandidateDashboard from "@/components/dashboard/candidate-dashboard";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  if (!role) {
    redirect("/onboarding");
  }

  switch (role) {
    case "admin":
      return <AdminDashboard />;
    case "recruiter":
      return <RecruiterDashboard />;
    case "candidate":
      return <CandidateDashboard />;
    default:
      redirect("/onboarding");
  }
}
