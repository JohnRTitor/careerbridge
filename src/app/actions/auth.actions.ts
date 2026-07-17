"use server";

import { auth } from "@server/auth/auth";
import { adminService } from "@server/features/admin/admin.service";
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

    return { success: true, user: response.user };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "An error occurred during registration" };
  }
}

import { pool } from "@server/app/db";
import { OnboardingInput } from "@/lib/zod-schemas";

export async function submitOnboardingAction(data: OnboardingInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Update user role
    await adminService.updateUserRole({
      userId,
      data: { role: data.accountType },
    });

    // Insert or update profile fields
    await pool.query(
      `
      INSERT INTO user_profile (user_id, date_of_birth, gender)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id) DO UPDATE SET
        date_of_birth = EXCLUDED.date_of_birth,
        gender = EXCLUDED.gender,
        updated_at = now()
      `,
      [userId, data.dateOfBirth, data.gender]
    );

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "An error occurred during onboarding" };
  }
}
