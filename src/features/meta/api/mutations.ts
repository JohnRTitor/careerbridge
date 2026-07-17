import { useMutation, useQueryClient } from "@tanstack/react-query";
import { metaKeys } from "./query-keys";
import * as api from "./api";
export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...metaKeys.all, "skills"] });
    },
  });
};

export const useCreateLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...metaKeys.all, "languages"] });
    },
  });
};
