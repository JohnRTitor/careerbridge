import type { ErrorResponse } from "@server/shared/responses";
import { rpcClient } from "@/lib/api/rpc";
import type { InferRequestType } from "hono/client";
import type { 
  SearchMetaPayload, 
  CreateSkillPayload, 
  CreateLanguagePayload 
} from "./types";

export const searchSkills = async (params: SearchMetaPayload) => {
  const query = {
    ...params,
    limit: params.limit?.toString(),
  };
  const res = await rpcClient.api.meta.skills.$get({ query: query as InferRequestType<typeof rpcClient.api.meta.skills.$get>["query"] });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to fetch skills");
  }
  const json = await res.json();
  return json.data;
};

export const createSkill = async (data: CreateSkillPayload) => {
  const res = await rpcClient.api.meta.skills.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to create skill");
  }
  const json = await res.json();
  return json.data;
};

export const searchLanguages = async (params: SearchMetaPayload) => {
  const query = {
    ...params,
    limit: params.limit?.toString(),
  };
  const res = await rpcClient.api.meta.languages.$get({ query: query as InferRequestType<typeof rpcClient.api.meta.languages.$get>["query"] });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to fetch languages");
  }
  const json = await res.json();
  return json.data;
};

export const createLanguage = async (data: CreateLanguagePayload) => {
  const res = await rpcClient.api.meta.languages.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to create language");
  }
  const json = await res.json();
  return json.data;
};
