
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role?: string;
  banned?: boolean;
  banReason?: string;
  banExpires?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  q?: string;
  role?: string;
  banned?: boolean;
  page?: number;
  limit?: number;
}

export type UpdateUserRolePayload = {
  role: string;
};

export type UpdateUserStatusPayload = {
  banned: boolean;
  banReason?: string;
  banExpires?: string;
};

export interface AuditLogFilters {
  page?: number;
  limit?: number;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  action: string;
  target_type: string;
  target_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

export type VerifyCompanyPayload = {
  is_verified: boolean;
};
