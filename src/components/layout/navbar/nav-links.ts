import { can } from "@server/shared/auth/authorization";

export type NavLink = {
  href: string;
  label: string;
};

// Base links for all logged-out users
export const publicLinks: NavLink[] = [
  { href: "/jobs", label: "Find Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/categories", label: "Categories" },
  { href: "/#how-it-works", label: "How it Works" },
];

export function getLinksForPermissions(role?: string | null): NavLink[] {
  if (!role) return publicLinks;

  const links: NavLink[] = [
    { href: "/dashboard", label: "Dashboard" }
  ];

  if (can(role, "application", "read")) {
    links.push({ href: "/jobs", label: "Find Jobs" });
    links.push({ href: "/dashboard/applications", label: "Applications" });
  }

  if (can(role, "bookmark", "read")) {
    links.push({ href: "/dashboard/saved-jobs", label: "Saved Jobs" });
  }

  if (can(role, "job", "create")) {
    links.push({ href: "/dashboard/post-job", label: "Post a Job" });
  }

  return links;
}
