
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

// Base links for any logged-in user
export const commonDashboardLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard" },
];

export const candidateLinks: NavLink[] = [
  ...commonDashboardLinks,
  { href: "/jobs", label: "Find Jobs" },
  { href: "/dashboard/applications", label: "Applications" },
  { href: "/dashboard/saved-jobs", label: "Saved Jobs" },
];

export const recruiterLinks: NavLink[] = [
  ...commonDashboardLinks,
  // Assuming these are standard recruiter paths; adapt if different
  { href: "/dashboard/post-job", label: "Post a Job" },
  // Optional: { href: "/dashboard/applicants", label: "Applicants" },
  // Optional: { href: "/dashboard/company", label: "Company" },
];

export const adminLinks: NavLink[] = [
  ...commonDashboardLinks,
  // Assume generic admin routes
  // { href: "/dashboard/admin/users", label: "Users" },
  // { href: "/dashboard/admin/jobs", label: "Jobs" },
  // { href: "/dashboard/admin/companies", label: "Companies" },
];

export function getLinksForRole(role?: string | null): NavLink[] {
  switch (role) {
    case "admin":
      return adminLinks;
    case "recruiter":
      return recruiterLinks;
    case "candidate":
      return candidateLinks;
    default:
      return publicLinks;
  }
}
