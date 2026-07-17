import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminKeys } from "./query-keys";
import { companyKeys } from "@/features/companies/api/query-keys";
import * as api from "./api";
import type { UpdateUserRolePayload, UpdateUserStatusPayload, VerifyCompanyPayload } from "./types";

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRolePayload }) => 
      api.updateUserRole(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserStatusPayload }) => 
      api.updateUserStatus(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

export const useVerifyCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, data }: { companyId: string; data: VerifyCompanyPayload }) => 
      api.verifyCompany(companyId, data),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) });
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });
};
