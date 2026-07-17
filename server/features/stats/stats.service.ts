import { statsRepository } from "./stats.repository";

export async function getHomepageStats() {
  return statsRepository.getHomepageStats();
}

export async function getJobCategories() {
  return statsRepository.getJobCategories();
}

export const statsService = {
  getHomepageStats,
  getJobCategories,
};
