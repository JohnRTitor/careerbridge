"use server";

import { auth } from "@/auth/auth";
import { updateUserRole } from "@/server/modules/user/user.service";
import { headers } from "next/headers";
import { LoginInput, RegisterInput } from "@/lib/zod-schemas";

export async function loginAction(data: LoginInput) {
  try {
    // In server actions with better-auth, we can pass headers to automatically set cookies.
    const response = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      headers: await headers(),
    });

    if (!response?.user) {
      return { error: "Invalid credentials" };
    }

    return { success: true, user: response.user };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "An error occurred during login" };
  }
}

export async function registerAction(data: RegisterInput) {
  try {
    const response = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.fullName,
      },
      headers: await headers(),
    });

    if (!response?.user) {
      return { error: "Failed to create user" };
    }

    // Assign the role requested
    const updatedUser = await updateUserRole(response.user.id, data.accountType);

    return { success: true, user: updatedUser };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "An error occurred during registration" };
  }
}
