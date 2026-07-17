import { hc } from "hono/client";
import type { AppType } from "../../../server/app/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const rpcClient = hc<AppType>(BASE_URL);
