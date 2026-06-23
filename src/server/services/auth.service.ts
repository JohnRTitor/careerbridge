import { auth } from "../../auth/auth";
import { updateUserRole } from "../repositories/user.repository";

export async function registerNewUser(
  name: string,
  email: string,
  password: string,
  accountType: "candidate" | "recruiter"
) {
  // Use Better Auth's Node API to create the user
  const response = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!response?.user?.id) {
    throw new Error("Failed to create user");
  }

  // Update the user's role based on the selected account type
  const updatedUser = await updateUserRole(response.user.id, accountType);
  
  return {
    user: updatedUser,
  };
}
