import { getSession } from "@server/auth/utils";
import { redirect } from "next/navigation";
// instant = false is required here because getSession() is blocking and must complete
// before we can determine if the user needs onboarding. We cannot stream a generic shell
// because the layout and logic entirely depend on the auth state.
export const instant = false;
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
