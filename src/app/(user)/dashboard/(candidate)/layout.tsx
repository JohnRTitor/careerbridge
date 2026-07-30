import { requirePagePermission } from "@server/auth/utils";

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePagePermission("application", "create");
  return <>{children}</>;
}
