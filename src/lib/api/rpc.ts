import { hc } from "hono/client";
import type { AppType } from "../../../server/app/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const rpcClient = hc<AppType>(BASE_URL);

/**
 * A generic helper to handle Hono RPC error responses.
 * By throwing the error cleanly here, we allow TypeScript to perfectly narrow
 * the success response of `res.json()` in the calling function.
 */
export async function handleRpcError(res: Response): Promise<never> {
  const errorData = await res.json().catch(() => null);
  if (errorData && typeof errorData === "object" && "message" in errorData) {
    throw new Error(String(errorData.message));
  }
  throw new Error(`API Request failed with status ${res.status}`);
}
