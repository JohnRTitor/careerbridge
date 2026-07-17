import { useMutation, useQueryClient } from "@tanstack/react-query";
import { metaKeys } from "./query-keys";
import * as api from "./api";
import type { CreateSkillPayload, CreateLanguagePayload } from "./types";

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metaKeys.all.concat(["skills"]) });
    },
  });
};

export const useCreateLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metaKeys.all.concat(["languages"]) });
    },
  });
};
