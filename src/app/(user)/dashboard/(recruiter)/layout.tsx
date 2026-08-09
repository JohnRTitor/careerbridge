// instant = false is required here because requirePagePermission is blocking.
// We must verify the user's role before rendering the dashboard layout to prevent
// unauthorized access or flickering of authorized content.
export const instant = false;
import { requirePagePermission } from "@server/auth/utils";

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePagePermission("job", "create");
  return <>{children}</>;
}
