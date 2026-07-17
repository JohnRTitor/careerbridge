import { getSession } from "@server/auth/utils";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  // If the user already has a role set (e.g., they completed onboarding), redirect them.
  if (session.user.role === "candidate") {
    redirect("/candidate_dashboard");
  }
  if (session.user.role === "recruiter") {
    redirect("/recruiter_dashboard");
  }
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <OnboardingForm user={session.user} />
    </div>
  );
}
