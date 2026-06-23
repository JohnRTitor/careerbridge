import { createAccessControl } from "better-auth/plugins/access";

export const ac = createAccessControl({
  user: ["read", "update", "delete"],
  profile: ["read", "create", "update"],
  job: ["read", "create", "update", "delete", "publish", "close"],
  application: ["read", "create", "withdraw", "review"],
  resume: ["read", "create", "update", "delete"],
  bookmark: ["read", "create", "delete"],
  company: ["read", "update", "verify"],
  analytics: ["read"],
  admin: ["users", "roles", "moderate", "settings", "dashboard"],
});

export const user = ac.newRole({
  user: ["read", "update"],
  profile: ["read", "create", "update"],
});

export const candidate = ac.newRole({
  ...user.statements,
  job: ["read"],
  application: ["read", "create", "withdraw"],
  resume: ["read", "create", "update", "delete"],
  bookmark: ["read", "create", "delete"],
});

export const recruiter = ac.newRole({
  ...user.statements,
  job: ["read", "create", "update", "delete", "publish", "close"],
  application: ["read", "review"],
  company: ["read", "update"],
  analytics: ["read"],
});

export const admin = ac.newRole({
  user: ["read", "update", "delete"],
  profile: ["read", "create", "update"],
  job: ["read", "create", "update", "delete", "publish", "close"],
  application: ["read", "create", "withdraw", "review"],
  resume: ["read", "create", "update", "delete"],
  bookmark: ["read", "create", "delete"],
  company: ["read", "update", "verify"],
  analytics: ["read"],
  admin: ["users", "roles", "moderate", "settings", "dashboard"],
});
