import { requirePagePermission } from "@server/auth/utils";

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePagePermission("job", "create");
  return <>{children}</>;
}
