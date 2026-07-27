import { getSession } from "@server/auth/utils";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  // If the user already has a valid role set (e.g., they completed onboarding), redirect them.
  // The default role assigned to new users by Better Auth is often "user".
  if (session.user.role && session.user.role !== "user") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <OnboardingForm user={session.user} />
    </div>
  );
}
