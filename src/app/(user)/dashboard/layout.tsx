// instant = false is required here because child pages use getSession() to determine
// the entire layout and component tree based on auth role. We cannot stream a generic shell.
export const instant = false;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
