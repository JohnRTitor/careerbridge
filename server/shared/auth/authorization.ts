import { ac, admin, candidate, recruiter, user } from "../../auth/permissions";

const rolesMap: Record<string, ReturnType<typeof ac.newRole>> = {
  admin,
  candidate,
  recruiter,
  user,
};

/**
 * Checks if a role has a specific permission for a resource.
 * Example: can("recruiter", "job", "create") -> true
 */
export function can(roleName: string | undefined | null, resource: string, action: string): boolean {
  if (!roleName) return false;
  
  const role = rolesMap[roleName];
  if (!role) return false;

  const resourceStatements = role.statements[resource];
  if (!resourceStatements) return false;

  return resourceStatements.includes(action);
}

/**
 * Checks if a role DOES NOT have a specific permission for a resource.
 * Example: cannot("candidate", "job", "create") -> true
 */
export function cannot(roleName: string | undefined | null, resource: string, action: string): boolean {
  return !can(roleName, resource, action);
}
