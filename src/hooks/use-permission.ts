import { useSession } from "@/lib/auth-client";
import { can, cannot } from "@server/shared/auth/authorization";

/**
 * Hook for checking user permissions on the client side.
 * Relies on the user's role stored in the active session.
 * 
 * @example
 * const { can, isLoading } = usePermission();
 * 
 * if (isLoading) return <Loading />;
 * if (can("job", "create")) return <CreateJobButton />;
 */
export function usePermission() {
  const { data: session, isPending, error } = useSession();

  const role = session?.user?.role;

  return {
    /** Checks if the user's role has permission for a specific action on a resource */
    can: (resource: string, action: string) => can(role, resource, action),
    /** Checks if the user's role lacks permission for a specific action on a resource */
    cannot: (resource: string, action: string) => cannot(role, resource, action),
    isLoading: isPending,
    error,
  };
}
