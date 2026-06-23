import { createAccessControl } from "better-auth/plugins/access";

export const ac = createAccessControl({
  user: ["read", "update", "delete"],
  profile: ["read", "create", "update", "delete"],
  job: ["read", "create", "update", "delete", "publish", "close"],
  application: ["read", "create", "withdraw", "review", "delete"],
  resume: ["read", "create", "update", "delete"],
  company: ["read", "update", "delete"],
  admin: ["users", "roles", "dashboard"],
});

export const user = ac.newRole({
  user: ["read", "update"],
  profile: ["read", "create", "update"],
});

export const candidate = ac.newRole({
  ...user.statements,
  resume: ["read", "create", "update", "delete"],
  job: ["read"],
  application: ["read", "create", "withdraw"],
});

export const recruiter = ac.newRole({
  ...user.statements,
  company: ["read", "update"],
  job: ["read", "create", "update", "delete", "publish", "close"],
  application: ["read", "review"],
});

export const admin = ac.newRole({
  user: ["read", "update", "delete"],
  profile: ["read", "create", "update", "delete"],
  resume: ["read", "create", "update", "delete"],
  job: ["read", "create", "update", "delete", "publish", "close"],
  application: ["read", "create", "withdraw", "review", "delete"],
  company: ["read", "update", "delete"],
  admin: ["users", "roles", "dashboard"],
});
