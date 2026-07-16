import { ProfilesRepository } from "./profiles.repository";
import { NotFoundError, BadRequestError } from "../../shared/errors";
import { z } from "zod";
import { UpdateProfileSchema, ResumeUploadSchema, EducationSchema, ExperienceSchema } from "./profiles.schemas";

export class ProfilesService {
  static async getProfile(userId: string) {
    const profile = await ProfilesRepository.getProfile(userId);
    if (!profile) {
      // If profile doesn't exist, we might return just user data or a default profile structure
      return { headline: null, about: null, visibility: "public", resume_url: null, portfolio_url: null };
    }
    const education = await ProfilesRepository.getEducation(userId);
    const experience = await ProfilesRepository.getExperience(userId);
    return { ...profile, education, experience };
  }

  static async updateProfile(userId: string, data: z.infer<typeof UpdateProfileSchema>) {
    return ProfilesRepository.upsertProfile(userId, data);
  }

  static async updateResume(userId: string, data: z.infer<typeof ResumeUploadSchema>) {
    return ProfilesRepository.updateResume(userId, data.resume_url);
  }

  static async addEducation(userId: string, data: z.infer<typeof EducationSchema>) {
    return ProfilesRepository.addEducation(userId, data);
  }

  static async updateEducation(id: string, userId: string, data: Partial<z.infer<typeof EducationSchema>>) {
    const result = await ProfilesRepository.updateEducation(id, userId, data);
    if (!result) throw new NotFoundError("Education entry not found");
    return result;
  }

  static async deleteEducation(id: string, userId: string) {
    const success = await ProfilesRepository.deleteEducation(id, userId);
    if (!success) throw new NotFoundError("Education entry not found");
  }

  static async addExperience(userId: string, data: z.infer<typeof ExperienceSchema>) {
    return ProfilesRepository.addExperience(userId, data);
  }

  static async updateExperience(id: string, userId: string, data: Partial<z.infer<typeof ExperienceSchema>>) {
    const result = await ProfilesRepository.updateExperience(id, userId, data);
    if (!result) throw new NotFoundError("Experience entry not found");
    return result;
  }

  static async deleteExperience(id: string, userId: string) {
    const success = await ProfilesRepository.deleteExperience(id, userId);
    if (!success) throw new NotFoundError("Experience entry not found");
  }
}
