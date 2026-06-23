import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, user, candidate, recruiter, admin } from "@/auth/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,

  plugins: [
    adminClient({
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

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  updateSession,
  getAccessToken,
  changeEmail,
  changePassword,
  resetPassword,
  requestPasswordReset,
  refreshToken,
} = authClient;
