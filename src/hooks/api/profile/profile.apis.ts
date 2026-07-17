import type {
  UpdateProfilePayload,
  AddEducationPayload,
  AddExperiencePayload,
} from "./profile.apis.schema";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<T | any> {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`${options?.method ?? "GET"} ${url}`, data);
    }

    return data;
  } catch (error) {
    console.error(`${options?.method ?? "GET"} ${url}`, error);

    return {
      success: false,
      message: "Network Error",
      error: {
        details: error,
      },
    };
  }
}

export async function getProfile() {
  return request("/users/profile");
}

export async function updateProfile(payload: UpdateProfilePayload) {
  return request("/users/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function addEducation(payload: AddEducationPayload) {
  return request("/users/profile/education", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function editEducationById(
  id: string,
  payload: AddEducationPayload,
) {
  return request(`/users/profile/education/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteEducationById(id: string) {
  return request(`/users/profile/education/${id}`, {
    method: "DELETE",
  });
}

export async function addExperience(payload: AddExperiencePayload) {
  return request("/users/profile/experience", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function editExperienceById(
  id: string,
  payload: AddExperiencePayload,
) {
  return request(`/users/profile/experience/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteExperienceById(id: string) {
  return request(`/users/profile/experience/${id}`, {
    method: "DELETE",
  });
}
