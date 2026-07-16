import { requireAdmin, requireUser } from "../utils/auth";

export type AdminSession = NonNullable<
  Awaited<ReturnType<typeof requireAdmin>>
>;

export type UserSession = NonNullable<Awaited<ReturnType<typeof requireUser>>>;

export type AdminEnv = {
  Variables: {
    session: AdminSession;
  };
};

export type UserEnv = {
  Variables: {
    session: UserSession;
  };
};
