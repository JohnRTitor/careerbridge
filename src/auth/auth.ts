import { betterAuth } from "better-auth";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, user, candidate, recruiter, admin } from "./permissions";
import { pool } from "../server/app/db";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        user,
        candidate,
        recruiter,
        admin,
      },
    }),
  ],
});
