import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "./query-keys";
import * as api from "./api";
import type { 
  UpdateEducationPayload, 
  UpdateExperiencePayload,
  UpdateCertificationPayload,
  UpdateProjectPayload,
  UpdateResumeEntityPayload,
  UpdateUserSkillPayload,
  UpdateUserLanguagePayload,
  UpdateSocialLinkPayload
} from "./types";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useAddEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEducationPayload }) =>
      api.updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useAddExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExperiencePayload }) =>
      api.updateExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useAddCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useUpdateCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCertificationPayload }) =>
      api.updateCertification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useDeleteCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useAddProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectPayload }) =>
      api.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useAddResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
      queryClient.invalidateQueries({ queryKey: [...profileKeys.profile(), "resumes"] });
    },
  });
};

export const useUpdateResumeEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResumeEntityPayload }) =>
      api.updateResumeEntity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
      queryClient.invalidateQueries({ queryKey: [...profileKeys.profile(), "resumes"] });
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
      queryClient.invalidateQueries({ queryKey: [...profileKeys.profile(), "resumes"] });
    },
  });
};

export const useAddUserSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addUserSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useUpdateUserSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserSkillPayload }) =>
      api.updateUserSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useDeleteUserSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteUserSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useAddUserLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addUserLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useUpdateUserLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserLanguagePayload }) =>
      api.updateUserLanguage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useDeleteUserLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteUserLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useAddSocialLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addSocialLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useUpdateSocialLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSocialLinkPayload }) =>
      api.updateSocialLink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useDeleteSocialLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteSocialLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useUpdateJobPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateJobPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
      queryClient.invalidateQueries({ queryKey: [...profileKeys.profile(), "preferences"] });
    },
  });
};
