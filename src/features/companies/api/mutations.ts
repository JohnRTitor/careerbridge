import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyKeys } from "./query-keys";
import * as api from "./api";
import type { 
  CreateCompanyPayload, 
  UpdateCompanyPayload, 
  AddCompanyMemberPayload, 
  UpdateCompanyMemberPayload 
} from "./types";

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCompanyPayload }) => api.updateCompany(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteCompany,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });
};

export const useFollowCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.followCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...companyKeys.all, "followed"] });
    },
  });
};

export const useUnfollowCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.unfollowCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...companyKeys.all, "followed"] });
    },
  });
};

export const useAddCompanyMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddCompanyMemberPayload }) => api.addCompanyMember(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [...companyKeys.detail(id), "members"] });
    },
  });
};

export const useUpdateCompanyMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId, data }: { id: string; userId: string; data: UpdateCompanyMemberPayload }) => api.updateCompanyMember(id, userId, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [...companyKeys.detail(id), "members"] });
    },
  });
};

export const useRemoveCompanyMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => api.removeCompanyMember(id, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [...companyKeys.detail(id), "members"] });
    },
  });
};
