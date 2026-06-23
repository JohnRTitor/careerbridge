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

export const roles = {
  user: {
    user: ["read", "update"],
    profile: ["read", "create", "update"],
  },

  candidate: {
    user: ["read", "update"],
    profile: ["read", "create", "update"],
    resume: ["read", "create", "update", "delete"],
    job: ["read"],
    application: ["read", "create", "withdraw"],
  },

  recruiter: {
    user: ["read", "update"],
    profile: ["read", "create", "update"],
    company: ["read", "update"],
    job: ["read", "create", "update", "delete", "publish", "close"],
    application: ["read", "review"],
  },

  admin: {
    user: ["read", "update", "delete"],
    profile: ["read", "create", "update", "delete"],
    resume: ["read", "create", "update", "delete"],
    job: ["read", "create", "update", "delete", "publish", "close"],
    application: ["read", "create", "withdraw", "review", "delete"],
    company: ["read", "update", "delete"],
    admin: ["users", "roles", "dashboard"],
  },
};
